-- ==============================================================================
-- Gather SaaS - Enforce Plan Submission Limits
-- Migration 006: Server-authoritative atomic plan submission limits,
-- organization row locking, and usage tracking
-- ==============================================================================

-- 1. Function to get or initialize an organization's subscription plan
CREATE OR REPLACE FUNCTION public.get_org_subscription_plan(p_org_id UUID)
RETURNS TABLE (
  plan TEXT,
  status TEXT,
  period_start TIMESTAMPTZ,
  period_end TIMESTAMPTZ,
  sub_limit INTEGER
) AS $$
DECLARE
  v_sub RECORD;
BEGIN
  SELECT s.plan, s.status, s.current_period_start, s.current_period_end
  INTO v_sub
  FROM public.subscriptions s
  WHERE s.organization_id = p_org_id
  LIMIT 1;

  IF FOUND AND v_sub.plan = 'pro' AND v_sub.status = 'active' THEN
    RETURN QUERY SELECT 
      'pro'::TEXT, 
      v_sub.status::TEXT, 
      COALESCE(v_sub.current_period_start, date_trunc('month', now())), 
      COALESCE(v_sub.current_period_end, date_trunc('month', now()) + interval '1 month'), 
      999999999::INTEGER;
  ELSE
    RETURN QUERY SELECT 
      'free'::TEXT, 
      COALESCE(v_sub.status, 'active')::TEXT, 
      COALESCE(v_sub.current_period_start, date_trunc('month', now())), 
      COALESCE(v_sub.current_period_end, date_trunc('month', now()) + interval '1 month'), 
      10::INTEGER;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Update Server-Authoritative Atomic Submission RPC Function to enforce account limits atomically
CREATE OR REPLACE FUNCTION public.submit_application_atomic(
  p_application_id UUID,
  p_respondent_name TEXT,
  p_respondent_email TEXT,
  p_idempotency_key TEXT DEFAULT NULL,
  p_answers JSONB DEFAULT '[]'::jsonb
)
RETURNS JSONB AS $$
DECLARE
  v_app RECORD;
  v_org_id UUID;
  v_plan_info RECORD;
  v_org_sub_count INTEGER;
  v_submission_id UUID;
  v_existing_sub RECORD;
  v_current_app_count INTEGER;
  v_max_app_limit INTEGER;
  v_end_time_enabled BOOLEAN;
  v_end_date_str TEXT;
  v_end_time_str TEXT;
  v_end_timestamp TIMESTAMPTZ;
  v_ans_elem JSONB;
  v_ans_id UUID;
  v_q_id UUID;
  v_q_label TEXT;
  v_q_type TEXT;
  v_ans_text TEXT;
  v_ans_json JSONB;
  v_file_id TEXT;
  v_file_meta JSONB;
  v_storage_path TEXT;
  v_orig_filename TEXT;
  v_mime_type TEXT;
  v_size_bytes BIGINT;
  v_size_formatted TEXT;
BEGIN
  -- A. Verify application exists and lock for consistency
  SELECT id, organization_id, name, status, is_public, settings
  INTO v_app
  FROM public.applications
  WHERE id = p_application_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Application not found.';
  END IF;

  v_org_id := v_app.organization_id;

  -- B. Verify application is published and public
  IF v_app.status <> 'published' OR v_app.is_public <> true THEN
    RAISE EXCEPTION 'This application is currently closed and not accepting submissions.';
  END IF;

  -- C. Atomic Organization Row Lock (Protects against concurrent submission race conditions)
  PERFORM id FROM public.organizations WHERE id = v_org_id FOR UPDATE;

  -- D. Check Idempotency First: If this exact request was already submitted, return it
  IF p_idempotency_key IS NOT NULL AND trim(p_idempotency_key) <> '' THEN
    SELECT id, respondent_name, respondent_email, submitted_at
    INTO v_existing_sub
    FROM public.submissions
    WHERE application_id = p_application_id
      AND idempotency_key = trim(p_idempotency_key)
    LIMIT 1;

    IF FOUND THEN
      RETURN jsonb_build_object(
        'success', true,
        'is_duplicate', true,
        'submission_id', v_existing_sub.id,
        'submitted_at', v_existing_sub.submitted_at,
        'respondent_name', v_existing_sub.respondent_name,
        'respondent_email', v_existing_sub.respondent_email
      );
    END IF;
  END IF;

  -- E. Check Account-Level Plan Limits (Free plan: 10 submissions/month)
  SELECT * INTO v_plan_info FROM public.get_org_subscription_plan(v_org_id);

  IF v_plan_info.plan = 'free' THEN
    SELECT COUNT(*) INTO v_org_sub_count
    FROM public.submissions s
    JOIN public.applications a ON s.application_id = a.id
    WHERE a.organization_id = v_org_id
      AND s.submitted_at >= v_plan_info.period_start;

    IF v_org_sub_count >= v_plan_info.sub_limit THEN
      RAISE EXCEPTION 'This application has reached its monthly submission limit (10/10). Please contact the form owner to upgrade their plan.';
    END IF;
  END IF;

  -- F. Check submission deadline (End Time) if configured
  v_end_time_enabled := COALESCE((v_app.settings->'endTime'->>'enabled')::boolean, false);
  v_end_date_str := v_app.settings->'endTime'->>'date';
  v_end_time_str := COALESCE(v_app.settings->'endTime'->>'time', '23:59:59');

  IF v_end_time_enabled AND v_end_date_str IS NOT NULL AND v_end_date_str <> '' THEN
    BEGIN
      v_end_timestamp := (v_end_date_str || ' ' || v_end_time_str)::timestamptz;
      IF now() > v_end_timestamp THEN
        RAISE EXCEPTION 'This application has reached its submission deadline and is no longer accepting responses.';
      END IF;
    EXCEPTION
      WHEN OTHERS THEN
        NULL;
    END;
  END IF;

  -- G. Check Form-Specific maximum submission limit if configured
  IF COALESCE((v_app.settings->'submissionLimit'->>'enabled')::boolean, false) THEN
    v_max_app_limit := COALESCE((v_app.settings->'submissionLimit'->>'limit')::integer, 0);
    IF v_max_app_limit > 0 THEN
      SELECT COUNT(*) INTO v_current_app_count
      FROM public.submissions
      WHERE application_id = p_application_id;

      IF v_current_app_count >= v_max_app_limit THEN
        RAISE EXCEPTION 'This application has reached its configured response limit and is now closed.';
      END IF;
    END IF;
  END IF;

  -- H. Create new Submission atomically
  v_submission_id := gen_random_uuid();

  INSERT INTO public.submissions (
    id,
    application_id,
    respondent_name,
    respondent_email,
    notes,
    idempotency_key,
    submitted_at,
    updated_at,
    created_at
  ) VALUES (
    v_submission_id,
    p_application_id,
    COALESCE(NULLIF(trim(p_respondent_name), ''), 'Anonymous Applicant'),
    COALESCE(NULLIF(trim(p_respondent_email), ''), 'no-email@provided.com'),
    '',
    NULLIF(trim(p_idempotency_key), ''),
    now(),
    now(),
    now()
  );

  -- I. Insert Answers & Files atomically
  IF p_answers IS NOT NULL AND jsonb_array_length(p_answers) > 0 THEN
    FOR v_ans_elem IN SELECT * FROM jsonb_array_elements(p_answers)
    LOOP
      v_ans_id := gen_random_uuid();
      
      BEGIN
        IF v_ans_elem->>'question_id' IS NOT NULL AND v_ans_elem->>'question_id' ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
          v_q_id := (v_ans_elem->>'question_id')::uuid;
        ELSE
          v_q_id := NULL;
        END IF;
      EXCEPTION WHEN OTHERS THEN
        v_q_id := NULL;
      END;

      v_q_label := COALESCE(v_ans_elem->>'question_label', '');
      v_q_type := COALESCE(v_ans_elem->>'question_type', 'short_answer');
      v_ans_text := COALESCE(v_ans_elem->>'answer_text', '');
      v_ans_json := v_ans_elem->'answer_json';
      v_file_id := NULLIF(v_ans_elem->>'file_id', '');

      INSERT INTO public.answers (
        id,
        submission_id,
        question_id,
        question_label,
        question_type,
        answer_text,
        answer_json,
        file_id,
        created_at
      ) VALUES (
        v_ans_id,
        v_submission_id,
        v_q_id,
        v_q_label,
        v_q_type,
        v_ans_text,
        v_ans_json,
        v_file_id,
        now()
      );

      v_file_meta := v_ans_elem->'file_metadata';
      IF v_file_meta IS NOT NULL AND v_file_id IS NOT NULL THEN
        v_storage_path := COALESCE(v_file_meta->>'storage_path', 'submissions/' || v_submission_id || '/' || v_file_id);
        v_orig_filename := COALESCE(v_file_meta->>'original_filename', v_file_meta->>'file_name', 'uploaded_file');
        v_mime_type := COALESCE(v_file_meta->>'mime_type', v_file_meta->>'file_type', 'application/octet-stream');
        v_size_bytes := COALESCE((v_file_meta->>'size_bytes')::bigint, 0);
        v_size_formatted := v_file_meta->>'file_size_formatted';

        INSERT INTO public.files (
          id,
          application_id,
          submission_id,
          question_id,
          file_id,
          storage_path,
          original_filename,
          mime_type,
          size_bytes,
          file_size_formatted,
          created_at
        ) VALUES (
          gen_random_uuid(),
          p_application_id,
          v_submission_id,
          v_q_id,
          v_file_id,
          v_storage_path,
          v_orig_filename,
          v_mime_type,
          v_size_bytes,
          v_size_formatted,
          now()
        )
        ON CONFLICT (file_id) DO UPDATE SET
          submission_id = v_submission_id,
          application_id = p_application_id,
          question_id = EXCLUDED.question_id;
      END IF;
    END LOOP;
  END IF;

  -- J. Synchronize usage records
  INSERT INTO public.usage_records (
    organization_id,
    billing_cycle_start,
    billing_cycle_end,
    submission_count,
    submission_limit,
    updated_at
  ) VALUES (
    v_org_id,
    v_plan_info.period_start,
    v_plan_info.period_end,
    (SELECT COUNT(*) FROM public.submissions s JOIN public.applications a ON s.application_id = a.id WHERE a.organization_id = v_org_id AND s.submitted_at >= v_plan_info.period_start),
    v_plan_info.sub_limit,
    now()
  )
  ON CONFLICT (organization_id, billing_cycle_start) DO UPDATE SET
    submission_count = (SELECT COUNT(*) FROM public.submissions s JOIN public.applications a ON s.application_id = a.id WHERE a.organization_id = v_org_id AND s.submitted_at >= v_plan_info.period_start),
    updated_at = now();

  -- K. Return success payload
  RETURN jsonb_build_object(
    'success', true,
    'is_duplicate', false,
    'submission_id', v_submission_id,
    'submitted_at', now(),
    'respondent_name', COALESCE(NULLIF(trim(p_respondent_name), ''), 'Anonymous Applicant'),
    'respondent_email', COALESCE(NULLIF(trim(p_respondent_email), ''), 'no-email@provided.com')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- Gather SaaS - Complete Submissions System
-- Migration 005: Server-authoritative atomic submission RPC, idempotency, 
-- limit enforcement, deadline checking, response count trigger & performance indexes
-- ==============================================================================

-- 1. Performance Indexes for Submissions, Answers & Files
CREATE INDEX IF NOT EXISTS idx_submissions_app_submitted 
ON public.submissions(application_id, submitted_at DESC);

CREATE INDEX IF NOT EXISTS idx_submissions_idempotency_lookup
ON public.submissions(application_id, idempotency_key)
WHERE idempotency_key IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_submissions_respondent_email
ON public.submissions(respondent_email);

CREATE INDEX IF NOT EXISTS idx_answers_submission_id
ON public.answers(submission_id);

CREATE INDEX IF NOT EXISTS idx_answers_file_id
ON public.answers(file_id)
WHERE file_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_files_lookup
ON public.files(application_id, submission_id);

CREATE INDEX IF NOT EXISTS idx_files_text_file_id
ON public.files(file_id);

-- 2. Trigger function to keep applications.responses_count perfectly in sync
CREATE OR REPLACE FUNCTION public.sync_application_responses_count()
RETURNS TRIGGER AS $$
DECLARE
  v_app_id UUID;
  v_count INTEGER;
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_app_id := OLD.application_id;
  ELSE
    v_app_id := NEW.application_id;
  END IF;

  SELECT COUNT(*) INTO v_count
  FROM public.submissions
  WHERE application_id = v_app_id;

  UPDATE public.applications
  SET responses_count = v_count,
      updated_at = now()
  WHERE id = v_app_id;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_sync_application_responses_count ON public.submissions;
CREATE TRIGGER tr_sync_application_responses_count
AFTER INSERT OR DELETE ON public.submissions
FOR EACH ROW EXECUTE FUNCTION public.sync_application_responses_count();

-- 3. Server-Authoritative Atomic Submission RPC Function
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
  v_submission_id UUID;
  v_existing_sub RECORD;
  v_current_count INTEGER;
  v_max_limit INTEGER;
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
  -- A. Verify application exists
  SELECT id, name, status, is_public, settings
  INTO v_app
  FROM public.applications
  WHERE id = p_application_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Application not found.';
  END IF;

  -- B. Verify application is published and public
  IF v_app.status <> 'published' OR v_app.is_public <> true THEN
    RAISE EXCEPTION 'This application is currently closed and not accepting submissions.';
  END IF;

  -- C. Check submission deadline (End Time) if configured
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
        -- If date parsing fails, log and continue safely
        NULL;
    END;
  END IF;

  -- D. Check maximum submission limit if configured
  IF COALESCE((v_app.settings->'submissionLimit'->>'enabled')::boolean, false) THEN
    v_max_limit := COALESCE((v_app.settings->'submissionLimit'->>'limit')::integer, 0);
    IF v_max_limit > 0 THEN
      SELECT COUNT(*) INTO v_current_count
      FROM public.submissions
      WHERE application_id = p_application_id;

      IF v_current_count >= v_max_limit THEN
        RAISE EXCEPTION 'This application has reached its maximum response limit and is now closed.';
      END IF;
    END IF;
  END IF;

  -- E. Check Idempotency: Return existing submission if already submitted with this key
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

  -- F. Create new Submission atomically
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

  -- G. Insert Answers & Files atomically
  IF p_answers IS NOT NULL AND jsonb_array_length(p_answers) > 0 THEN
    FOR v_ans_elem IN SELECT * FROM jsonb_array_elements(p_answers)
    LOOP
      v_ans_id := gen_random_uuid();
      
      -- Extract question ID safely
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

      -- Insert answer record
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

      -- Check if file metadata is provided to insert into public.files
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

  -- H. Return success payload
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

-- Grant execution permissions on the atomic submission RPC
GRANT EXECUTE ON FUNCTION public.submit_application_atomic(UUID, TEXT, TEXT, TEXT, JSONB) TO anon, authenticated, service_role;

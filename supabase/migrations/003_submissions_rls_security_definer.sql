-- ==============================================================================
-- Gather SaaS - Submissions & Answers RLS Optimization
-- Migration 003: Use SECURITY DEFINER helper for anonymous answers/files validation
-- ==============================================================================

-- Helper function: validates if a submission belongs to a published public application
CREATE OR REPLACE FUNCTION public.is_published_submission(sub_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.submissions s
    JOIN public.applications a ON s.application_id = a.id
    WHERE s.id = sub_id
      AND a.status = 'published'
      AND a.is_public = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function: validates if an application is published and public
CREATE OR REPLACE FUNCTION public.is_published_application(app_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.applications a
    WHERE a.id = app_id
      AND a.status = 'published'
      AND a.is_public = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update RLS policy for answers insertion
DROP POLICY IF EXISTS "Public can insert answers" ON public.answers;
CREATE POLICY "Public can insert answers" ON public.answers FOR INSERT WITH CHECK (
  public.is_published_submission(submission_id)
);

-- Update RLS policy for files insertion
DROP POLICY IF EXISTS "Public can insert file records" ON public.files;
CREATE POLICY "Public can insert file records" ON public.files FOR INSERT WITH CHECK (
  public.is_published_application(application_id)
);

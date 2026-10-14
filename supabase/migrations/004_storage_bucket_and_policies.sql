-- ==============================================================================
-- Gather SaaS - Supabase Storage Configuration & Policies
-- Migration 004: Ensure submission-files bucket and upload/select policies
-- ==============================================================================

-- 1. Ensure submission-files bucket exists and is private
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('submission-files', 'submission-files', false, 52428800, NULL)
ON CONFLICT (id) DO UPDATE SET public = false;

-- 2. Allow public/anon and authenticated users to upload files to submission-files
DROP POLICY IF EXISTS "Public respondents can upload files" ON storage.objects;
CREATE POLICY "Public respondents can upload files"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'submission-files');

-- 3. Allow access to files for authenticated users and signed URL consumers
DROP POLICY IF EXISTS "Org members can access uploaded files" ON storage.objects;
DROP POLICY IF EXISTS "Allow storage object access for submission files" ON storage.objects;
CREATE POLICY "Allow storage object access for submission files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'submission-files');

-- 4. Allow authenticated users to delete files
DROP POLICY IF EXISTS "Allow authenticated file delete" ON storage.objects;
CREATE POLICY "Allow authenticated file delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'submission-files');

-- ==============================================================================
-- Gather SaaS - Supabase PostgreSQL Database Schema
-- Migration 001: Initial Schema, Indexes, Triggers, and Row-Level Security (RLS)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. PROFILES & ORGANIZATIONS
-- ==============================================================================

-- Profiles: 1-to-1 extension of Supabase Auth Users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Organizations (Workspaces)
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Organization Members (Supports single-user and future multi-user teams)
CREATE TABLE IF NOT EXISTS public.organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'owner' CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(organization_id, user_id)
);

-- ==============================================================================
-- 2. SUBSCRIPTIONS & USAGE TRACKING
-- ==============================================================================

-- Subscriptions: Supports Gather Free ($0) and Pro ($12/mo) with future Stripe integration
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL UNIQUE REFERENCES public.organizations(id) ON DELETE CASCADE,
  provider TEXT NOT NULL DEFAULT 'stripe',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'trialing', 'canceled', 'past_due', 'unpaid', 'incomplete')),
  current_period_start TIMESTAMPTZ DEFAULT now(),
  current_period_end TIMESTAMPTZ DEFAULT (now() + interval '1 month'),
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Usage Records: Tracks monthly submission limits (e.g. 10 free submissions/month)
CREATE TABLE IF NOT EXISTS public.usage_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  billing_cycle_start TIMESTAMPTZ NOT NULL DEFAULT date_trunc('month', now()),
  billing_cycle_end TIMESTAMPTZ NOT NULL DEFAULT (date_trunc('month', now()) + interval '1 month'),
  submission_count INTEGER NOT NULL DEFAULT 0,
  submission_limit INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(organization_id, billing_cycle_start)
);

-- ==============================================================================
-- 3. APPLICATIONS, SECTIONS, QUESTIONS & OPTIONS
-- ==============================================================================

-- Applications (Forms)
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed')),
  is_public BOOLEAN NOT NULL DEFAULT false,
  public_id TEXT UNIQUE,
  published_at TIMESTAMPTZ,
  cover_image TEXT,
  creation_prompt TEXT,
  ask_gather_history JSONB NOT NULL DEFAULT '[]'::jsonb,
  settings JSONB NOT NULL DEFAULT '{
    "endTime": { "enabled": false },
    "submissionLimit": { "enabled": false },
    "allowResponseEditing": false,
    "defaultQuestionRequired": false
  }'::jsonb,
  responses_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Form Sections
CREATE TABLE IF NOT EXISTS public.sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Form Questions (Supports the 12 Gather question types)
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    'short_answer',
    'long_answer',
    'email',
    'phone',
    'number',
    'url',
    'single_choice',
    'multiple_choice',
    'dropdown',
    'date',
    'file',
    'checkbox'
  )),
  required BOOLEAN NOT NULL DEFAULT false,
  placeholder TEXT,
  has_other BOOLEAN DEFAULT false,
  position INTEGER NOT NULL DEFAULT 0,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Question Choice Options (For single_choice, multiple_choice, dropdown)
CREATE TABLE IF NOT EXISTS public.question_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 4. SUBMISSIONS, ANSWERS & UPLOADED FILES
-- ==============================================================================

-- Submissions
CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  respondent_name TEXT NOT NULL DEFAULT 'Anonymous Applicant',
  respondent_email TEXT NOT NULL DEFAULT 'no-email@provided.com',
  notes TEXT NOT NULL DEFAULT '',
  idempotency_key TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Uploaded Submission Files (Metadata only; binary stored in Supabase Storage)
CREATE TABLE IF NOT EXISTS public.files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  submission_id UUID REFERENCES public.submissions(id) ON DELETE SET NULL,
  question_id UUID REFERENCES public.questions(id) ON DELETE SET NULL,
  file_id TEXT UNIQUE NOT NULL,
  storage_path TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  mime_type TEXT NOT NULL DEFAULT 'application/octet-stream',
  size_bytes BIGINT NOT NULL DEFAULT 0,
  file_size_formatted TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Submission Answers (Individual structured answers per question)
CREATE TABLE IF NOT EXISTS public.answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.questions(id) ON DELETE SET NULL,
  question_label TEXT NOT NULL,
  question_type TEXT NOT NULL,
  answer_text TEXT NOT NULL DEFAULT '',
  answer_json JSONB,
  file_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 5. PERFORMANCE INDEXES
-- ==============================================================================

-- Profiles & Organizations
CREATE INDEX IF NOT EXISTS idx_organizations_owner ON public.organizations(owner_id);
CREATE INDEX IF NOT EXISTS idx_org_members_user ON public.organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_org_members_org ON public.organization_members(organization_id);

-- Applications
CREATE INDEX IF NOT EXISTS idx_applications_org ON public.applications(organization_id);
CREATE INDEX IF NOT EXISTS idx_applications_slug ON public.applications(slug);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_public_id ON public.applications(public_id);

-- Form Structure
CREATE INDEX IF NOT EXISTS idx_sections_application ON public.sections(application_id, position);
CREATE INDEX IF NOT EXISTS idx_questions_section ON public.questions(section_id, position);
CREATE INDEX IF NOT EXISTS idx_questions_application ON public.questions(application_id);
CREATE INDEX IF NOT EXISTS idx_question_options_question ON public.question_options(question_id, position);

-- Submissions & Answers
CREATE INDEX IF NOT EXISTS idx_submissions_application ON public.submissions(application_id, submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_idempotency ON public.submissions(application_id, idempotency_key) WHERE idempotency_key IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_answers_submission ON public.answers(submission_id);
CREATE INDEX IF NOT EXISTS idx_answers_question ON public.answers(question_id);
CREATE INDEX IF NOT EXISTS idx_files_submission ON public.files(submission_id);
CREATE INDEX IF NOT EXISTS idx_files_application ON public.files(application_id);
CREATE INDEX IF NOT EXISTS idx_files_file_id ON public.files(file_id);

-- Usage & Subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_org ON public.subscriptions(organization_id);
CREATE INDEX IF NOT EXISTS idx_usage_records_org ON public.usage_records(organization_id, billing_cycle_start);

-- ==============================================================================
-- 6. TRIGGERS & AUTOMATION
-- ==============================================================================

-- Universal Updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER tr_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER tr_organizations_updated_at BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER tr_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER tr_usage_records_updated_at BEFORE UPDATE ON public.usage_records FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER tr_applications_updated_at BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER tr_sections_updated_at BEFORE UPDATE ON public.sections FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER tr_questions_updated_at BEFORE UPDATE ON public.questions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER tr_submissions_updated_at BEFORE UPDATE ON public.submissions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Automatic response counter synchronization for applications
CREATE OR REPLACE FUNCTION public.sync_application_responses_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.applications
    SET responses_count = responses_count + 1, updated_at = now()
    WHERE id = NEW.application_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.applications
    SET responses_count = GREATEST(responses_count - 1, 0), updated_at = now()
    WHERE id = OLD.application_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_sync_responses_count
AFTER INSERT OR DELETE ON public.submissions
FOR EACH ROW EXECUTE FUNCTION public.sync_application_responses_count();

-- Auto-provision profile and default organization on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS TRIGGER AS $$
DECLARE
  new_org_id UUID;
  user_full_name TEXT;
  org_slug TEXT;
BEGIN
  user_full_name := COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1));
  org_slug := lower(regexp_replace(user_full_name, '[^a-zA-Z0-9]', '-', 'g')) || '-' || substring(NEW.id::text from 1 for 6);

  -- 1. Create Profile
  INSERT INTO public.profiles (id, name, email, avatar_url)
  VALUES (NEW.id, user_full_name, NEW.email, NEW.raw_user_meta_data->>'avatar_url');

  -- 2. Create Default Workspace / Organization
  INSERT INTO public.organizations (owner_id, name, slug)
  VALUES (NEW.id, user_full_name || '''s Organization', org_slug)
  RETURNING id INTO new_org_id;

  -- 3. Add to Organization Members
  INSERT INTO public.organization_members (organization_id, user_id, role)
  VALUES (new_org_id, NEW.id, 'owner');

  -- 4. Create Default Free Subscription
  INSERT INTO public.subscriptions (organization_id, plan, status)
  VALUES (new_org_id, 'free', 'active');

  -- 5. Create Initial Monthly Usage Record
  INSERT INTO public.usage_records (organization_id, submission_limit)
  VALUES (new_org_id, 10);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to hook into auth.users (conditional)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_signup();

-- ==============================================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS across all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;

-- Helper function: check if authenticated user belongs to an organization
CREATE OR REPLACE FUNCTION public.is_org_member(org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_id = org_id AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Organizations: Members can view their organization
CREATE POLICY "Members can view their organizations" ON public.organizations FOR SELECT USING (public.is_org_member(id));
CREATE POLICY "Owners can update their organizations" ON public.organizations FOR UPDATE USING (owner_id = auth.uid());

-- Organization Members: Members can view team membership
CREATE POLICY "Members can view org members" ON public.organization_members FOR SELECT USING (public.is_org_member(organization_id));

-- Subscriptions & Usage: Members can view billing and usage
CREATE POLICY "Members can view subscriptions" ON public.subscriptions FOR SELECT USING (public.is_org_member(organization_id));
CREATE POLICY "Members can view usage records" ON public.usage_records FOR SELECT USING (public.is_org_member(organization_id));

-- Applications:
-- 1. Org members have full CRUD
CREATE POLICY "Org members can view applications" ON public.applications FOR SELECT USING (public.is_org_member(organization_id));
CREATE POLICY "Org members can insert applications" ON public.applications FOR INSERT WITH CHECK (public.is_org_member(organization_id));
CREATE POLICY "Org members can update applications" ON public.applications FOR UPDATE USING (public.is_org_member(organization_id));
CREATE POLICY "Org members can delete applications" ON public.applications FOR DELETE USING (public.is_org_member(organization_id));
-- 2. Public can view published forms
CREATE POLICY "Public can view published applications" ON public.applications FOR SELECT USING (status = 'published' AND is_public = true);

-- Sections:
CREATE POLICY "Org members can view sections" ON public.sections FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.applications WHERE id = sections.application_id AND public.is_org_member(organization_id))
);
CREATE POLICY "Org members can modify sections" ON public.sections FOR ALL USING (
  EXISTS (SELECT 1 FROM public.applications WHERE id = sections.application_id AND public.is_org_member(organization_id))
);
CREATE POLICY "Public can view sections of published forms" ON public.sections FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.applications WHERE id = sections.application_id AND status = 'published' AND is_public = true)
);

-- Questions:
CREATE POLICY "Org members can view questions" ON public.questions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.applications WHERE id = questions.application_id AND public.is_org_member(organization_id))
);
CREATE POLICY "Org members can modify questions" ON public.questions FOR ALL USING (
  EXISTS (SELECT 1 FROM public.applications WHERE id = questions.application_id AND public.is_org_member(organization_id))
);
CREATE POLICY "Public can view questions of published forms" ON public.questions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.applications WHERE id = questions.application_id AND status = 'published' AND is_public = true)
);

-- Question Options:
CREATE POLICY "Org members can view question options" ON public.question_options FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.questions q JOIN public.applications a ON q.application_id = a.id WHERE q.id = question_options.question_id AND public.is_org_member(a.organization_id))
);
CREATE POLICY "Org members can modify question options" ON public.question_options FOR ALL USING (
  EXISTS (SELECT 1 FROM public.questions q JOIN public.applications a ON q.application_id = a.id WHERE q.id = question_options.question_id AND public.is_org_member(a.organization_id))
);
CREATE POLICY "Public can view options of published forms" ON public.question_options FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.questions q JOIN public.applications a ON q.application_id = a.id WHERE q.id = question_options.question_id AND a.status = 'published' AND a.is_public = true)
);

-- Submissions:
-- Org members can view, update notes, and delete submissions
CREATE POLICY "Org members can view submissions" ON public.submissions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.applications WHERE id = submissions.application_id AND public.is_org_member(organization_id))
);
CREATE POLICY "Org members can update submissions" ON public.submissions FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.applications WHERE id = submissions.application_id AND public.is_org_member(organization_id))
);
CREATE POLICY "Org members can delete submissions" ON public.submissions FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.applications WHERE id = submissions.application_id AND public.is_org_member(organization_id))
);
-- Public can INSERT submissions for published active forms
CREATE POLICY "Public can create submissions for published forms" ON public.submissions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.applications WHERE id = submissions.application_id AND status = 'published' AND is_public = true)
);

-- Answers:
CREATE POLICY "Org members can view answers" ON public.answers FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.submissions s JOIN public.applications a ON s.application_id = a.id WHERE s.id = answers.submission_id AND public.is_org_member(a.organization_id))
);
CREATE POLICY "Public can insert answers" ON public.answers FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.submissions s JOIN public.applications a ON s.application_id = a.id WHERE s.id = answers.submission_id AND a.status = 'published' AND a.is_public = true)
);

-- Files:
CREATE POLICY "Org members can view files" ON public.files FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.applications WHERE id = files.application_id AND public.is_org_member(organization_id))
);
CREATE POLICY "Public can insert file records" ON public.files FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.applications WHERE id = files.application_id AND status = 'published' AND is_public = true)
);

-- ==============================================================================
-- 8. STORAGE BUCKET CONFIGURATION
-- ==============================================================================

-- Create storage bucket for uploaded application files
INSERT INTO storage.buckets (id, name, public)
VALUES ('submission-files', 'submission-files', false)
ON CONFLICT (id) DO NOTHING;

-- Storage Policy: Organization owners can download uploaded submission files
CREATE POLICY "Org members can access uploaded files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'submission-files' AND
  EXISTS (
    SELECT 1 FROM public.files f
    JOIN public.applications a ON f.application_id = a.id
    WHERE f.storage_path = storage.objects.name AND public.is_org_member(a.organization_id)
  )
);

-- Storage Policy: Public respondents can upload files during submission
CREATE POLICY "Public respondents can upload files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'submission-files');

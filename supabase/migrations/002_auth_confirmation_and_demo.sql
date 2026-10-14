-- ==============================================================================
-- Gather SaaS - Auto Confirm Signups & Default Workspace Setup
-- Migration 002: Auto-confirm email signups for frictionless auth
-- ==============================================================================

-- 1. Function & trigger to auto-confirm emails on signup
CREATE OR REPLACE FUNCTION public.auto_confirm_new_user()
RETURNS TRIGGER AS $$
BEGIN
  NEW.email_confirmed_at = COALESCE(NEW.email_confirmed_at, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_auto_confirm_new_user ON auth.users;
CREATE TRIGGER tr_auto_confirm_new_user
BEFORE INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.auto_confirm_new_user();

-- 2. Confirm any existing unconfirmed users
UPDATE auth.users
SET email_confirmed_at = now()
WHERE email_confirmed_at IS NULL;

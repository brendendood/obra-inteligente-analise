-- Create email_templates table for admin-managed HTML templates
CREATE TABLE IF NOT EXISTS public.email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key text NOT NULL UNIQUE,
  subject text NOT NULL DEFAULT '',
  html text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);

-- Enable RLS
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- Update updated_at automatically
CREATE OR REPLACE FUNCTION public.update_email_templates_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_email_templates_updated_at ON public.email_templates;
CREATE TRIGGER trg_update_email_templates_updated_at
BEFORE UPDATE ON public.email_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_email_templates_updated_at();

-- Policies: Only admins can manage templates
DROP POLICY IF EXISTS "Admins can manage email templates" ON public.email_templates;
CREATE POLICY "Admins can manage email templates"
ON public.email_templates
FOR ALL
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

-- Optional read-only policy for superusers (included via admin policy already), kept explicit for clarity
DROP POLICY IF EXISTS "Superusers can view email templates" ON public.email_templates;
CREATE POLICY "Superusers can view email templates"
ON public.email_templates
FOR SELECT
USING (public.is_superuser());
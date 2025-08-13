-- 1) Extend email_templates with sender and metadata fields
ALTER TABLE public.email_templates
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS from_email text,
  ADD COLUMN IF NOT EXISTS from_name text,
  ADD COLUMN IF NOT EXISTS reply_to text,
  ADD COLUMN IF NOT EXISTS enabled boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS locale text DEFAULT 'pt-BR';

-- Ensure fast lookup and uniqueness by key+locale
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname='public' AND indexname='idx_email_templates_key_locale'
  ) THEN
    CREATE UNIQUE INDEX idx_email_templates_key_locale ON public.email_templates (template_key, locale);
  END IF;
END $$;

-- 2) Ensure updated_at is auto-updated on changes
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_email_templates_updated_at'
  ) THEN
    CREATE TRIGGER update_email_templates_updated_at
    BEFORE UPDATE ON public.email_templates
    FOR EACH ROW
    EXECUTE FUNCTION public.update_email_templates_updated_at();
  END IF;
END $$;

-- 3) Prepare email_logs for throttling and observability
ALTER TABLE IF EXISTS public.email_logs
  ADD COLUMN IF NOT EXISTS email_type text,
  ADD COLUMN IF NOT EXISTS recipient_email text,
  ADD COLUMN IF NOT EXISTS subject text,
  ADD COLUMN IF NOT EXISTS template_key text,
  ADD COLUMN IF NOT EXISTS template_version text DEFAULT '1.0',
  ADD COLUMN IF NOT EXISTS status text,
  ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS sent_at timestamptz DEFAULT now();

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname='public' AND indexname='idx_email_logs_user_type_time'
  ) THEN
    CREATE INDEX idx_email_logs_user_type_time ON public.email_logs (user_id, email_type, sent_at DESC);
  END IF;
END $$;

-- 4) Seed default templates if missing
WITH defaults AS (
  SELECT * FROM (
    VALUES
      ('welcome_user','pt-BR','Bem-vindo(a), {{first_name}}!','<h1>Bem-vindo(a), {{first_name}}!</h1><p>Obrigado por se juntar à {{app_name}}.</p><p><a href="{{dashboard_url}}">Acessar painel</a></p>','onboarding','made@madeai.com.br','MadenAI','suporte@madeai.com.br',true),
      ('onboarding_step1','pt-BR','Comece em 3 passos, {{first_name}}','<h1>Vamos começar, {{first_name}}!</h1><ol><li>Crie seu primeiro projeto</li><li>Faça upload dos documentos</li><li>Gere orçamento e cronograma</li></ol><p><a href="{{onboarding_cta_url}}">Começar</a></p>','onboarding','made@madeai.com.br','MadenAI','suporte@madeai.com.br',true),
      ('password_reset','pt-BR','Redefinir senha','<h1>Redefinir senha</h1><p>Olá, {{first_name}}.</p><p>Clique para redefinir sua senha: <a href="{{reset_url}}">Redefinir senha</a></p><p>Link expira em {{token_expires_minutes}} minutos.</p>','security','noreply@madeai.com.br','MadenAI Autenticação','suporte@madeai.com.br',true),
      ('usage_limit_reached','pt-BR','Você atingiu seu limite de uso','<h1>Limite atingido</h1><p>Olá, {{first_name}}.</p><p>Você usou {{used_projects}} projetos no plano {{plan_name}}.</p><p><a href="{{upgrade_url}}">Fazer upgrade</a></p>','limits','noreply@madeai.com.br','MadenAI','suporte@madeai.com.br',true),
      ('account_deactivated','pt-BR','Sua conta foi desativada','<h1>Conta desativada</h1><p>Olá, {{first_name}}.</p><p>Sua conta foi desativada em {{deactivated_at}}.</p><p>Se isso foi um engano, responda este email.</p>','account','suporte@madeai.com.br','Suporte MadenAI','suporte@madeai.com.br',true)
  ) AS t(template_key, locale, subject, html, category, from_email, from_name, reply_to, enabled)
)
INSERT INTO public.email_templates (template_key, locale, subject, html, category, from_email, from_name, reply_to, enabled)
SELECT d.template_key, d.locale, d.subject, d.html, d.category, d.from_email, d.from_name, d.reply_to, d.enabled
FROM defaults d
WHERE NOT EXISTS (
  SELECT 1 FROM public.email_templates et 
  WHERE et.template_key = d.template_key AND et.locale = d.locale
);

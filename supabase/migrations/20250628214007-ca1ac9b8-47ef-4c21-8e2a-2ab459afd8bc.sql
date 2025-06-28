
-- ===================================
-- FASE 1: ESTRUTURA DE DADOS COMPLETA
-- ===================================

-- 1. TABELA DE PERFIS DE USUÁRIO (dados completos)
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name TEXT,
  company TEXT,
  phone TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'Brasil',
  sector TEXT,
  tags TEXT[] DEFAULT '{}',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. SISTEMA DE ASSINATURAS
CREATE TYPE subscription_plan AS ENUM ('free', 'pro', 'enterprise');
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'trialing');

CREATE TABLE public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan subscription_plan NOT NULL DEFAULT 'free',
  status subscription_status NOT NULL DEFAULT 'active',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  trial_end TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- 3. HISTÓRICO DE PAGAMENTOS
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.user_subscriptions(id),
  stripe_payment_intent_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'BRL',
  status TEXT NOT NULL,
  payment_method TEXT,
  invoice_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. CUPONS E PROMOÇÕES
CREATE TABLE public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  valid_from TIMESTAMPTZ DEFAULT now(),
  valid_until TIMESTAMPTZ,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. ANALYTICS DE USUÁRIO
CREATE TYPE user_event_type AS ENUM (
  'signup', 'login', 'logout', 'project_created', 'file_uploaded', 
  'ai_used', 'plan_upgraded', 'plan_downgraded', 'payment_success', 'payment_failed'
);

CREATE TABLE public.user_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type user_event_type NOT NULL,
  event_data JSONB DEFAULT '{}',
  session_id TEXT,
  ip_address INET,
  user_agent TEXT,
  page_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. MÉTRICAS DE IA
CREATE TABLE public.ai_usage_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  feature_type TEXT NOT NULL, -- 'assistant', 'budget', 'schedule', etc
  tokens_used INTEGER DEFAULT 0,
  cost_usd DECIMAL(10,4) DEFAULT 0,
  response_rating INTEGER CHECK (response_rating IN (-1, 0, 1)), -- -1=dislike, 0=neutral, 1=like
  feedback_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. SISTEMA DE ROLES ADMINISTRATIVOS
CREATE TYPE admin_role AS ENUM ('super_admin', 'marketing', 'financial', 'support');

CREATE TABLE public.admin_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role admin_role NOT NULL,
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  active BOOLEAN DEFAULT true,
  UNIQUE(user_id, role)
);

-- 8. LOGS DE AUDITORIA
CREATE TABLE public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES auth.users(id),
  action_type TEXT NOT NULL,
  target_type TEXT, -- 'user', 'project', 'subscription', etc
  target_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. EXTENSÃO DA TABELA PROJECTS
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS estimated_budget DECIMAL(12,2),
ADD COLUMN IF NOT EXISTS project_status TEXT DEFAULT 'draft' CHECK (project_status IN ('draft', 'active', 'completed', 'archived')),
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'Brasil';

-- ===================================
-- POLÍTICAS RLS (Row Level Security)
-- ===================================

-- User Profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.user_profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.admin_permissions WHERE user_id = auth.uid() AND active = true)
);

-- Subscriptions
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own subscription" ON public.user_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all subscriptions" ON public.user_subscriptions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.admin_permissions WHERE user_id = auth.uid() AND active = true)
);

-- Analytics
ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view analytics" ON public.user_analytics FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.admin_permissions WHERE user_id = auth.uid() AND active = true)
);

-- AI Metrics
ALTER TABLE public.ai_usage_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own AI metrics" ON public.ai_usage_metrics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all AI metrics" ON public.ai_usage_metrics FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.admin_permissions WHERE user_id = auth.uid() AND active = true)
);

-- Admin Permissions
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view permissions" ON public.admin_permissions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.admin_permissions WHERE user_id = auth.uid() AND active = true)
);

-- ===================================
-- FUNÇÕES ADMINISTRATIVAS
-- ===================================

-- Função para verificar se usuário é admin
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_permissions
    WHERE user_id = auth.uid() AND active = true
  );
$$;

-- Função para obter estatísticas do dashboard admin
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_stats()
RETURNS TABLE(
  total_users BIGINT,
  total_projects BIGINT,
  active_subscriptions BIGINT,
  monthly_revenue DECIMAL,
  new_users_this_month BIGINT,
  ai_usage_this_month BIGINT
)
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT 
    (SELECT COUNT(*) FROM auth.users),
    (SELECT COUNT(*) FROM public.projects),
    (SELECT COUNT(*) FROM public.user_subscriptions WHERE status = 'active'),
    (SELECT COALESCE(SUM(amount), 0) FROM public.payments WHERE created_at >= date_trunc('month', now())),
    (SELECT COUNT(*) FROM auth.users WHERE created_at >= date_trunc('month', now())),
    (SELECT COUNT(*) FROM public.ai_usage_metrics WHERE created_at >= date_trunc('month', now()))
  WHERE public.is_admin_user() = true;
$$;

-- Trigger para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  
  INSERT INTO public.user_subscriptions (user_id, plan, status)
  VALUES (NEW.id, 'free', 'active');
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();

-- ===================================
-- INSERÇÃO DO SUPER ADMIN INICIAL
-- ===================================

-- Inserir o super admin inicial (será criado quando o usuário fizer signup)
-- Este será adicionado via código após o usuário admin@arqcloud.com se cadastrar

-- ===================================
-- ÍNDICES PARA PERFORMANCE
-- ===================================

CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX idx_user_profiles_tags ON public.user_profiles USING GIN(tags);
CREATE INDEX idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON public.user_subscriptions(status);
CREATE INDEX idx_user_analytics_user_id ON public.user_analytics(user_id);
CREATE INDEX idx_user_analytics_event_type ON public.user_analytics(event_type);
CREATE INDEX idx_user_analytics_created_at ON public.user_analytics(created_at);
CREATE INDEX idx_ai_usage_user_id ON public.ai_usage_metrics(user_id);
CREATE INDEX idx_ai_usage_created_at ON public.ai_usage_metrics(created_at);
CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_admin_audit_created_at ON public.admin_audit_logs(created_at);

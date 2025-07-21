
-- CORREÇÃO URGENTE: Eliminar recursão infinita nas políticas RLS

-- 1. Remover todas as políticas problemáticas que causam recursão
DROP POLICY IF EXISTS "Admin can view all payments" ON payments;
DROP POLICY IF EXISTS "Admin can view all projects" ON projects;
DROP POLICY IF EXISTS "Admin can view all user_profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admin can view all ai_usage_metrics" ON ai_usage_metrics;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all subscriptions" ON user_subscriptions;
DROP POLICY IF EXISTS "Admins can view analytics" ON user_analytics;
DROP POLICY IF EXISTS "Admins can view all segments" ON user_segments;
DROP POLICY IF EXISTS "Admins can view webhook logs" ON webhook_logs;

-- 2. Substituir função check_admin_access por versão sem recursão
DROP FUNCTION IF EXISTS public.check_admin_access();

-- 3. Criar função simples que só verifica superuser (sem consultar tabelas)
CREATE OR REPLACE FUNCTION public.is_superuser()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM pg_roles 
    WHERE rolname = current_user AND rolsuper = true
  );
$$;

-- 4. Recriar função is_admin_user sem recursão
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
  -- Apenas verificar se é superuser - sem consultar admin_permissions para evitar recursão
  SELECT EXISTS (
    SELECT 1 FROM pg_roles 
    WHERE rolname = current_user AND rolsuper = true
  );
$$;

-- 5. Recriar políticas admin usando apenas is_superuser (sem recursão)
CREATE POLICY "Superusers can view all payments" ON payments
  FOR SELECT USING (public.is_superuser());

CREATE POLICY "Superusers can view all projects" ON projects  
  FOR SELECT USING (public.is_superuser());

CREATE POLICY "Superusers can view all user_profiles" ON user_profiles
  FOR SELECT USING (public.is_superuser());

CREATE POLICY "Superusers can view all ai_usage_metrics" ON ai_usage_metrics
  FOR SELECT USING (public.is_superuser());

CREATE POLICY "Superusers can view all subscriptions" ON user_subscriptions
  FOR SELECT USING (public.is_superuser());

CREATE POLICY "Superusers can view all analytics" ON user_analytics
  FOR SELECT USING (public.is_superuser());

CREATE POLICY "Superusers can view all segments" ON user_segments
  FOR SELECT USING (public.is_superuser());

CREATE POLICY "Superusers can view webhook logs" ON webhook_logs
  FOR SELECT USING (public.is_superuser());


-- Remover políticas RLS problemáticas que causam recursão infinita
DROP POLICY IF EXISTS "Admin permissions policy" ON public.admin_permissions;

-- Desabilitar RLS temporariamente para admin_permissions
ALTER TABLE public.admin_permissions DISABLE ROW LEVEL SECURITY;

-- Criar função de segurança para verificar admin
CREATE OR REPLACE FUNCTION public.check_admin_access()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_permissions
    WHERE user_id = auth.uid() AND active = true
  );
$$;

-- Recriar políticas RLS mais simples para outras tabelas que precisam de controle admin
CREATE POLICY "Admin can view all payments" ON public.payments
  FOR SELECT USING (public.check_admin_access());

CREATE POLICY "Admin can view all projects" ON public.projects  
  FOR SELECT USING (public.check_admin_access());

CREATE POLICY "Admin can view all user_profiles" ON public.user_profiles
  FOR SELECT USING (public.check_admin_access());

CREATE POLICY "Admin can view all ai_usage_metrics" ON public.ai_usage_metrics
  FOR SELECT USING (public.check_admin_access());

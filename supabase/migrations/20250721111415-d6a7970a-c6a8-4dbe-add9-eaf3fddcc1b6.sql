-- CORREÇÃO FINAL: Eliminar COMPLETAMENTE recursão infinita
-- Remover TODAS as funções que consultam admin_permissions

-- 1. Remover TODAS as políticas que usam admin_permissions (mesmo indiretamente)
DROP POLICY IF EXISTS "Admin can manage alert logs" ON alert_logs;
DROP POLICY IF EXISTS "Admin can manage alert configurations" ON alert_configurations;
DROP POLICY IF EXISTS "Only admins can view audit logs" ON admin_audit_logs;
DROP POLICY IF EXISTS "Admins can view all AI metrics" ON ai_usage_metrics;

-- 2. Remover COMPLETAMENTE função is_admin_user (que causa recursão)
DROP FUNCTION IF EXISTS public.is_admin_user();

-- 3. Manter APENAS is_superuser (sem recursão)
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

-- 4. Recriar políticas usando APENAS is_superuser (sem admin_permissions)
CREATE POLICY "Superusers can manage alert logs" ON alert_logs
  FOR ALL USING (public.is_superuser());

CREATE POLICY "Superusers can manage alert configurations" ON alert_configurations
  FOR ALL USING (public.is_superuser());

CREATE POLICY "Superusers can view audit logs" ON admin_audit_logs
  FOR SELECT USING (public.is_superuser());

-- 5. Remover política problemática de admin_permissions para quebrar ciclo
DROP POLICY IF EXISTS "Admin can view admin permissions" ON admin_permissions;
DROP POLICY IF EXISTS "Users can view own admin permissions" ON admin_permissions;
DROP POLICY IF EXISTS "Super admins can view all permissions" ON admin_permissions;

-- 6. Política simples para admin_permissions (apenas superuser, sem recursão)
CREATE POLICY "Only superusers can view admin permissions" ON admin_permissions
  FOR SELECT USING (public.is_superuser());
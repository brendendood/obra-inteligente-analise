
-- Corrigir a função is_superuser para verificar também admin_permissions
CREATE OR REPLACE FUNCTION public.is_superuser()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
  -- Verificar se é superuser do PostgreSQL OU tem permissão super_admin
  SELECT EXISTS (
    SELECT 1 FROM pg_roles 
    WHERE rolname = current_user AND rolsuper = true
  ) OR EXISTS (
    SELECT 1 FROM public.admin_permissions 
    WHERE user_id = auth.uid() 
    AND active = true 
    AND role = 'super_admin'
  );
$$;

-- Criar função específica para verificar admin_permissions sem recursão
CREATE OR REPLACE FUNCTION public.check_admin_permissions()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_permissions 
    WHERE user_id = auth.uid() 
    AND active = true 
    AND role IN ('super_admin', 'marketing', 'financial', 'support')
  );
$$;

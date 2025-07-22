
-- Criar função que recebe user_id como parâmetro e funciona com JWT
CREATE OR REPLACE FUNCTION public.check_user_admin_status(target_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
  -- Verificar se o usuário tem permissões de admin na tabela admin_permissions
  SELECT EXISTS (
    SELECT 1 FROM public.admin_permissions 
    WHERE user_id = target_user_id 
    AND active = true 
    AND role IN ('super_admin', 'marketing', 'financial', 'support')
  ) OR EXISTS (
    -- Fallback: verificar se é superuser no PostgreSQL
    SELECT 1 FROM pg_roles 
    WHERE rolname = current_user AND rolsuper = true
  );
$$;

-- Criar função auxiliar para verificar admin por email
CREATE OR REPLACE FUNCTION public.check_admin_by_email(user_email text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = user_email 
    AND is_active = true
  );
$$;


-- FASE 4: LIMPAR FUNÇÕES SQL REDUNDANTES
-- Deletar funções duplicadas e manter apenas as essenciais

-- Remover função duplicada is_admin()
DROP FUNCTION IF EXISTS public.is_admin();

-- Remover função check_user_admin_status() (criada recentemente mas redundante)
DROP FUNCTION IF EXISTS public.check_user_admin_status(uuid);

-- Remover função check_admin_by_email() (redundante)
DROP FUNCTION IF EXISTS public.check_admin_by_email(text);

-- Remover função get_admin_stats() (versão antiga, menos completa)
DROP FUNCTION IF EXISTS public.get_admin_stats();

-- Atualizar is_superuser() para ser a única função de verificação admin
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

-- Manter apenas get_admin_dashboard_stats() como função principal de estatísticas
-- (já existe e é mais completa que get_admin_stats)

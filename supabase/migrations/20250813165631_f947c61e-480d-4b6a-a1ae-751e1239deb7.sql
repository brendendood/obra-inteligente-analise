-- Criar função RPC para buscar usuários para bulk email
CREATE OR REPLACE FUNCTION public.get_bulk_email_users(limit_count integer DEFAULT NULL)
RETURNS TABLE(
    user_id uuid,
    full_name text,
    email text
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
    SELECT 
        up.user_id,
        up.full_name,
        au.email
    FROM public.user_profiles up
    INNER JOIN auth.users au ON up.user_id = au.id
    WHERE au.email IS NOT NULL 
    AND au.email_confirmed_at IS NOT NULL
    ORDER BY up.created_at DESC
    LIMIT COALESCE(limit_count, 1000);
$$;

-- Criar função para buscar dados completos de usuários para admins
CREATE OR REPLACE FUNCTION public.get_admin_users_with_auth_data()
RETURNS TABLE(
    profile_id uuid,
    user_id uuid,
    email text,
    email_confirmed_at timestamp with time zone,
    full_name text,
    company text,
    phone text,
    city text,
    state text,
    country text,
    cargo text,
    avatar_url text,
    gender text,
    tags text[],
    created_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    subscription_plan text,
    subscription_status text
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
    SELECT 
        up.id as profile_id,
        up.user_id,
        au.email,
        au.email_confirmed_at,
        up.full_name,
        up.company,
        up.phone,
        up.city,
        up.state,
        up.country,
        up.cargo,
        up.avatar_url,
        up.gender,
        up.tags,
        au.created_at,
        au.last_sign_in_at,
        COALESCE(us.plan::text, 'free') as subscription_plan,
        COALESCE(us.status::text, 'active') as subscription_status
    FROM public.user_profiles up
    LEFT JOIN auth.users au ON up.user_id = au.id
    LEFT JOIN public.user_subscriptions us ON up.user_id = us.user_id
    WHERE public.is_admin_user() = true
    ORDER BY au.created_at DESC;
$$;

-- Grant execute permission to authenticated users (will be filtered by is_admin_user())
GRANT EXECUTE ON FUNCTION public.get_admin_users_with_auth_data() TO authenticated;

-- 1. Primeiro, garantir que todos os usuários tenham um plan_code válido
UPDATE public.users 
SET plan_code = 'BASIC' 
WHERE plan_code IS NULL;

-- 2. Dropar a função existente para poder recriar com a nova lógica
DROP FUNCTION IF EXISTS public.get_admin_users_with_quiz_data();

-- 3. Recriar a função sem a lógica de COALESCE que cria dados fictícios
CREATE OR REPLACE FUNCTION public.get_admin_users_with_quiz_data()
RETURNS TABLE(
    user_id uuid,
    email text,
    full_name text,
    company text,
    cargo text,
    plan text,
    status text,
    created_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    credits integer,
    quiz_completed boolean,
    plan_selected boolean,
    tags text[],
    ref_code text,
    referred_by text,
    has_created_first_project boolean,
    total_sessions bigint,
    avg_session_duration double precision,
    last_activity timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        up.user_id,
        au.email,
        up.full_name,
        up.company,
        up.cargo,
        u.plan_code as plan,  -- Usar plan_code real sem COALESCE
        CASE 
            WHEN au.email_confirmed_at IS NOT NULL THEN 'active'::text
            ELSE 'inactive'::text
        END as status,
        au.created_at,
        au.last_sign_in_at,
        COALESCE(up.credits, 0) as credits,
        COALESCE(up.quiz_completed, false) as quiz_completed,
        COALESCE(up.plan_selected, false) as plan_selected,
        up.tags,
        up.ref_code,
        up.referred_by,
        COALESCE(up.has_created_first_project, false) as has_created_first_project,
        COALESCE(ue.total_sessions, 0) as total_sessions,
        COALESCE(ue.avg_session_duration, 0) as avg_session_duration,
        ue.last_activity
    FROM public.user_profiles up
    INNER JOIN auth.users au ON up.user_id = au.id
    INNER JOIN public.users u ON up.user_id = u.id  -- Join com tabela users para pegar plan_code real
    LEFT JOIN public.calculate_user_engagement() ue ON up.user_id = ue.user_id
    ORDER BY au.created_at DESC;
END;
$$;
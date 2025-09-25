-- Corrigir a função RPC para usar os tipos corretos da tabela auth.users
DROP FUNCTION IF EXISTS public.get_admin_users_with_quiz_data();

-- Recriar a função com os tipos corretos
CREATE OR REPLACE FUNCTION public.get_admin_users_with_quiz_data()
RETURNS TABLE(
    user_id uuid,
    email character varying(255),  -- Corrigido: era 'text', agora é 'character varying(255)'
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
        au.email,  -- Este campo é character varying(255) na tabela auth.users
        up.full_name,
        up.company,
        up.cargo,
        u.plan_code as plan,
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
    INNER JOIN public.users u ON up.user_id = u.id
    LEFT JOIN public.calculate_user_engagement() ue ON up.user_id = ue.user_id
    ORDER BY au.created_at DESC;
END;
$$;
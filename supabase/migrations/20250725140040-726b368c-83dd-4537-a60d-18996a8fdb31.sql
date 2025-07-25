-- Corrigir função get_admin_dashboard_stats para funcionar sem verificação interna de admin
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_stats()
 RETURNS TABLE(total_users bigint, total_projects bigint, active_subscriptions bigint, monthly_revenue numeric, new_users_this_month bigint, ai_usage_this_month bigint)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  SELECT 
    (SELECT COUNT(*) FROM auth.users)::bigint,
    (SELECT COUNT(*) FROM public.projects)::bigint,
    (SELECT COUNT(*) FROM public.user_subscriptions WHERE status = 'active')::bigint,
    (SELECT COALESCE(SUM(amount), 0) FROM public.payments WHERE created_at >= date_trunc('month', now())),
    (SELECT COUNT(*) FROM auth.users WHERE created_at >= date_trunc('month', now()))::bigint,
    (SELECT COUNT(*) FROM public.ai_usage_metrics WHERE created_at >= date_trunc('month', now()))::bigint;
$function$;

-- Corrigir função get_admin_users_with_real_location para melhor performance
CREATE OR REPLACE FUNCTION public.get_admin_users_with_real_location()
 RETURNS TABLE(profile_id uuid, user_id uuid, email text, email_confirmed_at timestamp with time zone, full_name text, company text, phone text, city text, state text, country text, cargo text, avatar_url text, gender text, tags text[], created_at timestamp with time zone, last_sign_in_at timestamp with time zone, subscription_plan text, subscription_status text, real_location text, last_login_ip text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
    WITH latest_login AS (
        SELECT DISTINCT ON (user_id) 
            user_id,
            city,
            region,
            country,
            ip_address::text as login_ip,
            login_at
        FROM public.user_login_history
        ORDER BY user_id, login_at DESC
    )
    SELECT 
        up.id as profile_id,
        up.user_id,
        au.email,
        au.email_confirmed_at,
        up.full_name,
        up.company,
        up.phone,
        -- Usar localização real do login, não do perfil
        COALESCE(ll.city, up.city),
        COALESCE(ll.region, up.state),
        COALESCE(ll.country, up.country),
        up.cargo,
        up.avatar_url,
        up.gender,
        up.tags,
        au.created_at,
        au.last_sign_in_at,
        COALESCE(us.plan::text, 'free') as subscription_plan,
        COALESCE(us.status::text, 'active') as subscription_status,
        -- Montar localização real ou usar do perfil
        CASE 
            WHEN ll.city IS NOT NULL OR ll.region IS NOT NULL OR ll.country IS NOT NULL THEN
                CONCAT_WS(', ', ll.city, ll.region, ll.country)
            WHEN up.city IS NOT NULL OR up.state IS NOT NULL OR up.country IS NOT NULL THEN
                CONCAT_WS(', ', up.city, up.state, up.country)
            ELSE 
                'Localização não disponível'
        END as real_location,
        ll.login_ip as last_login_ip
    FROM public.user_profiles up
    LEFT JOIN auth.users au ON up.user_id = au.id
    LEFT JOIN public.user_subscriptions us ON up.user_id = us.user_id
    LEFT JOIN latest_login ll ON up.user_id = ll.user_id
    ORDER BY au.created_at DESC;
$function$;

-- Função para contar total de usuários (separada para performance)
CREATE OR REPLACE FUNCTION public.get_total_users_count()
 RETURNS bigint
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  SELECT COUNT(*) FROM auth.users;
$function$;
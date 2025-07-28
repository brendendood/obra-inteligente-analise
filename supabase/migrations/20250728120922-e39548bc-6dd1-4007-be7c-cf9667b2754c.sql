-- Corrigir a função para sempre pegar o ÚLTIMO login de cada usuário
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
            login_at,
            latitude,
            longitude
        FROM public.user_login_history
        WHERE login_at IS NOT NULL
        ORDER BY user_id, login_at DESC -- SEMPRE o último login
    )
    SELECT 
        up.id as profile_id,
        up.user_id,
        au.email,
        au.email_confirmed_at,
        up.full_name,
        up.company,
        up.phone,
        -- Usar localização real do ÚLTIMO login
        COALESCE(ll.city, up.city) as city,
        COALESCE(ll.region, up.state) as state,
        COALESCE(ll.country, up.country) as country,
        up.cargo,
        up.avatar_url,
        up.gender,
        up.tags,
        au.created_at,
        au.last_sign_in_at,
        COALESCE(us.plan::text, 'free') as subscription_plan,
        COALESCE(us.status::text, 'active') as subscription_status,
        -- Montar localização real SEMPRE do último login
        CASE 
            WHEN ll.city IS NOT NULL AND ll.country IS NOT NULL THEN
                CONCAT_WS(', ', 
                    NULLIF(ll.city, ''),
                    NULLIF(ll.region, ''), 
                    NULLIF(ll.country, '')
                )
            WHEN up.city IS NOT NULL OR up.state IS NOT NULL OR up.country IS NOT NULL THEN
                CONCAT_WS(', ', 
                    NULLIF(up.city, ''),
                    NULLIF(up.state, ''), 
                    NULLIF(up.country, '')
                )
            ELSE 
                'Localização não disponível'
        END as real_location,
        ll.login_ip as last_login_ip
    FROM public.user_profiles up
    LEFT JOIN auth.users au ON up.user_id = au.id
    LEFT JOIN public.user_subscriptions us ON up.user_id = us.user_id
    LEFT JOIN latest_login ll ON up.user_id = ll.user_id
    ORDER BY 
        ll.login_at DESC NULLS LAST, -- Priorizar usuários com login recente
        au.created_at DESC;
$function$;

-- Função para forçar atualização de localização de um usuário específico
CREATE OR REPLACE FUNCTION public.force_update_user_location(target_user_id uuid)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
    latest_login_record record;
    result json;
BEGIN
    -- Buscar ÚLTIMO login do usuário
    SELECT * INTO latest_login_record
    FROM public.user_login_history
    WHERE user_id = target_user_id
    AND ip_address IS NOT NULL
    ORDER BY login_at DESC
    LIMIT 1;
    
    IF latest_login_record IS NULL THEN
        RETURN json_build_object(
            'success', false, 
            'error', 'Nenhum login com IP encontrado'
        );
    END IF;
    
    -- Disparar atualização de geolocalização via edge function
    PERFORM pg_notify('real_geolocation_capture', json_build_object(
        'login_id', latest_login_record.id,
        'ip_address', latest_login_record.ip_address::text,
        'user_id', target_user_id,
        'force_update', true,
        'timestamp', latest_login_record.login_at
    )::text);
    
    RETURN json_build_object(
        'success', true, 
        'login_id', latest_login_record.id,
        'ip_address', latest_login_record.ip_address::text,
        'login_at', latest_login_record.login_at
    );
END;
$function$;
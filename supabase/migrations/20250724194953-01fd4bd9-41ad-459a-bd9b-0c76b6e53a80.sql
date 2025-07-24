-- Security Fix: Add secure search paths to remaining database functions

-- Fix search path for is_superuser function
CREATE OR REPLACE FUNCTION public.is_superuser()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
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
$function$;

-- Fix search path for is_admin_user function
CREATE OR REPLACE FUNCTION public.is_admin_user()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_permissions 
    WHERE user_id = auth.uid() 
    AND active = true 
    AND role = 'super_admin'
  ) OR public.is_superuser();
$function$;

-- Fix search path for end_impersonation_session function
CREATE OR REPLACE FUNCTION public.end_impersonation_session(session_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  UPDATE public.admin_impersonation_logs
  SET 
    ended_at = now(),
    duration_minutes = EXTRACT(MINUTES FROM (now() - started_at))::integer
  WHERE id = session_id AND ended_at IS NULL;
END;
$function$;

-- Fix search path for calculate_user_engagement function
CREATE OR REPLACE FUNCTION public.calculate_user_engagement(target_user_id uuid)
 RETURNS numeric
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
    engagement_score NUMERIC;
    login_count INTEGER;
    last_login_days INTEGER;
    content_interactions INTEGER;
BEGIN
    SELECT 
        COUNT(*) AS logins,
        EXTRACT(DAYS FROM (NOW() - MAX(created_at))) AS days_since_last_login,
        (
            SELECT COUNT(*) 
            FROM public.posts p 
            WHERE p.user_id = target_user_id
        ) + (
            SELECT COUNT(*) 
            FROM public.comments c 
            WHERE c.user_id = target_user_id
        ) AS total_interactions
    INTO 
        login_count, 
        last_login_days, 
        content_interactions
    FROM auth.sessions s
    WHERE s.user_id = target_user_id;

    engagement_score = LEAST(100, 
        COALESCE(
            CASE 
                WHEN last_login_days <= 7 THEN 40
                WHEN last_login_days <= 30 THEN 30
                WHEN last_login_days <= 90 THEN 20
                ELSE 10
            END +
            CASE 
                WHEN login_count >= 20 THEN 30
                WHEN login_count >= 10 THEN 20
                WHEN login_count >= 5 THEN 10
                ELSE 0
            END +
            CASE 
                WHEN content_interactions >= 50 THEN 30
                WHEN content_interactions >= 20 THEN 20
                WHEN content_interactions >= 5 THEN 10
                ELSE 0
            END, 
        0), 
    100);

    RETURN ROUND(engagement_score, 2);
END;
$function$;

-- Fix search path for get_user_engagement function
CREATE OR REPLACE FUNCTION public.get_user_engagement()
 RETURNS TABLE(user_id uuid, engagement_score numeric)
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
    RETURN QUERY 
    SELECT 
        auth.uid() AS user_id, 
        public.calculate_user_engagement(auth.uid()) AS engagement_score;
END;
$function$;

-- Fix search path for get_admin_users_with_real_location function
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
        ll.city,
        ll.region,
        ll.country,
        up.cargo,
        up.avatar_url,
        up.gender,
        up.tags,
        au.created_at,
        au.last_sign_in_at,
        COALESCE(us.plan::text, 'free') as subscription_plan,
        COALESCE(us.status::text, 'active') as subscription_status,
        -- Montar localização real ou "não disponível"
        CASE 
            WHEN ll.city IS NOT NULL OR ll.region IS NOT NULL OR ll.country IS NOT NULL THEN
                CONCAT_WS(', ', ll.city, ll.region, ll.country)
            ELSE 
                'Localização não disponível'
        END as real_location,
        ll.login_ip as last_login_ip
    FROM public.user_profiles up
    LEFT JOIN auth.users au ON up.user_id = au.id
    LEFT JOIN public.user_subscriptions us ON up.user_id = us.user_id
    LEFT JOIN latest_login ll ON up.user_id = ll.user_id
    WHERE public.is_admin_user() = true
    ORDER BY au.created_at DESC;
$function$;

-- Fix search path for example_function
CREATE OR REPLACE FUNCTION public.example_function()
 RETURNS TABLE(user_id bigint, username text, created_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        id, 
        name, 
        created_at 
    FROM public.users;
END;
$function$;

-- Fix search path for update_login_location_by_ip function
CREATE OR REPLACE FUNCTION public.update_login_location_by_ip(login_id uuid, ip_address text, city_name text, region_name text, country_name text, lat numeric DEFAULT NULL::numeric, lng numeric DEFAULT NULL::numeric)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
    UPDATE public.user_login_history 
    SET 
        latitude = lat,
        longitude = lng,
        city = city_name,
        region = region_name,
        country = country_name
    WHERE id = login_id;
END;
$function$;

-- Fix search path for force_user_geolocation_update function
CREATE OR REPLACE FUNCTION public.force_user_geolocation_update(user_email text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
    target_user_id uuid;
    latest_login_record record;
    result json;
BEGIN
    -- Buscar user_id pelo email
    SELECT id INTO target_user_id 
    FROM auth.users 
    WHERE email = user_email;
    
    IF target_user_id IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'Usuário não encontrado');
    END IF;
    
    -- Buscar último login do usuário
    SELECT * INTO latest_login_record
    FROM public.user_login_history
    WHERE user_id = target_user_id
    ORDER BY login_at DESC
    LIMIT 1;
    
    IF latest_login_record IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'Nenhum login encontrado');
    END IF;
    
    -- Forçar captura de geolocalização
    PERFORM pg_notify('force_geolocation_update', json_build_object(
        'login_id', latest_login_record.id,
        'ip_address', latest_login_record.ip_address::text,
        'user_id', target_user_id
    )::text);
    
    RETURN json_build_object(
        'success', true, 
        'login_id', latest_login_record.id,
        'ip_address', latest_login_record.ip_address::text
    );
END;
$function$;

-- Fix search path for test_login_system function
CREATE OR REPLACE FUNCTION public.test_login_system()
 RETURNS text
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
DECLARE
    trigger_count INTEGER;
    function_count INTEGER;
BEGIN
    -- Verificar trigger
    SELECT COUNT(*) INTO trigger_count
    FROM information_schema.triggers 
    WHERE trigger_name = 'on_auth_user_login' 
    AND event_object_schema = 'auth';
    
    -- Verificar função
    SELECT COUNT(*) INTO function_count
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE p.proname = 'handle_user_login' 
    AND n.nspname = 'public';
    
    IF trigger_count = 0 THEN
        RETURN 'ERRO: Trigger não encontrado no schema auth';
    END IF;
    
    IF function_count = 0 THEN
        RETURN 'ERRO: Função handle_user_login não encontrada';
    END IF;
    
    RETURN 'OK: Sistema de login configurado - Trigger: ' || trigger_count || ', Função: ' || function_count;
END;
$function$;

-- Fix search path for calculate_user_engagement (second version) function
CREATE OR REPLACE FUNCTION public.calculate_user_engagement()
 RETURNS TABLE(user_id uuid, total_sessions bigint, avg_session_duration double precision, total_events bigint, last_activity timestamp with time zone, engagement_score double precision)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  SELECT 
    ua.user_id,
    COUNT(DISTINCT ua.session_id) as total_sessions,
    AVG(ua.session_duration) as avg_session_duration,
    COUNT(*) as total_events,
    MAX(ua.last_active) as last_activity,
    -- Score de engajamento (0-100)
    LEAST(100, 
      (COUNT(*) * 2) + 
      (AVG(ua.session_duration) / 60) + 
      (COUNT(DISTINCT ua.session_id) * 5)
    ) as engagement_score
  FROM public.user_analytics ua
  WHERE ua.created_at >= NOW() - INTERVAL '30 days'
  GROUP BY ua.user_id
  ORDER BY engagement_score DESC;
$function$;

-- Fix search path for manual_login_insert function
CREATE OR REPLACE FUNCTION public.manual_login_insert(p_user_id uuid, p_ip_address text DEFAULT '127.0.0.1'::text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
    INSERT INTO public.user_login_history (
        user_id,
        login_at,
        ip_address,
        user_agent,
        device_type,
        browser,
        os
    ) VALUES (
        p_user_id,
        NOW(),
        p_ip_address::inet,
        'Manual Insert',
        'Desktop',
        'Manual',
        'Test'
    );
    
    RETURN 'Login inserido com sucesso para user: ' || p_user_id;
EXCEPTION
    WHEN OTHERS THEN
        RETURN 'ERRO: ' || SQLERRM;
END;
$function$;

-- Fix search path for get_admin_users_with_auth_data function
CREATE OR REPLACE FUNCTION public.get_admin_users_with_auth_data()
 RETURNS TABLE(profile_id uuid, user_id uuid, email text, email_confirmed_at timestamp with time zone, full_name text, company text, phone text, city text, state text, country text, cargo text, avatar_url text, gender text, tags text[], created_at timestamp with time zone, last_sign_in_at timestamp with time zone, subscription_plan text, subscription_status text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
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
$function$;

-- Fix search path for test_manual_login_tracking function
CREATE OR REPLACE FUNCTION public.test_manual_login_tracking(user_email text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
    target_user_id uuid;
    login_id uuid;
BEGIN
    -- Buscar user_id pelo email
    SELECT id INTO target_user_id 
    FROM auth.users 
    WHERE email = user_email;
    
    IF target_user_id IS NULL THEN
        RETURN 'ERRO: Usuário não encontrado';
    END IF;
    
    -- Inserir login manual para teste
    INSERT INTO public.user_login_history (
        user_id, login_at, ip_address, user_agent, device_type, browser, os
    ) VALUES (
        target_user_id, NOW(), '127.0.0.1'::inet, 'Manual Test', 'Desktop', 'Test', 'Test'
    ) RETURNING id INTO login_id;
    
    RETURN 'OK: Login manual inserido com ID ' || login_id;
END;
$function$;

-- Fix search path for get_admin_dashboard_stats function
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_stats()
 RETURNS TABLE(total_users bigint, total_projects bigint, active_subscriptions bigint, monthly_revenue numeric, new_users_this_month bigint, ai_usage_this_month bigint)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  SELECT 
    (SELECT COUNT(*) FROM auth.users),
    (SELECT COUNT(*) FROM public.projects),
    (SELECT COUNT(*) FROM public.user_subscriptions WHERE status = 'active'),
    (SELECT COALESCE(SUM(amount), 0) FROM public.payments WHERE created_at >= date_trunc('month', now())),
    (SELECT COUNT(*) FROM auth.users WHERE created_at >= date_trunc('month', now())),
    (SELECT COUNT(*) FROM public.ai_usage_metrics WHERE created_at >= date_trunc('month', now()))
  WHERE public.is_admin_user() = true;
$function$;

-- Fix search path for get_advanced_admin_analytics function
CREATE OR REPLACE FUNCTION public.get_advanced_admin_analytics()
 RETURNS TABLE(total_users bigint, active_users_week bigint, active_users_month bigint, avg_session_duration double precision, total_ai_calls bigint, ai_cost_month numeric, conversion_rate double precision, top_features jsonb)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  SELECT 
    (SELECT COUNT(*) FROM auth.users),
    (SELECT COUNT(DISTINCT user_id) FROM public.user_analytics WHERE last_active >= NOW() - INTERVAL '7 days'),
    (SELECT COUNT(DISTINCT user_id) FROM public.user_analytics WHERE last_active >= NOW() - INTERVAL '30 days'),
    (SELECT AVG(session_duration) FROM public.user_analytics WHERE created_at >= NOW() - INTERVAL '30 days'),
    (SELECT COUNT(*) FROM public.ai_usage_metrics WHERE created_at >= NOW() - INTERVAL '30 days'),
    (SELECT COALESCE(SUM(cost_usd), 0) FROM public.ai_usage_metrics WHERE created_at >= date_trunc('month', now())),
    (SELECT 
      CASE 
        WHEN (SELECT COUNT(*) FROM auth.users) > 0 
        THEN (SELECT COUNT(*) FROM public.user_subscriptions WHERE plan != 'free')::FLOAT / (SELECT COUNT(*) FROM auth.users)::FLOAT * 100
        ELSE 0 
      END),
    (SELECT jsonb_agg(
      jsonb_build_object(
        'feature', event_type,
        'count', count
      ) ORDER BY count DESC
    ) FROM (
      SELECT event_type, COUNT(*) as count 
      FROM public.user_analytics 
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY event_type 
      LIMIT 5
    ) top_events)
  WHERE public.is_admin_user() = true;
$function$;

-- Fix search path for update_user_segments function
CREATE OR REPLACE FUNCTION public.update_user_segments()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  -- Usuários ativos semanalmente
  INSERT INTO public.user_segments (user_id, segment_name, segment_data)
  SELECT DISTINCT 
    ua.user_id,
    'active_weekly',
    jsonb_build_object('last_activity', MAX(ua.last_active))
  FROM public.user_analytics ua
  WHERE ua.last_active >= NOW() - INTERVAL '7 days'
  GROUP BY ua.user_id
  ON CONFLICT (user_id, segment_name) 
  DO UPDATE SET 
    segment_data = EXCLUDED.segment_data,
    updated_at = NOW();

  -- Usuários com potencial (IA + Upload)
  INSERT INTO public.user_segments (user_id, segment_name, segment_data)
  SELECT DISTINCT 
    ua.user_id,
    'high_potential',
    jsonb_build_object(
      'ai_usage', COUNT(CASE WHEN ua.event_type = 'ai_used' THEN 1 END),
      'uploads', COUNT(CASE WHEN ua.event_type = 'file_uploaded' THEN 1 END)
    )
  FROM public.user_analytics ua
  WHERE ua.event_type IN ('ai_used', 'file_uploaded')
    AND ua.created_at >= NOW() - INTERVAL '30 days'
  GROUP BY ua.user_id
  HAVING 
    COUNT(CASE WHEN ua.event_type = 'ai_used' THEN 1 END) > 0 
    AND COUNT(CASE WHEN ua.event_type = 'file_uploaded' THEN 1 END) > 0
  ON CONFLICT (user_id, segment_name) 
  DO UPDATE SET 
    segment_data = EXCLUDED.segment_data,
    updated_at = NOW();

  -- Usuários estagnados
  INSERT INTO public.user_segments (user_id, segment_name, segment_data)
  SELECT DISTINCT 
    up.user_id,
    'stagnant',
    jsonb_build_object('days_inactive', EXTRACT(DAYS FROM (NOW() - MAX(ua.last_active))))
  FROM public.user_profiles up
  LEFT JOIN public.user_analytics ua ON up.user_id = ua.user_id
  WHERE ua.last_active < NOW() - INTERVAL '7 days'
    OR ua.last_active IS NULL
  GROUP BY up.user_id
  ON CONFLICT (user_id, segment_name) 
  DO UPDATE SET 
    segment_data = EXCLUDED.segment_data,
    updated_at = NOW();
END;
$function$;
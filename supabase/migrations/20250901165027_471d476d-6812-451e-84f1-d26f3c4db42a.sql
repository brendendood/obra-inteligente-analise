-- Fix remaining database functions that need search_path protection
-- This should address the final 11 function security warnings

-- Check and update all remaining functions that need SET search_path
-- These functions are likely missing from our previous updates

-- Update get_bulk_email_users function
CREATE OR REPLACE FUNCTION public.get_bulk_email_users(limit_count integer DEFAULT NULL::integer)
RETURNS TABLE(user_id uuid, full_name text, email text)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
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
$function$;

-- Update get_total_users_count function
CREATE OR REPLACE FUNCTION public.get_total_users_count()
RETURNS bigint
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT COUNT(*) FROM auth.users;
$function$;

-- Update is_superuser function
CREATE OR REPLACE FUNCTION public.is_superuser()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
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

-- Update is_admin_user function
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_permissions 
    WHERE user_id = auth.uid() 
    AND active = true 
    AND role = 'super_admin'
  ) OR public.is_superuser();
$function$;

-- Update log_admin_security_action function
CREATE OR REPLACE FUNCTION public.log_admin_security_action(p_admin_id uuid, p_action_type text, p_target_user_id uuid DEFAULT NULL::uuid, p_details jsonb DEFAULT '{}'::jsonb, p_success boolean DEFAULT true)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
    INSERT INTO public.admin_security_logs (
        admin_id,
        action_type,
        target_user_id,
        details,
        success
    ) VALUES (
        p_admin_id,
        p_action_type,
        p_target_user_id,
        p_details,
        p_success
    );
END;
$function$;

-- Update cleanup_expired_impersonation_sessions function
CREATE OR REPLACE FUNCTION public.cleanup_expired_impersonation_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
    -- Auto-end impersonation sessions older than 4 hours
    UPDATE public.admin_impersonation_logs
    SET 
        ended_at = now(),
        duration_minutes = EXTRACT(MINUTES FROM (now() - started_at))::integer
    WHERE ended_at IS NULL 
    AND started_at < (now() - INTERVAL '4 hours');
END;
$function$;

-- Update end_impersonation_session function
CREATE OR REPLACE FUNCTION public.end_impersonation_session(session_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  UPDATE public.admin_impersonation_logs
  SET 
    ended_at = now(),
    duration_minutes = EXTRACT(MINUTES FROM (now() - started_at))::integer
  WHERE id = session_id AND ended_at IS NULL;
END;
$function$;

-- Update validate_referral_code function
CREATE OR REPLACE FUNCTION public.validate_referral_code(p_ref_code text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
    referrer_data RECORD;
BEGIN
    -- Buscar dados do usuário que possui o código de referral
    SELECT 
        up.user_id,
        up.full_name,
        up.company,
        au.email
    INTO referrer_data
    FROM public.user_profiles up
    LEFT JOIN auth.users au ON up.user_id = au.id
    WHERE up.ref_code = p_ref_code;
    
    IF referrer_data IS NULL THEN
        RETURN jsonb_build_object(
            'valid', false,
            'message', 'Código de referral inválido'
        );
    END IF;
    
    RETURN jsonb_build_object(
        'valid', true,
        'message', 'Código de referral válido',
        'referrer', jsonb_build_object(
            'name', referrer_data.full_name,
            'company', referrer_data.company,
            'email', referrer_data.email
        )
    );
END;
$function$;

-- Update process_pending_welcome_emails function
CREATE OR REPLACE FUNCTION public.process_pending_welcome_emails()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
    processed_count INTEGER := 0;
    error_count INTEGER := 0;
    user_record RECORD;
    result_json jsonb;
BEGIN
    -- Buscar usuários confirmados que não receberam welcome email
    FOR user_record IN 
        SELECT DISTINCT
            up.user_id,
            up.full_name,
            au.email,
            au.email_confirmed_at,
            up.created_at
        FROM public.user_profiles up
        INNER JOIN auth.users au ON up.user_id = au.id
        LEFT JOIN public.email_logs el ON (
            el.user_id = up.user_id 
            AND el.email_type = 'welcome_user' 
            AND el.status = 'sent'
        )
        WHERE au.email_confirmed_at IS NOT NULL
          AND el.id IS NULL
          AND up.created_at >= NOW() - INTERVAL '30 days'
        ORDER BY up.created_at DESC
        LIMIT 50  -- Processar no máximo 50 por vez
    LOOP
        BEGIN
            -- Disparar notificação para envio de welcome email
            PERFORM pg_notify('send_welcome_email', json_build_object(
                'user_id', user_record.user_id,
                'email', user_record.email,
                'full_name', COALESCE(user_record.full_name, user_record.email),
                'timestamp', NOW(),
                'source', 'automatic_processing'
            )::text);
            
            processed_count := processed_count + 1;
            
            RAISE LOG 'Welcome email processado para user: % (email: %)', 
                user_record.user_id, user_record.email;
                
        EXCEPTION WHEN OTHERS THEN
            error_count := error_count + 1;
            RAISE LOG 'Erro ao processar welcome email para user %: %', 
                user_record.user_id, SQLERRM;
        END;
    END LOOP;
    
    -- Retornar resultado
    result_json := json_build_object(
        'success', true,
        'processed_users', processed_count,
        'errors', error_count,
        'timestamp', NOW()
    );
    
    RAISE LOG 'process_pending_welcome_emails concluído: % processados, % erros', 
        processed_count, error_count;
    
    RETURN result_json;
END;
$function$;

-- Update increment_ai_usage function
CREATE OR REPLACE FUNCTION public.increment_ai_usage(p_user uuid, p_period character)
RETURNS TABLE(count integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.ai_message_usage (user_id, period_ym, count, updated_at)
  VALUES (p_user, p_period, 1, now())
  ON CONFLICT (user_id, period_ym)
  DO UPDATE SET count = ai_message_usage.count + 1, updated_at = now()
  RETURNING ai_message_usage.count;
END;
$function$;

-- Update get_user_engagement function (the one that takes no parameters)
CREATE OR REPLACE FUNCTION public.get_user_engagement()
RETURNS TABLE(user_id uuid, engagement_score numeric)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
    RETURN QUERY 
    SELECT 
        auth.uid() AS user_id, 
        public.calculate_user_engagement(auth.uid()) AS engagement_score;
END;
$function$;
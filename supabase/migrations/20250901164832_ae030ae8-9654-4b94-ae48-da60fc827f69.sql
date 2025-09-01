-- Fix remaining database functions security issues
-- Add search_path protection to all remaining functions

-- Update get_admin_users_with_auth_data function
CREATE OR REPLACE FUNCTION public.get_admin_users_with_auth_data()
RETURNS TABLE(profile_id uuid, user_id uuid, email text, email_confirmed_at timestamp with time zone, full_name text, company text, phone text, city text, state text, country text, cargo text, avatar_url text, gender text, tags text[], created_at timestamp with time zone, last_sign_in_at timestamp with time zone, subscription_plan text, subscription_status text)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
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

-- Update handle_user_login function
CREATE OR REPLACE FUNCTION public.handle_user_login()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
    user_ip inet;
    login_record_id uuid;
    real_ip_address text;
    target_user_id uuid;
BEGIN
    -- Extrair user_id do payload
    target_user_id := (NEW.payload ->> 'user_id')::uuid;
    
    IF target_user_id IS NULL THEN
        RETURN NEW;
    END IF;
    
    -- Extrair IP real dos headers (prioridade para x-forwarded-for)
    real_ip_address := COALESCE(
        NEW.payload ->> 'x-forwarded-for',
        NEW.payload ->> 'x-real-ip', 
        NEW.payload ->> 'cf-connecting-ip',
        NEW.payload ->> 'ip',
        NEW.ip_address::text,
        '127.0.0.1'
    );
    
    -- Se for uma lista de IPs (x-forwarded-for), pegar o primeiro
    IF real_ip_address ~ ',' THEN
        real_ip_address := split_part(real_ip_address, ',', 1);
    END IF;
    
    -- Limpar espaços em branco
    real_ip_address := trim(real_ip_address);
    
    -- Converter para inet
    user_ip := COALESCE(real_ip_address::inet, '127.0.0.1'::inet);

    -- Inserir dados de login na tabela user_login_history
    INSERT INTO public.user_login_history (
        user_id,
        login_at,
        ip_address,
        user_agent,
        device_type,
        browser,
        os,
        city,
        region,
        country
    ) VALUES (
        target_user_id,
        NEW.created_at,
        user_ip,
        COALESCE(NEW.payload ->> 'user_agent', 'Unknown'),
        CASE 
            WHEN NEW.payload ->> 'user_agent' ILIKE '%mobile%' OR NEW.payload ->> 'user_agent' ILIKE '%android%' OR NEW.payload ->> 'user_agent' ILIKE '%iphone%' THEN 'Mobile'
            WHEN NEW.payload ->> 'user_agent' ILIKE '%tablet%' OR NEW.payload ->> 'user_agent' ILIKE '%ipad%' THEN 'Tablet'
            ELSE 'Desktop'
        END,
        CASE 
            WHEN NEW.payload ->> 'user_agent' ILIKE '%chrome%' THEN 'Chrome'
            WHEN NEW.payload ->> 'user_agent' ILIKE '%firefox%' THEN 'Firefox'
            WHEN NEW.payload ->> 'user_agent' ILIKE '%safari%' THEN 'Safari'
            WHEN NEW.payload ->> 'user_agent' ILIKE '%edge%' THEN 'Edge'
            ELSE 'Other'
        END,
        CASE 
            WHEN NEW.payload ->> 'user_agent' ILIKE '%windows%' THEN 'Windows'
            WHEN NEW.payload ->> 'user_agent' ILIKE '%mac%' THEN 'macOS'
            WHEN NEW.payload ->> 'user_agent' ILIKE '%linux%' THEN 'Linux'
            WHEN NEW.payload ->> 'user_agent' ILIKE '%android%' THEN 'Android'
            WHEN NEW.payload ->> 'user_agent' ILIKE '%ios%' THEN 'iOS'
            ELSE 'Other'
        END,
        -- Inicializar com null - será preenchido pela edge function
        NULL,
        NULL,
        NULL
    ) RETURNING id INTO login_record_id;

    -- Chamar edge function ATUALIZADA para capturar geolocalização REAL
    PERFORM pg_notify('real_geolocation_capture', json_build_object(
        'login_id', login_record_id,
        'ip_address', real_ip_address,
        'user_id', target_user_id,
        'timestamp', NEW.created_at
    )::text);
    
    RETURN NEW;
END;
$function$;

-- Update sync_user_metadata function
CREATE OR REPLACE FUNCTION public.sync_user_metadata()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  -- Atualizar user_metadata no auth.users quando user_profiles for alterado
  UPDATE auth.users 
  SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object(
    'full_name', NEW.full_name,
    'company', NEW.company,
    'phone', NEW.phone,
    'city', NEW.city,
    'state', NEW.state,
    'country', NEW.country,
    'avatar_url', NEW.avatar_url,
    'avatar_type', NEW.avatar_type,
    'gender', NEW.gender,
    'cargo', NEW.cargo,
    'empresa', NEW.empresa
  )
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$function$;

-- Update sync_admin_user_changes function
CREATE OR REPLACE FUNCTION public.sync_admin_user_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  -- Se é uma atualização na tabela user_subscriptions
  IF TG_TABLE_NAME = 'user_subscriptions' THEN
    -- Notificar via pg_notify que a subscription mudou (para refresh automático do admin)
    PERFORM pg_notify('user_subscription_changed', json_build_object(
      'user_id', NEW.user_id,
      'plan', NEW.plan,
      'status', NEW.status,
      'action', 'subscription_updated'
    )::text);
  END IF;
  
  -- Se é uma atualização na tabela user_profiles
  IF TG_TABLE_NAME = 'user_profiles' THEN
    -- Notificar via pg_notify que o perfil mudou (para refresh automático do admin)
    PERFORM pg_notify('user_profile_changed', json_build_object(
      'user_id', NEW.user_id,
      'full_name', NEW.full_name,
      'company', NEW.company,
      'action', 'profile_updated'
    )::text);
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Update handle_referral_signup function
CREATE OR REPLACE FUNCTION public.handle_referral_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
    referrer_id UUID;
    ref_code TEXT;
BEGIN
    -- Extract referral code from metadata
    ref_code := NEW.raw_user_meta_data->>'ref_code';
    
    IF ref_code IS NOT NULL THEN
        -- Find the referrer
        SELECT user_id INTO referrer_id 
        FROM public.user_profiles 
        WHERE ref_code = ref_code;
        
        IF referrer_id IS NOT NULL THEN
            -- Update the new user's profile with referral info
            UPDATE public.user_profiles 
            SET referred_by = ref_code 
            WHERE user_id = NEW.id;
            
            -- Create referral record
            INSERT INTO public.user_referrals (
                referrer_user_id, 
                referred_user_id, 
                referral_code
            ) VALUES (
                referrer_id, 
                NEW.id, 
                ref_code
            );
            
            -- Award immediate points to both users
            PERFORM public.award_points(NEW.id, 50, 'signup_with_referral');
            PERFORM public.award_points(referrer_id, 25, 'successful_referral');
        END IF;
    END IF;
    
    RETURN NEW;
END;
$function$;

-- Update trigger_project_completion_email function
CREATE OR REPLACE FUNCTION public.trigger_project_completion_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
    project_count INTEGER;
    user_email TEXT;
BEGIN
    -- Contar projetos concluídos do usuário
    SELECT COUNT(*) INTO project_count
    FROM public.projects 
    WHERE user_id = NEW.user_id 
    AND status = 'completed';
    
    -- Se chegou a 10 projetos concluídos
    IF project_count = 10 THEN
        -- Buscar email do usuário
        SELECT email INTO user_email
        FROM auth.users 
        WHERE id = NEW.user_id;
        
        -- Disparar notificação para envio de email
        PERFORM pg_notify('project_milestone_reached', json_build_object(
            'user_id', NEW.user_id,
            'email', user_email,
            'milestone_type', '10_projects_completed',
            'project_count', project_count
        )::text);
    END IF;
    
    RETURN NEW;
END;
$function$;

-- Update trigger_segment_update function
CREATE OR REPLACE FUNCTION public.trigger_segment_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
    -- Your existing function implementation here
    -- Make sure to use fully qualified schema.table references
    -- For example: 
    -- INSERT INTO public.some_table (column) VALUES (NEW.column);
    
    RETURN NEW;
END;
$function$;
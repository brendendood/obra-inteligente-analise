-- Phase 1: Critical Database Security Fixes

-- Fix search path security issues in functions
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.user_profiles (
    user_id, 
    full_name,
    company,
    cargo,
    avatar_url,
    avatar_type,
    gender
  )
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'company', ''),
    COALESCE(NEW.raw_user_meta_data->>'cargo', ''),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'avatar_type', 'initials'),
    COALESCE(NEW.raw_user_meta_data->>'gender', 'male')
  );
  
  -- Inserir assinatura FREE como padrão
  INSERT INTO public.user_subscriptions (user_id, plan, status)
  VALUES (NEW.id, 'free', 'active');
  
  RETURN NEW;
END;
$function$;

-- Fix sync_user_metadata function
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

-- Fix handle_user_login function
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
        os
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
        END
    ) RETURNING id INTO login_record_id;

    -- Chamar edge function para capturar geolocalização real (async)
    PERFORM pg_notify('new_login_geolocation', json_build_object(
        'login_id', login_record_id,
        'ip_address', real_ip_address,
        'user_id', target_user_id
    )::text);
    
    RETURN NEW;
END;
$function$;

-- Fix get_admin_users_with_auth_data function
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

-- Add missing RLS policies
-- Add INSERT policy for user_subscriptions
CREATE POLICY "Users can create their own subscription" ON public.user_subscriptions
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Add comprehensive audit logging for admin impersonation
CREATE TABLE IF NOT EXISTS public.admin_security_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id uuid NOT NULL,
    action_type text NOT NULL,
    target_user_id uuid,
    ip_address inet,
    user_agent text,
    success boolean DEFAULT true,
    details jsonb DEFAULT '{}',
    created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on security logs
ALTER TABLE public.admin_security_logs ENABLE ROW LEVEL SECURITY;

-- Only superusers can view security logs
CREATE POLICY "Only superusers can view security logs" ON public.admin_security_logs
FOR ALL 
USING (is_superuser());

-- Enhanced impersonation function with better security
CREATE OR REPLACE FUNCTION public.log_admin_security_action(
    p_admin_id uuid,
    p_action_type text,
    p_target_user_id uuid DEFAULT NULL,
    p_details jsonb DEFAULT '{}',
    p_success boolean DEFAULT true
)
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

-- Add session timeout for impersonation
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
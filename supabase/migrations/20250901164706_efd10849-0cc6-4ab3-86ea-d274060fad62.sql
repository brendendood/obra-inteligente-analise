-- Critical Security Fixes Migration
-- Fix RLS policy gaps and secure database functions

-- 1. Fix kv_store_40b370d9 table - add restrictive RLS policies
-- Since this appears to be a key-value store, we'll make it admin-only for security
CREATE POLICY "Only superusers can manage kv store" 
ON public.kv_store_40b370d9 
FOR ALL 
USING (public.is_superuser());

-- 2. Add missing DELETE policy for user_profiles
CREATE POLICY "Users can delete their own profile" 
ON public.user_profiles 
FOR DELETE 
USING (auth.uid() = user_id);

-- 3. Secure database functions by adding proper search_path settings
-- Update handle_new_user_profile function
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
    new_ref_code TEXT;
    referrer_id UUID;
    referral_code_input TEXT;
    profile_created BOOLEAN := FALSE;
    referral_processed BOOLEAN := FALSE;
    gamification_initialized BOOLEAN := FALSE;
BEGIN
    RAISE LOG 'handle_new_user_profile: Iniciando para user_id %', NEW.id;
    
    -- Gerar um ref_code único baseado no ID
    new_ref_code := CONCAT('REF_', SUBSTRING(NEW.id::text, 1, 8));
    
    -- Extrair referral code do metadata
    referral_code_input := NEW.raw_user_meta_data->>'ref_code';
    
    RAISE LOG 'handle_new_user_profile: ref_code recebido = %', referral_code_input;
    
    BEGIN
        -- Inserir perfil do usuário com 0 créditos base (apenas plano free = 2 projetos)
        INSERT INTO public.user_profiles (
            user_id, 
            full_name,
            company,
            cargo,
            avatar_url,
            avatar_type,
            gender,
            ref_code,
            referred_by,
            credits
        )
        VALUES (
            NEW.id, 
            COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
            COALESCE(NEW.raw_user_meta_data->>'company', ''),
            COALESCE(NEW.raw_user_meta_data->>'cargo', ''),
            NEW.raw_user_meta_data->>'avatar_url',
            COALESCE(NEW.raw_user_meta_data->>'avatar_type', 'initials'),
            COALESCE(NEW.raw_user_meta_data->>'gender', 'male'),
            new_ref_code,
            referral_code_input,
            0  -- 0 créditos base (plano free já dá 2 projetos)
        );
        
        profile_created := TRUE;
        RAISE LOG 'handle_new_user_profile: Perfil criado com 0 créditos base';
        
    EXCEPTION WHEN OTHERS THEN
        RAISE LOG 'handle_new_user_profile: ERRO ao criar perfil - %', SQLERRM;
        RETURN NEW;
    END;
    
    BEGIN
        -- Inserir assinatura FREE
        INSERT INTO public.user_subscriptions (user_id, plan, status)
        VALUES (NEW.id, 'free', 'active')
        ON CONFLICT (user_id) DO NOTHING;
        
    EXCEPTION WHEN OTHERS THEN
        RAISE LOG 'handle_new_user_profile: ERRO ao criar subscription - %', SQLERRM;
    END;
    
    -- INICIALIZAR GAMIFICAÇÃO SEMPRE (100 XP base)
    BEGIN
        PERFORM public.award_points(NEW.id, 100, 'signup');
        gamification_initialized := TRUE;
        RAISE LOG 'handle_new_user_profile: Gamificação inicializada com 100 XP';
    EXCEPTION WHEN OTHERS THEN
        RAISE LOG 'handle_new_user_profile: ERRO ao inicializar gamificação - %', SQLERRM;
    END;
    
    -- Processar referral se presente
    IF referral_code_input IS NOT NULL THEN
        BEGIN
            RAISE LOG 'handle_new_user_profile: Processando referral code %', referral_code_input;
            
            -- Encontrar o usuário que fez a indicação
            SELECT up.user_id INTO referrer_id 
            FROM public.user_profiles up
            WHERE up.ref_code = referral_code_input;
            
            IF referrer_id IS NOT NULL THEN
                RAISE LOG 'handle_new_user_profile: Referrer encontrado: %', referrer_id;
                
                -- Criar registro de referral
                INSERT INTO public.user_referrals (
                    referrer_user_id, 
                    referred_user_id, 
                    referral_code,
                    credits_awarded
                ) VALUES (
                    referrer_id, 
                    NEW.id, 
                    referral_code_input,
                    TRUE
                );
                
                -- Dar 5 créditos extras para o novo usuário (0 + 5 = 5 total)
                UPDATE public.user_profiles 
                SET credits = credits + 5 
                WHERE user_id = NEW.id;
                
                -- Dar 5 créditos para quem indicou
                UPDATE public.user_profiles 
                SET credits = credits + 5 
                WHERE user_id = referrer_id;
                
                -- Dar XP extra para usuário referenciado (+50 XP = 150 total)
                PERFORM public.award_points(NEW.id, 50, 'signup_with_referral');
                
                -- Dar XP para quem indicou (+25 XP)
                PERFORM public.award_points(referrer_id, 25, 'successful_referral');
                
                referral_processed := TRUE;
                RAISE LOG 'handle_new_user_profile: Referral processado - Usuário: 5 créditos + 150 XP, Referrer: +5 créditos + 25 XP';
                
            ELSE
                RAISE LOG 'handle_new_user_profile: Referral code inválido: %', referral_code_input;
            END IF;
            
        EXCEPTION WHEN OTHERS THEN
            RAISE LOG 'handle_new_user_profile: ERRO no processamento de referral - %', SQLERRM;
        END;
    END IF;
    
    -- DISPARAR EMAILS IMEDIATAMENTE (não bloquear se falhar)
    BEGIN
        -- Email de boas-vindas imediato
        PERFORM pg_notify('send_welcome_email', json_build_object(
            'user_id', NEW.id,
            'email', NEW.email,
            'full_name', COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
            'timestamp', NOW()
        )::text);
        
        -- Email de onboarding (step 1) com delay de 5 minutos
        PERFORM pg_notify('send_onboarding_email', json_build_object(
            'user_id', NEW.id,
            'email', NEW.email,
            'full_name', COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
            'delay_minutes', 5,
            'timestamp', NOW()
        )::text);
        
        RAISE LOG 'handle_new_user_profile: Emails de boas-vindas e onboarding disparados';
        
    EXCEPTION WHEN OTHERS THEN
        RAISE LOG 'handle_new_user_profile: ERRO ao disparar emails - %', SQLERRM;
    END;
    
    RAISE LOG 'handle_new_user_profile: Concluído. Profile: %, Gamificação: %, Referral: %', profile_created, gamification_initialized, referral_processed;
    
    RETURN NEW;
END;
$function$;

-- Update other critical functions with search_path protection
CREATE OR REPLACE FUNCTION public.calculate_user_engagement(target_user_id uuid)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
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

-- Update admin_update_user_complete function
CREATE OR REPLACE FUNCTION public.admin_update_user_complete(target_user_id uuid, admin_user_id uuid, profile_data jsonb DEFAULT '{}'::jsonb, subscription_data jsonb DEFAULT '{}'::jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  updated_profile RECORD;
  updated_subscription RECORD;
  audit_data jsonb := '{}'::jsonb;
BEGIN
  -- Verificar se o usuário que está fazendo a alteração é admin
  IF NOT (SELECT public.is_admin_user()) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized access');
  END IF;
  
  -- Atualizar perfil se houver dados
  IF jsonb_object_keys(profile_data) != '{}' THEN
    UPDATE public.user_profiles 
    SET 
      full_name = COALESCE(profile_data->>'full_name', full_name),
      company = COALESCE(profile_data->>'company', company),
      phone = COALESCE(profile_data->>'phone', phone),
      city = COALESCE(profile_data->>'city', city),
      state = COALESCE(profile_data->>'state', state),
      cargo = COALESCE(profile_data->>'cargo', cargo),
      updated_at = now()
    WHERE user_id = target_user_id
    RETURNING * INTO updated_profile;
    
    audit_data := audit_data || jsonb_build_object('profile_updated', true);
  END IF;
  
  -- Atualizar assinatura se houver dados
  IF jsonb_object_keys(subscription_data) != '{}' THEN
    INSERT INTO public.user_subscriptions (user_id, plan, status, updated_at)
    VALUES (
      target_user_id,
      COALESCE((subscription_data->>'plan')::subscription_plan, 'free'::subscription_plan),
      COALESCE((subscription_data->>'status')::subscription_status, 'active'::subscription_status),
      now()
    )
    ON CONFLICT (user_id) DO UPDATE SET
      plan = COALESCE((subscription_data->>'plan')::subscription_plan, user_subscriptions.plan),
      status = COALESCE((subscription_data->>'status')::subscription_status, user_subscriptions.status),
      updated_at = now()
    RETURNING * INTO updated_subscription;
    
    audit_data := audit_data || jsonb_build_object('subscription_updated', true);
    
    -- Log específico para mudança de plano pelo admin
    PERFORM public.log_admin_security_action(
      admin_user_id,
      'plan_change',
      target_user_id,
      jsonb_build_object(
        'new_plan', subscription_data->>'plan',
        'new_status', subscription_data->>'status',
        'changed_by_admin', true
      ),
      true
    );
  END IF;
  
  -- Notificar o usuário sobre mudanças feitas pelo admin (especialmente plano)
  IF updated_subscription IS NOT NULL THEN
    PERFORM pg_notify('admin_plan_change_notification', json_build_object(
      'user_id', target_user_id,
      'new_plan', updated_subscription.plan,
      'changed_by_admin', true,
      'admin_id', admin_user_id
    )::text);
  END IF;
  
  RETURN jsonb_build_object(
    'success', true,
    'profile_updated', updated_profile IS NOT NULL,
    'subscription_updated', updated_subscription IS NOT NULL,
    'audit_data', audit_data
  );
END;
$function$;
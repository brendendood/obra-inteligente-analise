-- ============================================
-- CORREÇÃO: Garantir que todos os usuários tenham plano
-- ============================================

-- 1. Adicionar plano BASIC a usuários existentes sem plano
INSERT INTO public.user_plans (user_id, plan_tier, billing_cycle, seats, messages_quota)
SELECT 
  up.user_id,
  'BASIC',
  'mensal',
  1,
  500
FROM public.user_profiles up
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_plans upl WHERE upl.user_id = up.user_id
)
ON CONFLICT (user_id) DO NOTHING;

-- 2. Atualizar função handle_new_user_profile para criar user_plan automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    new_ref_code TEXT;
    referrer_id UUID;
    referral_code_input TEXT;
    profile_created BOOLEAN := FALSE;
    referral_processed BOOLEAN := FALSE;
    gamification_initialized BOOLEAN := FALSE;
    plan_created BOOLEAN := FALSE;
BEGIN
    RAISE LOG 'handle_new_user_profile: Iniciando para user_id %', NEW.id;
    
    new_ref_code := CONCAT('REF_', SUBSTRING(NEW.id::text, 1, 8));
    referral_code_input := NEW.raw_user_meta_data->>'ref_code';
    
    -- CRIAR PERFIL
    BEGIN
        INSERT INTO public.user_profiles (
            user_id, full_name, company, cargo, avatar_url, avatar_type, gender,
            ref_code, referred_by, credits, quiz_completed, plan_selected
        )
        VALUES (
            NEW.id, 
            COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
            COALESCE(NEW.raw_user_meta_data->>'company', ''),
            COALESCE(NEW.raw_user_meta_data->>'cargo', ''),
            NEW.raw_user_meta_data->>'avatar_url',
            COALESCE(NEW.raw_user_meta_data->>'avatar_type', 'initials'),
            COALESCE(NEW.raw_user_meta_data->>'gender', 'male'),
            new_ref_code, referral_code_input, 0, false, false
        );
        profile_created := TRUE;
    EXCEPTION WHEN OTHERS THEN
        RAISE LOG 'handle_new_user_profile: ERRO perfil - %', SQLERRM;
        RETURN NEW;
    END;
    
    -- CRIAR PLANO BASIC (OBRIGATÓRIO)
    BEGIN
        INSERT INTO public.user_plans (user_id, plan_tier, billing_cycle, seats, messages_quota)
        VALUES (NEW.id, 'BASIC', 'mensal', 1, 500);
        plan_created := TRUE;
        RAISE LOG 'handle_new_user_profile: Plano BASIC criado';
    EXCEPTION WHEN OTHERS THEN
        RAISE LOG 'handle_new_user_profile: ERRO plano - %', SQLERRM;
    END;
    
    -- GAMIFICAÇÃO
    BEGIN
        PERFORM public.award_points(NEW.id, 100, 'signup');
        gamification_initialized := TRUE;
    EXCEPTION WHEN OTHERS THEN
        RAISE LOG 'handle_new_user_profile: ERRO gamificação - %', SQLERRM;
    END;
    
    -- REFERRAL
    IF referral_code_input IS NOT NULL THEN
        BEGIN
            SELECT up.user_id INTO referrer_id FROM public.user_profiles up WHERE up.ref_code = referral_code_input;
            IF referrer_id IS NOT NULL THEN
                INSERT INTO public.user_referrals (referrer_user_id, referred_user_id, referral_code, credits_awarded)
                VALUES (referrer_id, NEW.id, referral_code_input, TRUE);
                UPDATE public.user_profiles SET credits = credits + 5 WHERE user_id IN (NEW.id, referrer_id);
                PERFORM public.award_points(NEW.id, 50, 'signup_with_referral');
                PERFORM public.award_points(referrer_id, 25, 'successful_referral');
                referral_processed := TRUE;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE LOG 'handle_new_user_profile: ERRO referral - %', SQLERRM;
        END;
    END IF;
    
    -- EMAIL
    BEGIN
        PERFORM pg_notify('send_welcome_email', json_build_object('user_id', NEW.id, 'email', NEW.email, 'full_name', COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), 'timestamp', NOW())::text);
    EXCEPTION WHEN OTHERS THEN NULL; END;
    
    RAISE LOG 'handle_new_user_profile: ✓ Profile:% Plan:% Gamif:% Ref:%', profile_created, plan_created, gamification_initialized, referral_processed;
    RETURN NEW;
END;
$function$;
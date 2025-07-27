-- Corrigir sistema de referral completamente

-- 1. Primeiro vamos remover o trigger problematico de handle_referral_signup
DROP TRIGGER IF EXISTS on_referral_signup ON auth.users;

-- 2. Corrigir a função handle_new_user_profile para incluir lógica de referral
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
    new_ref_code TEXT;
    referrer_id UUID;
    ref_code TEXT;
BEGIN
    -- Gerar um ref_code único baseado no ID
    new_ref_code := CONCAT('REF_', SUBSTRING(NEW.id::text, 1, 8));
    
    -- Extrair referral code do metadata
    ref_code := NEW.raw_user_meta_data->>'ref_code';
    
    -- Inserir perfil do usuário
    INSERT INTO public.user_profiles (
        user_id, 
        full_name,
        company,
        cargo,
        avatar_url,
        avatar_type,
        gender,
        ref_code,
        referred_by
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
        ref_code  -- Salvar o código que foi usado para se referir
    );
    
    -- Inserir assinatura FREE como padrão
    INSERT INTO public.user_subscriptions (user_id, plan, status)
    VALUES (NEW.id, 'free', 'active');
    
    -- Processar referral se presente
    IF ref_code IS NOT NULL THEN
        -- Encontrar o usuário que fez a indicação
        SELECT user_id INTO referrer_id 
        FROM public.user_profiles 
        WHERE ref_code = ref_code;
        
        IF referrer_id IS NOT NULL THEN
            -- Criar registro de referral
            INSERT INTO public.user_referrals (
                referrer_user_id, 
                referred_user_id, 
                referral_code
            ) VALUES (
                referrer_id, 
                NEW.id, 
                ref_code
            );
            
            -- Dar 5 créditos para o novo usuário
            UPDATE public.user_profiles 
            SET credits = credits + 5 
            WHERE user_id = NEW.id;
            
            -- Dar 5 créditos para quem indicou
            UPDATE public.user_profiles 
            SET credits = credits + 5 
            WHERE user_id = referrer_id;
            
            -- Também dar pontos de gamificação
            PERFORM public.award_points(NEW.id, 50, 'signup_with_referral');
            PERFORM public.award_points(referrer_id, 25, 'successful_referral');
        END IF;
    ELSE
        -- Dar 5 créditos iniciais para usuário sem referral
        UPDATE public.user_profiles 
        SET credits = credits + 5 
        WHERE user_id = NEW.id;
    END IF;
    
    RETURN NEW;
END;
$function$;

-- 3. Criar função para validar código de referral
CREATE OR REPLACE FUNCTION public.validate_referral_code(ref_code TEXT)
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
    WHERE up.ref_code = ref_code;
    
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

-- 4. Função para corrigir referrals existentes (migração de dados)
CREATE OR REPLACE FUNCTION public.fix_existing_referrals()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
    fixed_count INTEGER := 0;
    user_record RECORD;
    referrer_id UUID;
BEGIN
    -- Buscar usuários que têm referred_by mas não têm referral registrado
    FOR user_record IN 
        SELECT up.user_id, up.referred_by, up.credits
        FROM public.user_profiles up
        WHERE up.referred_by IS NOT NULL
        AND NOT EXISTS (
            SELECT 1 FROM public.user_referrals ur 
            WHERE ur.referred_user_id = up.user_id
        )
    LOOP
        -- Encontrar o referrer
        SELECT user_id INTO referrer_id 
        FROM public.user_profiles 
        WHERE ref_code = user_record.referred_by;
        
        IF referrer_id IS NOT NULL THEN
            -- Criar registro de referral
            INSERT INTO public.user_referrals (
                referrer_user_id, 
                referred_user_id, 
                referral_code,
                credits_awarded,
                referred_user_first_project
            ) VALUES (
                referrer_id, 
                user_record.user_id, 
                user_record.referred_by,
                true,
                false
            );
            
            -- Garantir que ambos têm pelo menos 5 créditos
            UPDATE public.user_profiles 
            SET credits = GREATEST(credits, 5)
            WHERE user_id IN (user_record.user_id, referrer_id);
            
            fixed_count := fixed_count + 1;
        END IF;
    END LOOP;
    
    RETURN 'Fixed ' || fixed_count || ' referral records';
END;
$function$;
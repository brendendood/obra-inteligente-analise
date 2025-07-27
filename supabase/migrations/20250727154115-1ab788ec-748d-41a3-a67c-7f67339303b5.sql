-- Corrigir função handle_new_user_profile para resolver ambiguidade no ref_code
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
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
        -- Encontrar o usuário que fez a indicação - CORRIGIR AQUI A AMBIGUIDADE
        SELECT up.user_id INTO referrer_id 
        FROM public.user_profiles up
        WHERE up.ref_code = ref_code;
        
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
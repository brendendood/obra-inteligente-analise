-- 1. Migrar todos os usuários free para basic (limpeza final)
UPDATE users 
SET plan_code = 'basic' 
WHERE plan_code = 'free' OR plan_code IS NULL;

-- 2. Atualizar função trigger para usuários novos começarem com plan_code = null
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER
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
        -- Inserir perfil do usuário com 0 créditos base
        -- IMPORTANTE: Usuários novos agora começam sem plano (plan_code = null)
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
            credits,
            quiz_completed,
            plan_selected
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
            0,  -- 0 créditos base
            false, -- Quiz não completado
            false  -- Plano não selecionado
        );
        
        profile_created := TRUE;
        RAISE LOG 'handle_new_user_profile: Perfil criado - precisa completar quiz e escolher plano';
        
    EXCEPTION WHEN OTHERS THEN
        RAISE LOG 'handle_new_user_profile: ERRO ao criar perfil - %', SQLERRM;
        RETURN NEW;
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
                
                -- Dar 5 créditos extras para o novo usuário
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
        
        RAISE LOG 'handle_new_user_profile: Email de boas-vindas disparado';
        
    EXCEPTION WHEN OTHERS THEN
        RAISE LOG 'handle_new_user_profile: ERRO ao disparar emails - %', SQLERRM;
    END;
    
    RAISE LOG 'handle_new_user_profile: Concluído. Profile: %, Gamificação: %, Referral: %', profile_created, gamification_initialized, referral_processed;
    
    RETURN NEW;
END;
$function$;
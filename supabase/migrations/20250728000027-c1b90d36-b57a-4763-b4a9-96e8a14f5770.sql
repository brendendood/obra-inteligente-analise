-- FASE 1: CORREÇÃO CRÍTICA DA GAMIFICAÇÃO
-- Corrigir função award_points para garantir criação de registros mesmo quando não existem

CREATE OR REPLACE FUNCTION public.award_points(target_user_id uuid, points integer, action_type text, details jsonb DEFAULT '{}'::jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    current_gamification RECORD;
    new_level INTEGER;
    level_up BOOLEAN := FALSE;
BEGIN
    -- Buscar dados de gamificação atual
    SELECT * INTO current_gamification 
    FROM public.user_gamification 
    WHERE user_id = target_user_id;
    
    -- Se não existe registro, criar um novo
    IF current_gamification IS NULL THEN
        new_level := public.calculate_level_from_points(points);
        
        INSERT INTO public.user_gamification (
            user_id, 
            total_points, 
            current_level,
            current_level_points,
            daily_streak,
            last_action_date,
            last_login_date,
            achievements
        )
        VALUES (
            target_user_id, 
            points, 
            new_level,
            points,
            1,
            CURRENT_DATE,
            CURRENT_DATE,
            '[]'::jsonb
        );
        
        RAISE LOG 'award_points: Criado novo registro de gamificação para user % com % pontos, nível %', target_user_id, points, new_level;
    ELSE
        -- Calcular novo nível
        new_level := public.calculate_level_from_points(current_gamification.total_points + points);
        level_up := new_level > current_gamification.current_level;
        
        -- Atualizar dados de gamificação
        UPDATE public.user_gamification 
        SET 
            total_points = total_points + points,
            current_level = new_level,
            current_level_points = total_points + points,
            last_action_date = CURRENT_DATE,
            updated_at = now()
        WHERE user_id = target_user_id;
        
        RAISE LOG 'award_points: Atualizado registro existente para user % - novos pontos: %, novo nível: %', target_user_id, (current_gamification.total_points + points), new_level;
    END IF;
    
    -- Registrar a ação no log
    INSERT INTO public.gamification_logs (user_id, action_type, points_awarded, details)
    VALUES (target_user_id, action_type, points, details);
    
    -- Se houve level up, adicionar aos detalhes para notificação
    IF level_up THEN
        UPDATE public.gamification_logs 
        SET details = details || jsonb_build_object('level_up', true, 'new_level', new_level)
        WHERE user_id = target_user_id 
        AND action_type = action_type 
        AND created_at = (SELECT MAX(created_at) FROM public.gamification_logs WHERE user_id = target_user_id);
        
        RAISE LOG 'award_points: Level up detectado! User % subiu para nível %', target_user_id, new_level;
    END IF;
END;
$function$;

-- FASE 2: CORREÇÃO DO SISTEMA DE REFERRAL
-- Corrigir handle_new_user_profile para melhor processamento de referrals

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
BEGIN
    RAISE LOG 'handle_new_user_profile: Iniciando para user_id %', NEW.id;
    
    -- Gerar um ref_code único baseado no ID
    new_ref_code := CONCAT('REF_', SUBSTRING(NEW.id::text, 1, 8));
    
    -- Extrair referral code do metadata
    referral_code_input := NEW.raw_user_meta_data->>'ref_code';
    
    RAISE LOG 'handle_new_user_profile: ref_code recebido = %', referral_code_input;
    
    BEGIN
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
            5  -- Créditos base
        );
        
        profile_created := TRUE;
        RAISE LOG 'handle_new_user_profile: Perfil criado com sucesso';
        
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
                
                -- Dar 5 créditos extras para o novo usuário (total = 10)
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
                RAISE LOG 'handle_new_user_profile: Referral processado com sucesso - Usuário: 10 créditos + 150 XP, Referrer: +5 créditos + 25 XP';
                
            ELSE
                RAISE LOG 'handle_new_user_profile: Referral code inválido: %', referral_code_input;
            END IF;
            
        EXCEPTION WHEN OTHERS THEN
            RAISE LOG 'handle_new_user_profile: ERRO no processamento de referral - %', SQLERRM;
        END;
    END IF;
    
    RAISE LOG 'handle_new_user_profile: Concluído. Profile: %, Gamificação: %, Referral: %', profile_created, gamification_initialized, referral_processed;
    
    RETURN NEW;
END;
$function$;

-- FASE 3: CORREÇÃO MANUAL DO USUÁRIO DE TESTE
-- Corrigir manualmente o usuário gamificacao.teste@gmail.com

DO $$
DECLARE
    test_user_id UUID;
    referrer_user_id UUID;
BEGIN
    -- Buscar ID do usuário de teste
    SELECT au.id INTO test_user_id
    FROM auth.users au
    WHERE au.email = 'gamificacao.teste@gmail.com';
    
    -- Buscar ID do referrer (REF_61f26010)
    SELECT up.user_id INTO referrer_user_id
    FROM public.user_profiles up
    WHERE up.ref_code = 'REF_61f26010';
    
    IF test_user_id IS NOT NULL AND referrer_user_id IS NOT NULL THEN
        -- Atualizar perfil do usuário de teste
        UPDATE public.user_profiles 
        SET 
            referred_by = 'REF_61f26010',
            credits = 10
        WHERE user_id = test_user_id;
        
        -- Criar registro de referral
        INSERT INTO public.user_referrals (
            referrer_user_id, 
            referred_user_id, 
            referral_code,
            credits_awarded
        ) VALUES (
            referrer_user_id, 
            test_user_id, 
            'REF_61f26010',
            TRUE
        ) ON CONFLICT DO NOTHING;
        
        -- Dar +5 créditos para o referrer
        UPDATE public.user_profiles 
        SET credits = credits + 5 
        WHERE user_id = referrer_user_id;
        
        -- Inicializar gamificação com 150 XP (100 base + 50 referral)
        DELETE FROM public.user_gamification WHERE user_id = test_user_id;
        DELETE FROM public.gamification_logs WHERE user_id = test_user_id;
        
        PERFORM public.award_points(test_user_id, 100, 'signup');
        PERFORM public.award_points(test_user_id, 50, 'signup_with_referral');
        PERFORM public.award_points(referrer_user_id, 25, 'successful_referral');
        
        RAISE NOTICE 'Usuário de teste corrigido com sucesso: 10 créditos, 150 XP, referral processado';
    ELSE
        RAISE NOTICE 'Usuário de teste ou referrer não encontrado';
    END IF;
END $$;
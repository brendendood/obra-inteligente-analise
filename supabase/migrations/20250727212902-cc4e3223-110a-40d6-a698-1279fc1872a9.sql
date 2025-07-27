-- ✅ CORREÇÃO COMPLETA DO SISTEMA DE CADASTRO
-- Corrigir a ambiguidade na função handle_new_user_profile

DROP FUNCTION IF EXISTS public.handle_new_user_profile() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
    new_ref_code TEXT;
    referrer_id UUID;
    referral_code_input TEXT;  -- Renomeado para evitar ambiguidade
    profile_created BOOLEAN := FALSE;
    referral_processed BOOLEAN := FALSE;
BEGIN
    -- Log início da função
    RAISE LOG 'handle_new_user_profile: Iniciando para user_id %', NEW.id;
    
    -- Gerar um ref_code único baseado no ID
    new_ref_code := CONCAT('REF_', SUBSTRING(NEW.id::text, 1, 8));
    
    -- Extrair referral code do metadata (renomeada para evitar conflito)
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
            ref_code,  -- Esta é a coluna da tabela
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
            new_ref_code,  -- Novo código gerado
            referral_code_input,  -- Código que foi usado para se referir (variável renomeada)
            5  -- Créditos iniciais
        );
        
        profile_created := TRUE;
        RAISE LOG 'handle_new_user_profile: Perfil criado com sucesso';
        
    EXCEPTION WHEN OTHERS THEN
        RAISE LOG 'handle_new_user_profile: ERRO ao criar perfil - %', SQLERRM;
        RETURN NEW; -- Continua mesmo se falhar
    END;
    
    BEGIN
        -- Inserir assinatura FREE como padrão
        INSERT INTO public.user_subscriptions (user_id, plan, status)
        VALUES (NEW.id, 'free', 'active')
        ON CONFLICT (user_id) DO NOTHING;
        
        RAISE LOG 'handle_new_user_profile: Subscription criada';
        
    EXCEPTION WHEN OTHERS THEN
        RAISE LOG 'handle_new_user_profile: ERRO ao criar subscription - %', SQLERRM;
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
                
                -- Dar pontos de gamificação
                PERFORM public.award_points(NEW.id, 50, 'signup_with_referral');
                PERFORM public.award_points(referrer_id, 25, 'successful_referral');
                
                referral_processed := TRUE;
                RAISE LOG 'handle_new_user_profile: Referral processado com sucesso';
                
            ELSE
                RAISE LOG 'handle_new_user_profile: Referral code inválido: %', referral_code_input;
            END IF;
            
        EXCEPTION WHEN OTHERS THEN
            RAISE LOG 'handle_new_user_profile: ERRO no processamento de referral - %', SQLERRM;
        END;
    END IF;
    
    RAISE LOG 'handle_new_user_profile: Concluído. Profile: %, Referral: %', profile_created, referral_processed;
    
    RETURN NEW;
END;
$$;

-- Garantir que o trigger existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user_profile();

-- Função para testar o sistema completo
CREATE OR REPLACE FUNCTION public.test_complete_signup_system()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
    test_results TEXT := '';
    user_count INTEGER;
    referral_count INTEGER;
    credits_count INTEGER;
BEGIN
    -- Contar usuários com perfis
    SELECT COUNT(*) INTO user_count
    FROM public.user_profiles;
    
    test_results := test_results || 'Total profiles: ' || user_count || E'\n';
    
    -- Contar referrals
    SELECT COUNT(*) INTO referral_count
    FROM public.user_referrals;
    
    test_results := test_results || 'Total referrals: ' || referral_count || E'\n';
    
    -- Contar usuários com créditos
    SELECT COUNT(*) INTO credits_count
    FROM public.user_profiles
    WHERE credits > 0;
    
    test_results := test_results || 'Users with credits: ' || credits_count || E'\n';
    
    -- Verificar trigger
    IF EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name = 'on_auth_user_created' 
        AND event_object_schema = 'auth'
    ) THEN
        test_results := test_results || 'Trigger: ✅ ATIVO' || E'\n';
    ELSE
        test_results := test_results || 'Trigger: ❌ INATIVO' || E'\n';
    END IF;
    
    -- Verificar função
    IF EXISTS (
        SELECT 1 FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE p.proname = 'handle_new_user_profile' 
        AND n.nspname = 'public'
    ) THEN
        test_results := test_results || 'Function: ✅ DISPONÍVEL' || E'\n';
    ELSE
        test_results := test_results || 'Function: ❌ NÃO ENCONTRADA' || E'\n';
    END IF;
    
    RETURN test_results;
END;
$$;
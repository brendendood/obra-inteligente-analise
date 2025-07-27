-- Corrigir função validate_referral_code para resolver ambiguidade de parâmetros
DROP FUNCTION IF EXISTS public.validate_referral_code(text);

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

-- Criar função de teste completo do sistema de referral
CREATE OR REPLACE FUNCTION public.test_complete_referral_system()
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
DECLARE
    test_results jsonb := '{}'::jsonb;
    validation_result jsonb;
    user_count integer;
    trigger_exists boolean;
    function_exists boolean;
BEGIN
    -- 1. Testar validação de código válido
    SELECT public.validate_referral_code('REF_fae0ee4b') INTO validation_result;
    test_results := test_results || jsonb_build_object(
        'validation_test', validation_result
    );
    
    -- 2. Testar validação de código inválido
    SELECT public.validate_referral_code('INVALID_CODE') INTO validation_result;
    test_results := test_results || jsonb_build_object(
        'invalid_validation_test', validation_result
    );
    
    -- 3. Verificar se trigger existe
    SELECT EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name = 'on_auth_user_created' 
        AND event_object_schema = 'auth'
    ) INTO trigger_exists;
    
    test_results := test_results || jsonb_build_object(
        'trigger_exists', trigger_exists
    );
    
    -- 4. Verificar se função handle_new_user_profile existe
    SELECT EXISTS (
        SELECT 1 FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE p.proname = 'handle_new_user_profile' 
        AND n.nspname = 'public'
    ) INTO function_exists;
    
    test_results := test_results || jsonb_build_object(
        'function_exists', function_exists
    );
    
    -- 5. Contar usuários com créditos
    SELECT COUNT(*) INTO user_count
    FROM public.user_profiles
    WHERE credits > 0;
    
    test_results := test_results || jsonb_build_object(
        'users_with_credits', user_count
    );
    
    -- 6. Contar referrals registrados
    SELECT COUNT(*) INTO user_count
    FROM public.user_referrals;
    
    test_results := test_results || jsonb_build_object(
        'total_referrals', user_count
    );
    
    RETURN test_results;
END;
$function$;
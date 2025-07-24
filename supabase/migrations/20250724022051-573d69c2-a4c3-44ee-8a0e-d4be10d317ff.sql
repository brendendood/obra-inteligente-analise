-- Recriar trigger no schema correto (auth.audit_log_entries)
CREATE OR REPLACE TRIGGER on_auth_user_login
    AFTER INSERT ON auth.audit_log_entries
    FOR EACH ROW
    WHEN (NEW.payload ->> 'action' = 'login')
    EXECUTE FUNCTION public.handle_user_login();

-- Testar novamente
DROP FUNCTION IF EXISTS public.test_login_system();
CREATE OR REPLACE FUNCTION public.test_login_system()
RETURNS TEXT
LANGUAGE plpgsql
AS $function$
DECLARE
    trigger_count INTEGER;
    function_count INTEGER;
BEGIN
    -- Verificar trigger
    SELECT COUNT(*) INTO trigger_count
    FROM information_schema.triggers 
    WHERE trigger_name = 'on_auth_user_login' 
    AND event_object_schema = 'auth';
    
    -- Verificar função
    SELECT COUNT(*) INTO function_count
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE p.proname = 'handle_user_login' 
    AND n.nspname = 'public';
    
    IF trigger_count = 0 THEN
        RETURN 'ERRO: Trigger não encontrado no schema auth';
    END IF;
    
    IF function_count = 0 THEN
        RETURN 'ERRO: Função handle_user_login não encontrada';
    END IF;
    
    RETURN 'OK: Sistema de login configurado - Trigger: ' || trigger_count || ', Função: ' || function_count;
END;
$function$;
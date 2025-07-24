-- Verificar e recriar o trigger que faltava para capturar logins
DROP TRIGGER IF EXISTS on_auth_user_login ON auth.audit_log_entries;

CREATE OR REPLACE TRIGGER on_auth_user_login
    AFTER INSERT ON auth.audit_log_entries
    FOR EACH ROW
    WHEN (NEW.payload ->> 'action' IN ('login', 'token_refreshed'))
    EXECUTE FUNCTION public.handle_user_login();

-- Verificar se a função existe
CREATE OR REPLACE FUNCTION public.test_login_system()
RETURNS TEXT
LANGUAGE plpgsql
AS $function$
BEGIN
    -- Verificar se trigger existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name = 'on_auth_user_login'
    ) THEN
        RETURN 'ERRO: Trigger de login não existe';
    END IF;
    
    -- Verificar se função existe
    IF NOT EXISTS (
        SELECT 1 FROM pg_proc 
        WHERE proname = 'handle_user_login'
    ) THEN
        RETURN 'ERRO: Função handle_user_login não existe';
    END IF;
    
    RETURN 'OK: Sistema de login configurado corretamente';
END;
$function$;
-- Corrigir o trigger definitivamente no schema correto
DROP TRIGGER IF EXISTS on_auth_user_login ON auth.audit_log_entries;

-- Verificar se podemos criar trigger no schema auth ou usar alternativa
-- Como pode haver restrições no schema auth, vamos usar uma abordagem mais simples
-- O tracking será feito 100% via frontend no AuthProvider

-- Criar função simplificada para teste manual se necessário
CREATE OR REPLACE FUNCTION public.test_manual_login_tracking(user_email text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
    target_user_id uuid;
    login_id uuid;
BEGIN
    -- Buscar user_id pelo email
    SELECT id INTO target_user_id 
    FROM auth.users 
    WHERE email = user_email;
    
    IF target_user_id IS NULL THEN
        RETURN 'ERRO: Usuário não encontrado';
    END IF;
    
    -- Inserir login manual para teste
    INSERT INTO public.user_login_history (
        user_id, login_at, ip_address, user_agent, device_type, browser, os
    ) VALUES (
        target_user_id, NOW(), '127.0.0.1'::inet, 'Manual Test', 'Desktop', 'Test', 'Test'
    ) RETURNING id INTO login_id;
    
    RETURN 'OK: Login manual inserido com ID ' || login_id;
END;
$function$;
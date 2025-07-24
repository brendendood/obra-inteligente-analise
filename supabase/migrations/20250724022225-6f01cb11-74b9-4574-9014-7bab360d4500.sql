-- O problema pode ser de permissões. Vamos tentar uma abordagem diferente.
-- Usar notification listener em vez de trigger direto no auth schema

-- 1. Limpar tentativas anteriores
DROP TRIGGER IF EXISTS on_auth_user_login ON auth.audit_log_entries;

-- 2. Criar listener de notificação para o AuthProvider
-- (O tracking será feito via frontend com melhor controle)

-- 3. Testar se podemos pelo menos inserir logs manuais
INSERT INTO public.user_login_history (
    user_id,
    login_at,
    ip_address,
    user_agent,
    device_type,
    browser,
    os,
    city,
    region,
    country
) VALUES (
    '6b46fd6c-a0be-47a5-81eb-53ecb7fa9cab'::uuid,
    NOW(),
    '127.0.0.1'::inet,
    'Manual Test',
    'Desktop',
    'Chrome',
    'Windows',
    'Teste',
    'Teste',
    'Brasil'
) 
ON CONFLICT DO NOTHING;

-- 4. Função simplificada para teste
CREATE OR REPLACE FUNCTION public.manual_login_insert(
    p_user_id uuid,
    p_ip_address text DEFAULT '127.0.0.1'
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
    INSERT INTO public.user_login_history (
        user_id,
        login_at,
        ip_address,
        user_agent,
        device_type,
        browser,
        os
    ) VALUES (
        p_user_id,
        NOW(),
        p_ip_address::inet,
        'Manual Insert',
        'Desktop',
        'Manual',
        'Test'
    );
    
    RETURN 'Login inserido com sucesso para user: ' || p_user_id;
EXCEPTION
    WHEN OTHERS THEN
        RETURN 'ERRO: ' || SQLERRM;
END;
$function$;
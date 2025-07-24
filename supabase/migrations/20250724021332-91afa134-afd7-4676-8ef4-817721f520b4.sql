-- 1. Recriar o trigger que estava faltando
DROP TRIGGER IF EXISTS on_auth_user_login ON auth.audit_log_entries;

-- 2. Criar trigger para capturar logins
CREATE OR REPLACE TRIGGER on_auth_user_login
    AFTER INSERT ON auth.audit_log_entries
    FOR EACH ROW
    WHEN (NEW.payload ->> 'action' IN ('login', 'token_refreshed'))
    EXECUTE FUNCTION public.handle_user_login();

-- 3. Corrigir a função handle_user_login para melhor logging
CREATE OR REPLACE FUNCTION public.handle_user_login()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    user_ip inet;
    login_record_id uuid;
    real_ip_address text;
    target_user_id uuid;
BEGIN
    -- Extrair user_id do payload
    target_user_id := (NEW.payload ->> 'user_id')::uuid;
    
    IF target_user_id IS NULL THEN
        RETURN NEW;
    END IF;
    
    -- Extrair IP real dos headers (prioridade para x-forwarded-for)
    real_ip_address := COALESCE(
        NEW.payload ->> 'x-forwarded-for',
        NEW.payload ->> 'x-real-ip', 
        NEW.payload ->> 'cf-connecting-ip',
        NEW.payload ->> 'ip',
        NEW.ip_address::text,
        '127.0.0.1'
    );
    
    -- Se for uma lista de IPs (x-forwarded-for), pegar o primeiro
    IF real_ip_address ~ ',' THEN
        real_ip_address := split_part(real_ip_address, ',', 1);
    END IF;
    
    -- Limpar espaços em branco
    real_ip_address := trim(real_ip_address);
    
    -- Converter para inet
    user_ip := COALESCE(real_ip_address::inet, '127.0.0.1'::inet);

    -- Inserir dados de login na tabela user_login_history
    INSERT INTO public.user_login_history (
        user_id,
        login_at,
        ip_address,
        user_agent,
        device_type,
        browser,
        os
    ) VALUES (
        target_user_id,
        NEW.created_at,
        user_ip,
        COALESCE(NEW.payload ->> 'user_agent', 'Unknown'),
        CASE 
            WHEN NEW.payload ->> 'user_agent' ILIKE '%mobile%' OR NEW.payload ->> 'user_agent' ILIKE '%android%' OR NEW.payload ->> 'user_agent' ILIKE '%iphone%' THEN 'Mobile'
            WHEN NEW.payload ->> 'user_agent' ILIKE '%tablet%' OR NEW.payload ->> 'user_agent' ILIKE '%ipad%' THEN 'Tablet'
            ELSE 'Desktop'
        END,
        CASE 
            WHEN NEW.payload ->> 'user_agent' ILIKE '%chrome%' THEN 'Chrome'
            WHEN NEW.payload ->> 'user_agent' ILIKE '%firefox%' THEN 'Firefox'
            WHEN NEW.payload ->> 'user_agent' ILIKE '%safari%' THEN 'Safari'
            WHEN NEW.payload ->> 'user_agent' ILIKE '%edge%' THEN 'Edge'
            ELSE 'Other'
        END,
        CASE 
            WHEN NEW.payload ->> 'user_agent' ILIKE '%windows%' THEN 'Windows'
            WHEN NEW.payload ->> 'user_agent' ILIKE '%mac%' THEN 'macOS'
            WHEN NEW.payload ->> 'user_agent' ILIKE '%linux%' THEN 'Linux'
            WHEN NEW.payload ->> 'user_agent' ILIKE '%android%' THEN 'Android'
            WHEN NEW.payload ->> 'user_agent' ILIKE '%ios%' THEN 'iOS'
            ELSE 'Other'
        END
    ) RETURNING id INTO login_record_id;

    -- Chamar edge function para capturar geolocalização real (async)
    PERFORM pg_notify('new_login_geolocation', json_build_object(
        'login_id', login_record_id,
        'ip_address', real_ip_address,
        'user_id', target_user_id
    )::text);
    
    RETURN NEW;
END;
$function$;

-- 4. Criar função para forçar atualização de geolocalização
CREATE OR REPLACE FUNCTION public.force_user_geolocation_update(user_email text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
    target_user_id uuid;
    latest_login_record record;
    result json;
BEGIN
    -- Buscar user_id pelo email
    SELECT id INTO target_user_id 
    FROM auth.users 
    WHERE email = user_email;
    
    IF target_user_id IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'Usuário não encontrado');
    END IF;
    
    -- Buscar último login do usuário
    SELECT * INTO latest_login_record
    FROM public.user_login_history
    WHERE user_id = target_user_id
    ORDER BY login_at DESC
    LIMIT 1;
    
    IF latest_login_record IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'Nenhum login encontrado');
    END IF;
    
    -- Forçar captura de geolocalização
    PERFORM pg_notify('force_geolocation_update', json_build_object(
        'login_id', latest_login_record.id,
        'ip_address', latest_login_record.ip_address::text,
        'user_id', target_user_id
    )::text);
    
    RETURN json_build_object(
        'success', true, 
        'login_id', latest_login_record.id,
        'ip_address', latest_login_record.ip_address::text
    );
END;
$function$;

-- 5. Grant de execução das funções
GRANT EXECUTE ON FUNCTION public.force_user_geolocation_update(text) TO authenticated;
-- FASE 1: CORREÇÃO URGENTE DO SISTEMA DE CAPTURA DE LOGIN

-- 1. Criar função melhorada para capturar logins dos audit logs
CREATE OR REPLACE FUNCTION public.handle_user_login_from_audit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    target_user_id uuid;
    user_ip inet;
    real_ip_address text;
    login_record_id uuid;
    event_data jsonb;
BEGIN
    -- Só processar eventos de login bem-sucedidos
    IF NEW.event_name != 'login' OR NEW.error_message IS NOT NULL THEN
        RETURN NEW;
    END IF;
    
    -- Extrair user_id dos dados do evento
    event_data := NEW.payload;
    target_user_id := (event_data ->> 'user_id')::uuid;
    
    IF target_user_id IS NULL THEN
        RETURN NEW;
    END IF;
    
    -- Extrair IP real dos metadados de request
    real_ip_address := COALESCE(
        event_data -> 'request' ->> 'x-forwarded-for',
        event_data -> 'request' ->> 'x-real-ip',
        event_data -> 'request' ->> 'cf-connecting-ip',
        event_data ->> 'ip_address',
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
    
    RAISE LOG 'AUDIT LOGIN: user_id=%, ip=%, timestamp=%', target_user_id, real_ip_address, NEW.created_at;

    -- Inserir dados de login na tabela user_login_history
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
        target_user_id,
        NEW.created_at,
        user_ip,
        COALESCE(event_data -> 'request' ->> 'user_agent', 'Unknown'),
        CASE 
            WHEN event_data -> 'request' ->> 'user_agent' ILIKE '%mobile%' OR event_data -> 'request' ->> 'user_agent' ILIKE '%android%' OR event_data -> 'request' ->> 'user_agent' ILIKE '%iphone%' THEN 'Mobile'
            WHEN event_data -> 'request' ->> 'user_agent' ILIKE '%tablet%' OR event_data -> 'request' ->> 'user_agent' ILIKE '%ipad%' THEN 'Tablet'
            ELSE 'Desktop'
        END,
        CASE 
            WHEN event_data -> 'request' ->> 'user_agent' ILIKE '%chrome%' THEN 'Chrome'
            WHEN event_data -> 'request' ->> 'user_agent' ILIKE '%firefox%' THEN 'Firefox'
            WHEN event_data -> 'request' ->> 'user_agent' ILIKE '%safari%' THEN 'Safari'
            WHEN event_data -> 'request' ->> 'user_agent' ILIKE '%edge%' THEN 'Edge'
            ELSE 'Other'
        END,
        CASE 
            WHEN event_data -> 'request' ->> 'user_agent' ILIKE '%windows%' THEN 'Windows'
            WHEN event_data -> 'request' ->> 'user_agent' ILIKE '%mac%' THEN 'macOS'
            WHEN event_data -> 'request' ->> 'user_agent' ILIKE '%linux%' THEN 'Linux'
            WHEN event_data -> 'request' ->> 'user_agent' ILIKE '%android%' THEN 'Android'
            WHEN event_data -> 'request' ->> 'user_agent' ILIKE '%ios%' THEN 'iOS'
            ELSE 'Other'
        END,
        -- Inicializar com null - será preenchido pela edge function
        NULL,
        NULL,
        NULL
    ) RETURNING id INTO login_record_id;

    -- Disparar edge function para capturar geolocalização
    PERFORM pg_notify('real_geolocation_capture', json_build_object(
        'login_id', login_record_id,
        'ip_address', real_ip_address,
        'user_id', target_user_id,
        'timestamp', NEW.created_at
    )::text);
    
    RAISE LOG 'AUDIT LOGIN: Registro criado com ID=%, geolocalização solicitada', login_record_id;
    
    RETURN NEW;
END;
$function$;

-- 2. Criar trigger nos audit logs para capturar logins
DROP TRIGGER IF EXISTS on_auth_audit_login ON auth.audit_log_entries;
CREATE TRIGGER on_auth_audit_login
    AFTER INSERT ON auth.audit_log_entries
    FOR EACH ROW
    WHEN (NEW.event_name = 'login' AND NEW.error_message IS NULL)
    EXECUTE FUNCTION public.handle_user_login_from_audit();

-- FASE 2: RECUPERAÇÃO DE DADOS HISTÓRICOS

-- 3. Função para processar logins históricos
CREATE OR REPLACE FUNCTION public.recover_historical_logins()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    processed_count INTEGER := 0;
    login_record RECORD;
    login_record_id uuid;
    real_ip_address text;
    user_ip inet;
BEGIN
    RAISE LOG 'RECOVERY: Iniciando recuperação de logins históricos...';
    
    -- Processar todos os logins históricos dos audit logs
    FOR login_record IN 
        SELECT 
            ale.id,
            ale.created_at,
            ale.payload,
            ale.ip_address,
            (ale.payload ->> 'user_id')::uuid as user_id
        FROM auth.audit_log_entries ale
        WHERE ale.event_name = 'login' 
        AND ale.error_message IS NULL
        AND (ale.payload ->> 'user_id')::uuid IS NOT NULL
        AND NOT EXISTS (
            SELECT 1 FROM public.user_login_history ulh 
            WHERE ulh.user_id = (ale.payload ->> 'user_id')::uuid 
            AND ulh.login_at = ale.created_at
        )
        ORDER BY ale.created_at DESC
    LOOP
        -- Extrair IP real
        real_ip_address := COALESCE(
            login_record.payload -> 'request' ->> 'x-forwarded-for',
            login_record.payload -> 'request' ->> 'x-real-ip',
            login_record.payload -> 'request' ->> 'cf-connecting-ip',
            login_record.payload ->> 'ip_address',
            login_record.ip_address::text,
            '127.0.0.1'
        );
        
        -- Se for uma lista de IPs, pegar o primeiro
        IF real_ip_address ~ ',' THEN
            real_ip_address := split_part(real_ip_address, ',', 1);
        END IF;
        
        real_ip_address := trim(real_ip_address);
        user_ip := COALESCE(real_ip_address::inet, '127.0.0.1'::inet);
        
        -- Inserir registro histórico
        INSERT INTO public.user_login_history (
            user_id,
            login_at,
            ip_address,
            user_agent,
            device_type,
            browser,
            os
        ) VALUES (
            login_record.user_id,
            login_record.created_at,
            user_ip,
            COALESCE(login_record.payload -> 'request' ->> 'user_agent', 'Historical Recovery'),
            CASE 
                WHEN login_record.payload -> 'request' ->> 'user_agent' ILIKE '%mobile%' THEN 'Mobile'
                WHEN login_record.payload -> 'request' ->> 'user_agent' ILIKE '%tablet%' THEN 'Tablet'
                ELSE 'Desktop'
            END,
            CASE 
                WHEN login_record.payload -> 'request' ->> 'user_agent' ILIKE '%chrome%' THEN 'Chrome'
                WHEN login_record.payload -> 'request' ->> 'user_agent' ILIKE '%firefox%' THEN 'Firefox'
                WHEN login_record.payload -> 'request' ->> 'user_agent' ILIKE '%safari%' THEN 'Safari'
                ELSE 'Other'
            END,
            CASE 
                WHEN login_record.payload -> 'request' ->> 'user_agent' ILIKE '%windows%' THEN 'Windows'
                WHEN login_record.payload -> 'request' ->> 'user_agent' ILIKE '%mac%' THEN 'macOS'
                WHEN login_record.payload -> 'request' ->> 'user_agent' ILIKE '%linux%' THEN 'Linux'
                ELSE 'Other'
            END
        ) RETURNING id INTO login_record_id;
        
        -- Disparar captura de geolocalização para login histórico
        PERFORM pg_notify('real_geolocation_capture', json_build_object(
            'login_id', login_record_id,
            'ip_address', real_ip_address,
            'user_id', login_record.user_id,
            'timestamp', login_record.created_at,
            'historical', true
        )::text);
        
        processed_count := processed_count + 1;
        
        RAISE LOG 'RECOVERY: Processado login user_id=%, timestamp=%, ip=%', 
            login_record.user_id, login_record.created_at, real_ip_address;
    END LOOP;
    
    RETURN format('Recuperação concluída: %s logins históricos processados e geolocalização solicitada', processed_count);
END;
$function$;

-- FASE 3: REMOVER TRIGGER ANTIGO E OTIMIZAR SISTEMA

-- 4. Remover trigger antigo que não funcionava
DROP TRIGGER IF EXISTS on_auth_user_login ON auth.audit_log_entries;

-- 5. Função para forçar atualização de geolocalização em lote
CREATE OR REPLACE FUNCTION public.force_all_geolocations_update()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    update_count INTEGER := 0;
    login_record RECORD;
BEGIN
    RAISE LOG 'BATCH GEOLOCATION: Forçando atualização em lote...';
    
    -- Para cada login sem geolocalização, forçar captura
    FOR login_record IN 
        SELECT id, user_id, ip_address, login_at
        FROM public.user_login_history 
        WHERE (city IS NULL OR country IS NULL)
        AND ip_address IS NOT NULL
        AND ip_address != '127.0.0.1'::inet
        ORDER BY login_at DESC
    LOOP
        -- Disparar captura de geolocalização
        PERFORM pg_notify('real_geolocation_capture', json_build_object(
            'login_id', login_record.id,
            'ip_address', login_record.ip_address::text,
            'user_id', login_record.user_id,
            'timestamp', login_record.login_at,
            'batch_update', true
        )::text);
        
        update_count := update_count + 1;
    END LOOP;
    
    RETURN format('Solicitada atualização de geolocalização para %s logins', update_count);
END;
$function$;

-- EXECUTAR RECUPERAÇÃO IMEDIATA
SELECT public.recover_historical_logins();

-- EXECUTAR ATUALIZAÇÃO EM LOTE DE GEOLOCALIZAÇÕES
SELECT public.force_all_geolocations_update();
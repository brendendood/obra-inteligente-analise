-- CORREÇÃO: Verificar estrutura da tabela auth.audit_log_entries
-- e corrigir o trigger baseado na estrutura real

-- 1. Primeiro, vamos criar uma função que funciona com a estrutura real da tabela
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
    -- Verificar se é um evento de login baseado no payload
    event_data := NEW.payload;
    
    -- Verificar se é evento de login (pode estar em event_name, type, ou dentro do payload)
    IF NOT (
        (event_data ->> 'event_name' = 'login') OR 
        (event_data ->> 'type' = 'login') OR
        (event_data ->> 'action' = 'login') OR
        (NEW.instance_id IS NOT NULL AND event_data ? 'user_id')
    ) THEN
        RETURN NEW;
    END IF;
    
    -- Extrair user_id dos dados do evento
    target_user_id := (event_data ->> 'user_id')::uuid;
    
    IF target_user_id IS NULL THEN
        RETURN NEW;
    END IF;
    
    -- Verificar se já existe um registro para este login (evitar duplicatas)
    IF EXISTS (
        SELECT 1 FROM public.user_login_history 
        WHERE user_id = target_user_id 
        AND login_at = NEW.created_at
    ) THEN
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
    
    RAISE LOG 'AUDIT LOGIN FIXED: user_id=%, ip=%, timestamp=%', target_user_id, real_ip_address, NEW.created_at;

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
        COALESCE(event_data -> 'request' ->> 'user_agent', event_data ->> 'user_agent', 'Unknown'),
        CASE 
            WHEN COALESCE(event_data -> 'request' ->> 'user_agent', event_data ->> 'user_agent') ILIKE '%mobile%' OR 
                 COALESCE(event_data -> 'request' ->> 'user_agent', event_data ->> 'user_agent') ILIKE '%android%' OR 
                 COALESCE(event_data -> 'request' ->> 'user_agent', event_data ->> 'user_agent') ILIKE '%iphone%' THEN 'Mobile'
            WHEN COALESCE(event_data -> 'request' ->> 'user_agent', event_data ->> 'user_agent') ILIKE '%tablet%' OR 
                 COALESCE(event_data -> 'request' ->> 'user_agent', event_data ->> 'user_agent') ILIKE '%ipad%' THEN 'Tablet'
            ELSE 'Desktop'
        END,
        CASE 
            WHEN COALESCE(event_data -> 'request' ->> 'user_agent', event_data ->> 'user_agent') ILIKE '%chrome%' THEN 'Chrome'
            WHEN COALESCE(event_data -> 'request' ->> 'user_agent', event_data ->> 'user_agent') ILIKE '%firefox%' THEN 'Firefox'
            WHEN COALESCE(event_data -> 'request' ->> 'user_agent', event_data ->> 'user_agent') ILIKE '%safari%' THEN 'Safari'
            WHEN COALESCE(event_data -> 'request' ->> 'user_agent', event_data ->> 'user_agent') ILIKE '%edge%' THEN 'Edge'
            ELSE 'Other'
        END,
        CASE 
            WHEN COALESCE(event_data -> 'request' ->> 'user_agent', event_data ->> 'user_agent') ILIKE '%windows%' THEN 'Windows'
            WHEN COALESCE(event_data -> 'request' ->> 'user_agent', event_data ->> 'user_agent') ILIKE '%mac%' THEN 'macOS'
            WHEN COALESCE(event_data -> 'request' ->> 'user_agent', event_data ->> 'user_agent') ILIKE '%linux%' THEN 'Linux'
            WHEN COALESCE(event_data -> 'request' ->> 'user_agent', event_data ->> 'user_agent') ILIKE '%android%' THEN 'Android'
            WHEN COALESCE(event_data -> 'request' ->> 'user_agent', event_data ->> 'user_agent') ILIKE '%ios%' THEN 'iOS'
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
    
    RAISE LOG 'AUDIT LOGIN FIXED: Registro criado com ID=%, geolocalização solicitada', login_record_id;
    
    RETURN NEW;
END;
$function$;

-- 2. Criar trigger nos audit logs SEM condição WHERE (já que não sabemos a estrutura exata)
DROP TRIGGER IF EXISTS on_auth_audit_login ON auth.audit_log_entries;
CREATE TRIGGER on_auth_audit_login
    AFTER INSERT ON auth.audit_log_entries
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_user_login_from_audit();

-- 3. Função para processar logins históricos CORRIGIDA
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
    RAISE LOG 'RECOVERY FIXED: Iniciando recuperação de logins históricos...';
    
    -- Processar todos os registros de audit que podem ser logins
    FOR login_record IN 
        SELECT 
            ale.id,
            ale.created_at,
            ale.payload,
            ale.ip_address,
            (ale.payload ->> 'user_id')::uuid as user_id
        FROM auth.audit_log_entries ale
        WHERE (ale.payload ->> 'user_id')::uuid IS NOT NULL
        AND (
            (ale.payload ->> 'event_name' = 'login') OR
            (ale.payload ->> 'type' = 'login') OR
            (ale.payload ->> 'action' = 'login') OR
            (ale.payload ? 'session')
        )
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
            COALESCE(
                login_record.payload -> 'request' ->> 'user_agent', 
                login_record.payload ->> 'user_agent', 
                'Historical Recovery'
            ),
            CASE 
                WHEN COALESCE(login_record.payload -> 'request' ->> 'user_agent', login_record.payload ->> 'user_agent') ILIKE '%mobile%' THEN 'Mobile'
                WHEN COALESCE(login_record.payload -> 'request' ->> 'user_agent', login_record.payload ->> 'user_agent') ILIKE '%tablet%' THEN 'Tablet'
                ELSE 'Desktop'
            END,
            CASE 
                WHEN COALESCE(login_record.payload -> 'request' ->> 'user_agent', login_record.payload ->> 'user_agent') ILIKE '%chrome%' THEN 'Chrome'
                WHEN COALESCE(login_record.payload -> 'request' ->> 'user_agent', login_record.payload ->> 'user_agent') ILIKE '%firefox%' THEN 'Firefox'
                WHEN COALESCE(login_record.payload -> 'request' ->> 'user_agent', login_record.payload ->> 'user_agent') ILIKE '%safari%' THEN 'Safari'
                ELSE 'Other'
            END,
            CASE 
                WHEN COALESCE(login_record.payload -> 'request' ->> 'user_agent', login_record.payload ->> 'user_agent') ILIKE '%windows%' THEN 'Windows'
                WHEN COALESCE(login_record.payload -> 'request' ->> 'user_agent', login_record.payload ->> 'user_agent') ILIKE '%mac%' THEN 'macOS'
                WHEN COALESCE(login_record.payload -> 'request' ->> 'user_agent', login_record.payload ->> 'user_agent') ILIKE '%linux%' THEN 'Linux'
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
        
        RAISE LOG 'RECOVERY FIXED: Processado login user_id=%, timestamp=%, ip=%', 
            login_record.user_id, login_record.created_at, real_ip_address;
    END LOOP;
    
    RETURN format('Recuperação CORRIGIDA concluída: %s logins históricos processados e geolocalização solicitada', processed_count);
END;
$function$;

-- 4. Função para forçar atualização de geolocalização em lote
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
    RAISE LOG 'BATCH GEOLOCATION FIXED: Forçando atualização em lote...';
    
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
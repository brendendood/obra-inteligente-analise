-- CORREÇÃO FINAL: Função simplificada que funciona com qualquer estrutura de audit log

-- 1. Função corrigida para trabalhar com payload tipo json
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
    event_data json;
BEGIN
    -- Converter payload para json se necessário
    event_data := NEW.payload;
    
    -- Extrair user_id dos dados do evento
    target_user_id := (event_data->>'user_id')::uuid;
    
    -- Se não tem user_id, não é um login válido
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
    
    -- Extrair IP real
    real_ip_address := COALESCE(
        NEW.ip_address::text,
        '127.0.0.1'
    );
    
    -- Limpar espaços em branco
    real_ip_address := trim(real_ip_address);
    
    -- Converter para inet
    user_ip := COALESCE(real_ip_address::inet, '127.0.0.1'::inet);
    
    RAISE LOG 'AUDIT LOGIN SIMPLIFIED: user_id=%, ip=%, timestamp=%', target_user_id, real_ip_address, NEW.created_at;

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
        'Audit Log Capture',
        'Desktop',
        'Unknown',
        'Unknown'
    ) RETURNING id INTO login_record_id;

    -- Disparar edge function para capturar geolocalização
    PERFORM pg_notify('real_geolocation_capture', json_build_object(
        'login_id', login_record_id,
        'ip_address', real_ip_address,
        'user_id', target_user_id,
        'timestamp', NEW.created_at
    )::text);
    
    RAISE LOG 'AUDIT LOGIN SIMPLIFIED: Registro criado com ID=%, geolocalização solicitada', login_record_id;
    
    RETURN NEW;
END;
$function$;

-- 2. Função de recuperação simplificada
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
    RAISE LOG 'RECOVERY SIMPLIFIED: Iniciando recuperação de logins históricos...';
    
    -- Processar todos os registros de audit que têm user_id
    FOR login_record IN 
        SELECT 
            ale.id,
            ale.created_at,
            ale.payload,
            ale.ip_address,
            (ale.payload->>'user_id')::uuid as user_id
        FROM auth.audit_log_entries ale
        WHERE (ale.payload->>'user_id')::uuid IS NOT NULL
        AND NOT EXISTS (
            SELECT 1 FROM public.user_login_history ulh 
            WHERE ulh.user_id = (ale.payload->>'user_id')::uuid 
            AND ulh.login_at = ale.created_at
        )
        ORDER BY ale.created_at DESC
    LOOP
        -- Usar IP do audit log
        real_ip_address := COALESCE(
            login_record.ip_address::text,
            '127.0.0.1'
        );
        
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
            'Historical Recovery',
            'Desktop',
            'Unknown',
            'Unknown'
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
        
        RAISE LOG 'RECOVERY SIMPLIFIED: Processado login user_id=%, timestamp=%, ip=%', 
            login_record.user_id, login_record.created_at, real_ip_address;
    END LOOP;
    
    RETURN format('Recuperação SIMPLIFICADA concluída: %s logins históricos processados', processed_count);
END;
$function$;

-- EXECUTAR RECUPERAÇÃO IMEDIATA
SELECT public.recover_historical_logins();

-- EXECUTAR ATUALIZAÇÃO EM LOTE DE GEOLOCALIZAÇÕES  
SELECT public.force_all_geolocations_update();
-- Atualizar função de handle_user_login para usar geolocalização mais precisa
CREATE OR REPLACE FUNCTION public.handle_user_login()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
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
        os,
        city,
        region,
        country
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
        END,
        -- Inicializar com null - será preenchido pela edge function
        NULL,
        NULL,
        NULL
    ) RETURNING id INTO login_record_id;

    -- Chamar edge function ATUALIZADA para capturar geolocalização REAL
    PERFORM pg_notify('real_geolocation_capture', json_build_object(
        'login_id', login_record_id,
        'ip_address', real_ip_address,
        'user_id', target_user_id,
        'timestamp', NEW.created_at
    )::text);
    
    RETURN NEW;
END;
$$;
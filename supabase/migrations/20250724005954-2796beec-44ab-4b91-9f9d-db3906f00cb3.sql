-- Atualizar função handle_user_login para chamar geolocalização automaticamente
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
BEGIN
    -- Extrair IP real dos headers (prioridade para x-forwarded-for)
    real_ip_address := COALESCE(
        NEW.data->>'x-forwarded-for',
        NEW.data->>'x-real-ip', 
        NEW.data->>'cf-connecting-ip',
        NEW.data->>'ip',
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
        NEW.user_id,
        NEW.created_at,
        user_ip,
        COALESCE(NEW.data->>'user_agent', 'Unknown'),
        CASE 
            WHEN NEW.data->>'user_agent' ILIKE '%mobile%' OR NEW.data->>'user_agent' ILIKE '%android%' OR NEW.data->>'user_agent' ILIKE '%iphone%' THEN 'Mobile'
            WHEN NEW.data->>'user_agent' ILIKE '%tablet%' OR NEW.data->>'user_agent' ILIKE '%ipad%' THEN 'Tablet'
            ELSE 'Desktop'
        END,
        CASE 
            WHEN NEW.data->>'user_agent' ILIKE '%chrome%' THEN 'Chrome'
            WHEN NEW.data->>'user_agent' ILIKE '%firefox%' THEN 'Firefox'
            WHEN NEW.data->>'user_agent' ILIKE '%safari%' THEN 'Safari'
            WHEN NEW.data->>'user_agent' ILIKE '%edge%' THEN 'Edge'
            ELSE 'Other'
        END,
        CASE 
            WHEN NEW.data->>'user_agent' ILIKE '%windows%' THEN 'Windows'
            WHEN NEW.data->>'user_agent' ILIKE '%mac%' THEN 'macOS'
            WHEN NEW.data->>'user_agent' ILIKE '%linux%' THEN 'Linux'
            WHEN NEW.data->>'user_agent' ILIKE '%android%' THEN 'Android'
            WHEN NEW.data->>'user_agent' ILIKE '%ios%' THEN 'iOS'
            ELSE 'Other'
        END
    ) RETURNING id INTO login_record_id;

    -- Chamar edge function para capturar geolocalização real (async)
    -- Usar pg_notify para trigger assíncrono da geolocalização
    PERFORM pg_notify('new_login_geolocation', json_build_object(
        'login_id', login_record_id,
        'ip_address', real_ip_address,
        'user_id', NEW.user_id
    )::text);
    
    RETURN NEW;
END;
$$;
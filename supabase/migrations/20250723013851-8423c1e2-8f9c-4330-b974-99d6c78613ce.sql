-- Atualizar trigger para capturar IP real do usuário
CREATE OR REPLACE FUNCTION public.handle_user_login()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    user_ip inet;
BEGIN
    -- Tentar extrair IP real dos headers ou usar o IP da sessão
    user_ip := COALESCE(
        (NEW.data->>'ip')::inet,
        '127.0.0.1'::inet
    );

    -- Inserir dados reais de login na tabela user_login_history
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
    );
    
    RETURN NEW;
END;
$$;

-- Função para atualizar localização baseada no IP (será chamada pelo Edge Function)
CREATE OR REPLACE FUNCTION public.update_login_location_by_ip(
    login_id uuid,
    ip_address text,
    city_name text,
    region_name text,
    country_name text,
    lat numeric DEFAULT NULL,
    lng numeric DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.user_login_history 
    SET 
        latitude = lat,
        longitude = lng,
        city = city_name,
        region = region_name,
        country = country_name
    WHERE id = login_id;
END;
$$;
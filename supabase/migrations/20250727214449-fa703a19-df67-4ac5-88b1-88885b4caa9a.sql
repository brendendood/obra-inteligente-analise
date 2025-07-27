-- Função para limpar dados de geolocalização imprecisos e forçar nova captura
CREATE OR REPLACE FUNCTION public.force_geolocation_refresh()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
    cleaned_count INTEGER := 0;
    user_record RECORD;
BEGIN
    -- Limpar localizações genéricas ou imprecisas
    UPDATE public.user_login_history 
    SET 
        city = NULL,
        region = NULL,
        country = NULL,
        latitude = NULL,
        longitude = NULL
    WHERE 
        -- Remover dados genéricos
        (country = 'Brasil' AND city IS NULL) OR
        (country = 'Brazil' AND city IS NULL) OR
        (city = 'Teste') OR
        (region = 'Teste') OR
        (latitude = 0 AND longitude = 0) OR
        (ip_address = '127.0.0.1'::inet);
    
    GET DIAGNOSTICS cleaned_count = ROW_COUNT;
    
    -- Também limpar perfis com dados genéricos
    UPDATE public.user_profiles 
    SET 
        city = NULL,
        state = NULL,
        country = 'Brasil' -- Manter padrão apenas para o país
    WHERE 
        (country = 'Brasil' AND city IS NULL) OR
        (city = 'Teste') OR
        (state = 'Teste');
    
    -- Para cada usuário ativo, disparar nova captura de geolocalização
    FOR user_record IN 
        SELECT DISTINCT user_id 
        FROM public.user_login_history 
        WHERE login_at >= NOW() - INTERVAL '30 days'
        AND ip_address != '127.0.0.1'::inet
        AND (city IS NULL OR country IS NULL)
        ORDER BY user_id
    LOOP
        -- Disparar nova captura via edge function
        PERFORM pg_notify('force_geolocation_update', json_build_object(
            'user_id', user_record.user_id,
            'action', 'refresh_location',
            'reason', 'admin_cleanup'
        )::text);
    END LOOP;
    
    RETURN 'Limpeza concluída: ' || cleaned_count || ' registros de geolocalização imprecisos foram limpos e nova captura foi solicitada para usuários ativos.';
END;
$$;
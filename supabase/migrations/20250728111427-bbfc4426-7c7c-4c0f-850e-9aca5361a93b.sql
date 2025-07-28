-- FASE 1: Reset Total da Geolocalização
-- Limpar todos os dados de geolocalização imprecisos

-- Criar função para detectar e limpar dados genéricos
CREATE OR REPLACE FUNCTION public.reset_all_geolocation_data()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    cleaned_login_count INTEGER := 0;
    cleaned_profile_count INTEGER := 0;
    removed_invalid_ips INTEGER := 0;
BEGIN
    -- Limpar dados de geolocalização em user_login_history
    UPDATE public.user_login_history 
    SET 
        city = NULL,
        region = NULL,
        country = NULL,
        latitude = NULL,
        longitude = NULL
    WHERE 
        -- Remover dados genéricos ou imprecisos
        city IN ('Unknown', 'Teste', 'Test', 'Local', 'Private') OR
        region IN ('Unknown', 'Teste', 'Test', 'Local', 'Private') OR
        country IN ('Unknown', 'Teste', 'Test', 'Local', 'Private') OR
        (latitude = 0 AND longitude = 0) OR
        latitude IS NULL OR
        longitude IS NULL OR
        city IS NULL OR
        region IS NULL OR
        country IS NULL;
    
    GET DIAGNOSTICS cleaned_login_count = ROW_COUNT;
    
    -- Remover registros com IPs locais/inválidos
    DELETE FROM public.user_login_history 
    WHERE 
        ip_address IN ('127.0.0.1'::inet, '::1'::inet) OR
        -- IPs privados classe A (10.x.x.x)
        ip_address <<= '10.0.0.0/8'::inet OR
        -- IPs privados classe B (172.16.x.x - 172.31.x.x)
        ip_address <<= '172.16.0.0/12'::inet OR
        -- IPs privados classe C (192.168.x.x)
        ip_address <<= '192.168.0.0/16'::inet OR
        -- IPs de link-local
        ip_address <<= '169.254.0.0/16'::inet OR
        -- IPs multicast
        ip_address <<= '224.0.0.0/4'::inet;
    
    GET DIAGNOSTICS removed_invalid_ips = ROW_COUNT;
    
    -- Limpar dados de geolocalização em user_profiles (manter apenas Brasil como padrão)
    UPDATE public.user_profiles 
    SET 
        city = NULL,
        state = NULL,
        country = 'Brasil'
    WHERE 
        city IN ('Unknown', 'Teste', 'Test', 'Local', 'Private') OR
        state IN ('Unknown', 'Teste', 'Test', 'Local', 'Private') OR
        city IS NULL OR
        state IS NULL OR
        country != 'Brasil';
    
    GET DIAGNOSTICS cleaned_profile_count = ROW_COUNT;
    
    RETURN format(
        'Reset completo realizado: %s registros de login limpos, %s perfis atualizados, %s IPs inválidos removidos',
        cleaned_login_count, 
        cleaned_profile_count, 
        removed_invalid_ips
    );
END;
$function$;

-- Criar função para validar qualidade dos dados de geolocalização
CREATE OR REPLACE FUNCTION public.validate_geolocation_quality(
    p_city text,
    p_region text,
    p_country text,
    p_latitude numeric,
    p_longitude numeric
) RETURNS boolean
LANGUAGE plpgsql
AS $function$
BEGIN
    -- Verificar se todos os campos obrigatórios estão preenchidos
    IF p_city IS NULL OR p_region IS NULL OR p_country IS NULL THEN
        RETURN false;
    END IF;
    
    -- Verificar se não são dados genéricos
    IF p_city IN ('Unknown', 'Teste', 'Test', 'Local', 'Private', 'N/A', '-') THEN
        RETURN false;
    END IF;
    
    IF p_region IN ('Unknown', 'Teste', 'Test', 'Local', 'Private', 'N/A', '-') THEN
        RETURN false;
    END IF;
    
    IF p_country IN ('Unknown', 'Teste', 'Test', 'Local', 'Private', 'N/A', '-') THEN
        RETURN false;
    END IF;
    
    -- Verificar coordenadas válidas
    IF p_latitude IS NOT NULL AND p_longitude IS NOT NULL THEN
        -- Verificar se não são coordenadas (0,0) ou fora dos limites válidos
        IF (p_latitude = 0 AND p_longitude = 0) OR
           p_latitude < -90 OR p_latitude > 90 OR
           p_longitude < -180 OR p_longitude > 180 THEN
            RETURN false;
        END IF;
    END IF;
    
    RETURN true;
END;
$function$;

-- Função para monitoramento de qualidade dos dados
CREATE OR REPLACE FUNCTION public.get_geolocation_quality_report()
RETURNS TABLE(
    metric text,
    count bigint,
    percentage numeric
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $function$
    WITH stats AS (
        SELECT 
            COUNT(*) as total_logins,
            COUNT(CASE WHEN city IS NOT NULL AND region IS NOT NULL AND country IS NOT NULL THEN 1 END) as complete_location,
            COUNT(CASE WHEN latitude IS NOT NULL AND longitude IS NOT NULL THEN 1 END) as has_coordinates,
            COUNT(CASE WHEN public.validate_geolocation_quality(city, region, country, latitude, longitude) THEN 1 END) as high_quality
        FROM public.user_login_history
        WHERE login_at >= NOW() - INTERVAL '30 days'
    )
    SELECT 'Total de Logins (30 dias)' as metric, total_logins as count, 100.0 as percentage FROM stats
    UNION ALL
    SELECT 'Logins com Localização Completa' as metric, complete_location as count, 
           CASE WHEN total_logins > 0 THEN ROUND((complete_location::numeric / total_logins::numeric) * 100, 2) ELSE 0 END as percentage FROM stats
    UNION ALL
    SELECT 'Logins com Coordenadas' as metric, has_coordinates as count,
           CASE WHEN total_logins > 0 THEN ROUND((has_coordinates::numeric / total_logins::numeric) * 100, 2) ELSE 0 END as percentage FROM stats
    UNION ALL
    SELECT 'Logins com Alta Qualidade' as metric, high_quality as count,
           CASE WHEN total_logins > 0 THEN ROUND((high_quality::numeric / total_logins::numeric) * 100, 2) ELSE 0 END as percentage FROM stats;
$function$;

-- Executar reset imediato
SELECT public.reset_all_geolocation_data();
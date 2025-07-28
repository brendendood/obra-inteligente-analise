-- IMPLEMENTAÇÃO FINAL COMPLETA DO SISTEMA DE LOGIN E GEOLOCALIZAÇÃO

-- 1. Recriar função para forçar atualização de geolocalização em lote
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

-- 2. Executar todas as correções
SELECT public.recover_historical_logins();
SELECT public.force_all_geolocations_update();

-- 3. Verificar se o sistema está funcionando
SELECT 
    COUNT(*) as total_logins,
    COUNT(DISTINCT user_id) as usuarios_com_login,
    COUNT(CASE WHEN city IS NOT NULL THEN 1 END) as logins_com_geolocalizacao
FROM public.user_login_history;
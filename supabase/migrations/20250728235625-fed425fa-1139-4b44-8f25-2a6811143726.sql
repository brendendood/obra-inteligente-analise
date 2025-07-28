-- Função para forçar recaptura de geolocalização para todos os usuários ativos
CREATE OR REPLACE FUNCTION public.force_update_all_active_users_geolocation()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    user_record RECORD;
    updated_count INTEGER := 0;
BEGIN
    RAISE LOG 'GEOLOCALIZAÇÃO: Iniciando atualização em massa para usuários ativos...';
    
    -- Para cada usuário que fez login nos últimos 7 dias e tem IP válido
    FOR user_record IN 
        SELECT DISTINCT 
            ulh.user_id, 
            ulh.ip_address::text as ip_text,
            MAX(ulh.login_at) as last_login,
            MAX(ulh.id) as latest_login_id
        FROM public.user_login_history ulh
        WHERE ulh.login_at >= NOW() - INTERVAL '7 days'
        AND ulh.ip_address IS NOT NULL
        AND ulh.ip_address != '127.0.0.1'::inet
        AND (ulh.city IS NULL OR ulh.country IS NULL OR ulh.country = 'Germany')
        GROUP BY ulh.user_id, ulh.ip_address::text
        ORDER BY MAX(ulh.login_at) DESC
    LOOP
        -- Disparar notificação para recaptura via edge function
        PERFORM pg_notify('force_geolocation_update', json_build_object(
            'login_id', user_record.latest_login_id,
            'ip_address', user_record.ip_text,
            'user_id', user_record.user_id,
            'action', 'mass_update',
            'reason', 'correct_user_location'
        )::text);
        
        updated_count := updated_count + 1;
        
        RAISE LOG 'GEOLOCALIZAÇÃO: Solicitada atualização para user_id=%, ip=%', 
            user_record.user_id, user_record.ip_text;
    END LOOP;
    
    RETURN format('Solicitada atualização de geolocalização para %s usuários ativos', updated_count);
END;
$function$;
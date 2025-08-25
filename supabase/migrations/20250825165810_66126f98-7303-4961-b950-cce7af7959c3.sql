-- Criar função para processar automaticamente welcome emails
CREATE OR REPLACE FUNCTION public.process_pending_welcome_emails()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    processed_count INTEGER := 0;
    error_count INTEGER := 0;
    user_record RECORD;
    result_json jsonb;
BEGIN
    -- Buscar usuários confirmados que não receberam welcome email
    FOR user_record IN 
        SELECT DISTINCT
            up.user_id,
            up.full_name,
            au.email,
            au.email_confirmed_at,
            up.created_at
        FROM public.user_profiles up
        INNER JOIN auth.users au ON up.user_id = au.id
        LEFT JOIN public.email_logs el ON (
            el.user_id = up.user_id 
            AND el.email_type = 'welcome_user' 
            AND el.status = 'sent'
        )
        WHERE au.email_confirmed_at IS NOT NULL
          AND el.id IS NULL
          AND up.created_at >= NOW() - INTERVAL '30 days'
        ORDER BY up.created_at DESC
        LIMIT 50  -- Processar no máximo 50 por vez
    LOOP
        BEGIN
            -- Disparar notificação para envio de welcome email
            PERFORM pg_notify('send_welcome_email', json_build_object(
                'user_id', user_record.user_id,
                'email', user_record.email,
                'full_name', COALESCE(user_record.full_name, user_record.email),
                'timestamp', NOW(),
                'source', 'automatic_processing'
            )::text);
            
            processed_count := processed_count + 1;
            
            RAISE LOG 'Welcome email processado para user: % (email: %)', 
                user_record.user_id, user_record.email;
                
        EXCEPTION WHEN OTHERS THEN
            error_count := error_count + 1;
            RAISE LOG 'Erro ao processar welcome email para user %: %', 
                user_record.user_id, SQLERRM;
        END;
    END LOOP;
    
    -- Retornar resultado
    result_json := json_build_object(
        'success', true,
        'processed_users', processed_count,
        'errors', error_count,
        'timestamp', NOW()
    );
    
    RAISE LOG 'process_pending_welcome_emails concluído: % processados, % erros', 
        processed_count, error_count;
    
    RETURN result_json;
END;
$function$;

-- Comentário explicativo
COMMENT ON FUNCTION public.process_pending_welcome_emails() IS 
'Processa usuários confirmados que ainda não receberam welcome email, disparando notificações para envio automático';

-- Criar uma função auxiliar para trigger manual de welcome emails
CREATE OR REPLACE FUNCTION public.trigger_welcome_email_for_user(target_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    user_data RECORD;
    existing_email RECORD;
BEGIN
    -- Buscar dados do usuário
    SELECT 
        up.user_id,
        up.full_name,
        au.email,
        au.email_confirmed_at
    INTO user_data
    FROM public.user_profiles up
    INNER JOIN auth.users au ON up.user_id = au.id
    WHERE up.user_id = target_user_id;
    
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Usuário não encontrado'
        );
    END IF;
    
    -- Verificar se email está confirmado
    IF user_data.email_confirmed_at IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Email não confirmado'
        );
    END IF;
    
    -- Verificar se já foi enviado
    SELECT id INTO existing_email
    FROM public.email_logs
    WHERE user_id = target_user_id
      AND email_type = 'welcome_user'
      AND status = 'sent'
    LIMIT 1;
    
    IF FOUND THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Welcome email já foi enviado'
        );
    END IF;
    
    -- Disparar notificação
    PERFORM pg_notify('send_welcome_email', json_build_object(
        'user_id', user_data.user_id,
        'email', user_data.email,
        'full_name', COALESCE(user_data.full_name, user_data.email),
        'timestamp', NOW(),
        'source', 'manual_trigger'
    )::text);
    
    RETURN json_build_object(
        'success', true,
        'message', 'Welcome email disparado com sucesso',
        'user_email', user_data.email
    );
END;
$function$;
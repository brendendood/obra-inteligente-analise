-- Substituir a função RPC admin_update_user_complete para corrigir o erro "query returned more than one row"
CREATE OR REPLACE FUNCTION public.admin_update_user_complete(
    target_user_id uuid,
    admin_user_id uuid,
    profile_data jsonb DEFAULT '{}'::jsonb,
    subscription_data jsonb DEFAULT '{}'::jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    profile_updated BOOLEAN := false;
    subscription_updated BOOLEAN := false;
    result_data jsonb;
BEGIN
    -- Log da operação
    RAISE LOG 'ADMIN UPDATE: Iniciando atualização para user_id=%, admin=%, profile=%, subscription=%', 
              target_user_id, admin_user_id, profile_data, subscription_data;
    
    -- Verificar se o admin tem permissões
    IF NOT EXISTS (
        SELECT 1 FROM public.admin_permissions 
        WHERE user_id = admin_user_id 
        AND active = true
    ) THEN
        RAISE EXCEPTION 'Admin não autorizado';
    END IF;
    
    -- Atualizar perfil se há dados
    IF jsonb_object_keys(profile_data) != ARRAY[]::text[] THEN
        UPDATE public.user_profiles 
        SET 
            full_name = COALESCE(profile_data->>'full_name', full_name),
            company = COALESCE(profile_data->>'company', company),
            phone = COALESCE(profile_data->>'phone', phone),
            city = COALESCE(profile_data->>'city', city),
            state = COALESCE(profile_data->>'state', state),
            cargo = COALESCE(profile_data->>'cargo', cargo),
            updated_at = now()
        WHERE user_id = target_user_id;
        
        IF FOUND THEN
            profile_updated := true;
            RAISE LOG 'ADMIN UPDATE: Perfil atualizado com sucesso';
        END IF;
    END IF;
    
    -- Atualizar subscription se há dados
    IF jsonb_object_keys(subscription_data) != ARRAY[]::text[] THEN
        -- Primeiro verificar se existe subscription
        IF EXISTS (SELECT 1 FROM public.user_subscriptions WHERE user_id = target_user_id) THEN
            -- Atualizar subscription existente
            UPDATE public.user_subscriptions 
            SET 
                plan = COALESCE(subscription_data->>'plan', plan),
                status = COALESCE(subscription_data->>'status', status),
                updated_at = now()
            WHERE user_id = target_user_id;
        ELSE
            -- Criar nova subscription
            INSERT INTO public.user_subscriptions (
                user_id, 
                plan, 
                status, 
                created_at, 
                updated_at
            ) VALUES (
                target_user_id,
                COALESCE(subscription_data->>'plan', 'free'),
                COALESCE(subscription_data->>'status', 'active'),
                now(),
                now()
            );
        END IF;
        
        subscription_updated := true;
        RAISE LOG 'ADMIN UPDATE: Subscription atualizada com sucesso';
    END IF;
    
    -- Construir resultado
    result_data := jsonb_build_object(
        'success', true,
        'profile_updated', profile_updated,
        'subscription_updated', subscription_updated,
        'target_user_id', target_user_id,
        'updated_at', now()
    );
    
    RAISE LOG 'ADMIN UPDATE: Resultado final=%', result_data;
    
    RETURN result_data;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE LOG 'ADMIN UPDATE: Erro=%', SQLERRM;
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'error_detail', SQLSTATE
        );
END;
$function$;
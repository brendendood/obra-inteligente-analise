-- Corrigir função admin_update_user_complete com tratamento adequado de dados vazios
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
    admin_permission_check BOOLEAN := false;
    is_supreme_user BOOLEAN := false;
    original_plan TEXT;
    new_plan TEXT;
BEGIN
    -- Log da operação
    RAISE LOG 'ADMIN UPDATE: Iniciando atualização para user_id=%, admin=%, profile=%, subscription=%', 
              target_user_id, admin_user_id, profile_data, subscription_data;
    
    -- Verificar se o admin tem permissões usando função segura
    SELECT EXISTS (
        SELECT 1 FROM public.admin_permissions 
        WHERE user_id = admin_user_id 
        AND active = true
    ) INTO admin_permission_check;
    
    IF NOT admin_permission_check THEN
        RAISE EXCEPTION 'Admin não autorizado';
    END IF;
    
    -- Verificar se é usuário supremo (proteção especial)
    SELECT (au.email = 'brendendood2014@gmail.com') INTO is_supreme_user
    FROM auth.users au
    WHERE au.id = target_user_id;
    
    -- Capturar plano original para auditoria
    SELECT us.plan INTO original_plan
    FROM public.user_subscriptions us
    WHERE us.user_id = target_user_id;
    
    -- Extrair novo plano se fornecido
    new_plan := subscription_data->>'plan';
    
    -- Proteção para usuário supremo - bloquear downgrades
    IF is_supreme_user AND new_plan IS NOT NULL AND original_plan IS NOT NULL THEN
        IF (original_plan = 'ENTERPRISE' AND new_plan IN ('basic', 'pro', 'free')) OR
           (original_plan = 'pro' AND new_plan IN ('basic', 'free')) THEN
            
            -- Registrar tentativa de downgrade do usuário supremo
            INSERT INTO public.admin_actions (
                admin_user_id,
                target_user_id,
                action,
                payload,
                created_at
            ) VALUES (
                admin_user_id,
                target_user_id,
                'SUPREME_PROTECTION_TRIGGERED',
                jsonb_build_object(
                    'attempted_downgrade', jsonb_build_object(
                        'from', original_plan,
                        'to', new_plan
                    ),
                    'protection_reason', 'Supreme user downgrade blocked'
                ),
                now()
            );
            
            RETURN jsonb_build_object(
                'success', false,
                'error', 'SUPREME_PROTECTION_TRIGGERED',
                'message', 'Usuário supremo não pode ter o plano reduzido',
                'details', jsonb_build_object(
                    'current_plan', original_plan,
                    'attempted_plan', new_plan
                )
            );
        END IF;
    END IF;
    
    -- Atualizar perfil se há dados (usando função jsonb_object_keys corretamente)
    IF profile_data IS NOT NULL AND profile_data != '{}'::jsonb THEN
        UPDATE public.user_profiles 
        SET 
            full_name = CASE WHEN profile_data ? 'full_name' THEN profile_data->>'full_name' ELSE full_name END,
            company = CASE WHEN profile_data ? 'company' THEN profile_data->>'company' ELSE company END,
            phone = CASE WHEN profile_data ? 'phone' THEN profile_data->>'phone' ELSE phone END,
            city = CASE WHEN profile_data ? 'city' THEN profile_data->>'city' ELSE city END,
            state = CASE WHEN profile_data ? 'state' THEN profile_data->>'state' ELSE state END,
            cargo = CASE WHEN profile_data ? 'cargo' THEN profile_data->>'cargo' ELSE cargo END,
            updated_at = now()
        WHERE user_id = target_user_id;
        
        IF FOUND THEN
            profile_updated := true;
            RAISE LOG 'ADMIN UPDATE: Perfil atualizado com sucesso';
        END IF;
    END IF;
    
    -- Atualizar subscription se há dados
    IF subscription_data IS NOT NULL AND subscription_data != '{}'::jsonb THEN
        -- Primeiro verificar se existe subscription
        IF EXISTS (SELECT 1 FROM public.user_subscriptions WHERE user_id = target_user_id) THEN
            -- Atualizar subscription existente
            UPDATE public.user_subscriptions 
            SET 
                plan = CASE WHEN subscription_data ? 'plan' THEN subscription_data->>'plan' ELSE plan END,
                status = CASE WHEN subscription_data ? 'status' THEN subscription_data->>'status' ELSE status END,
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
    
    -- Registrar ação de auditoria bem-sucedida
    INSERT INTO public.admin_actions (
        admin_user_id,
        target_user_id,
        action,
        payload,
        created_at
    ) VALUES (
        admin_user_id,
        target_user_id,
        'USER_PROFILE_UPDATED',
        jsonb_build_object(
            'profile_data', profile_data,
            'subscription_data', subscription_data,
            'profile_updated', profile_updated,
            'subscription_updated', subscription_updated,
            'original_plan', original_plan,
            'new_plan', new_plan
        ),
        now()
    );
    
    -- Construir resultado
    result_data := jsonb_build_object(
        'success', true,
        'profile_updated', profile_updated,
        'subscription_updated', subscription_updated,
        'target_user_id', target_user_id,
        'updated_at', now(),
        'original_plan', original_plan,
        'new_plan', new_plan
    );
    
    RAISE LOG 'ADMIN UPDATE: Resultado final=%', result_data;
    
    RETURN result_data;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE LOG 'ADMIN UPDATE: Erro=%', SQLERRM;
        
        -- Registrar erro de auditoria
        INSERT INTO public.admin_actions (
            admin_user_id,
            target_user_id,
            action,
            payload,
            created_at
        ) VALUES (
            admin_user_id,
            target_user_id,
            'USER_UPDATE_FAILED',
            jsonb_build_object(
                'error', SQLERRM,
                'error_detail', SQLSTATE,
                'profile_data', profile_data,
                'subscription_data', subscription_data
            ),
            now()
        );
        
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'error_detail', SQLSTATE
        );
END;
$function$;
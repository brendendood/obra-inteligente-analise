-- Fix the admin functions to handle cases where user_subscriptions don't exist
-- and create them when needed

CREATE OR REPLACE FUNCTION admin_change_user_plan(
    target_user_id UUID,
    admin_user_id UUID,
    new_plan TEXT,
    reset_monthly_messages BOOLEAN DEFAULT false
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    admin_check_result BOOLEAN := FALSE;
    target_user_record RECORD;
    current_plan TEXT := 'basic';
    plan_enum public.subscription_plan;
    subscription_exists BOOLEAN := FALSE;
    result JSONB;
BEGIN
    -- Verificar se o admin tem permissões
    SELECT EXISTS (
        SELECT 1 FROM public.admin_permissions 
        WHERE user_id = admin_user_id 
        AND active = true 
        AND role IN ('super_admin', 'marketing', 'financial', 'support')
    ) INTO admin_check_result;

    IF NOT admin_check_result THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'UNAUTHORIZED',
            'message', 'Acesso negado - permissões insuficientes'
        );
    END IF;

    -- Converter string para enum
    CASE LOWER(new_plan)
        WHEN 'free' THEN plan_enum := 'free'::public.subscription_plan;
        WHEN 'basic' THEN plan_enum := 'basic'::public.subscription_plan;
        WHEN 'pro' THEN plan_enum := 'pro'::public.subscription_plan;
        WHEN 'enterprise' THEN plan_enum := 'enterprise'::public.subscription_plan;
        ELSE 
            RETURN jsonb_build_object(
                'success', false,
                'error', 'INVALID_PLAN',
                'message', 'Plano inválido: ' || new_plan
            );
    END CASE;

    -- Buscar dados do usuário primeiro da tabela user_profiles e auth.users
    SELECT up.user_id, up.full_name, au.email
    INTO target_user_record
    FROM public.user_profiles up
    INNER JOIN auth.users au ON up.user_id = au.id
    WHERE up.user_id = target_user_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'USER_NOT_FOUND',
            'message', 'Usuário não encontrado'
        );
    END IF;

    -- Verificar se existe subscription
    SELECT EXISTS (
        SELECT 1 FROM public.user_subscriptions 
        WHERE user_id = target_user_id
    ) INTO subscription_exists;

    -- Se subscription existe, buscar plano atual
    IF subscription_exists THEN
        SELECT us.plan::text INTO current_plan
        FROM public.user_subscriptions us
        WHERE us.user_id = target_user_id;
    END IF;

    -- Proteção suprema
    IF target_user_record.email = 'brendendood2014@gmail.com' 
       AND current_plan = 'enterprise' 
       AND new_plan != 'enterprise' THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'SUPREME_PROTECTION_TRIGGERED',
            'message', 'Usuário supremo protegido - plano enterprise não pode ser alterado'
        );
    END IF;

    -- Atualizar ou criar subscription
    IF subscription_exists THEN
        UPDATE public.user_subscriptions SET
            plan = plan_enum,
            updated_at = now()
        WHERE user_id = target_user_id;
    ELSE
        -- Criar nova subscription se não existir
        INSERT INTO public.user_subscriptions (
            user_id, 
            plan, 
            status, 
            created_at, 
            updated_at
        ) VALUES (
            target_user_id,
            plan_enum,
            'active'::public.subscription_status,
            now(),
            now()
        );
    END IF;

    -- Atualizar users table se existir
    IF EXISTS (SELECT 1 FROM public.users WHERE id = target_user_id) THEN
        UPDATE public.users SET
            plan_code = new_plan,
            updated_at = now()
        WHERE id = target_user_id;
    END IF;

    -- Resetar mensagens se solicitado
    IF reset_monthly_messages THEN
        DELETE FROM public.monthly_usage 
        WHERE user_id = target_user_id 
        AND period_ym = TO_CHAR(NOW(), 'YYYY-MM');
    END IF;

    -- Log da ação
    INSERT INTO public.admin_audit_logs (
        admin_user_id,
        action_type,
        target_type,
        target_id,
        old_values,
        new_values
    ) VALUES (
        admin_user_id,
        'CHANGE_USER_PLAN',
        'user',
        target_user_id,
        jsonb_build_object('plan', current_plan),
        jsonb_build_object('plan', new_plan, 'reset_messages', reset_monthly_messages)
    );

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Plano alterado com sucesso',
        'user_id', target_user_id,
        'original_plan', current_plan,
        'new_plan', new_plan,
        'reset_messages', reset_monthly_messages
    );

EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
        'success', false,
        'error', 'SYSTEM_ERROR',
        'message', 'Erro interno: ' || SQLERRM,
        'sql_state', SQLSTATE
    );
END;
$$;

-- Also create a function to reset user messages
CREATE OR REPLACE FUNCTION admin_reset_user_messages(
    target_user_id UUID,
    admin_user_id UUID
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    admin_check_result BOOLEAN := FALSE;
    messages_deleted INTEGER := 0;
BEGIN
    -- Verificar se o admin tem permissões
    SELECT EXISTS (
        SELECT 1 FROM public.admin_permissions 
        WHERE user_id = admin_user_id 
        AND active = true 
        AND role IN ('super_admin', 'marketing', 'financial', 'support')
    ) INTO admin_check_result;

    IF NOT admin_check_result THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'UNAUTHORIZED',
            'message', 'Acesso negado - permissões insuficientes'
        );
    END IF;

    -- Verificar se o usuário existe
    IF NOT EXISTS (SELECT 1 FROM public.user_profiles WHERE user_id = target_user_id) THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'USER_NOT_FOUND',
            'message', 'Usuário não encontrado'
        );
    END IF;

    -- Resetar mensagens do mês atual
    DELETE FROM public.monthly_usage 
    WHERE user_id = target_user_id 
    AND period_ym = TO_CHAR(NOW(), 'YYYY-MM');
    
    GET DIAGNOSTICS messages_deleted = ROW_COUNT;

    -- Log da ação
    INSERT INTO public.admin_audit_logs (
        admin_user_id,
        action_type,
        target_type,
        target_id,
        old_values,
        new_values
    ) VALUES (
        admin_user_id,
        'RESET_USER_MESSAGES',
        'user',
        target_user_id,
        jsonb_build_object('period', TO_CHAR(NOW(), 'YYYY-MM')),
        jsonb_build_object('messages_reset', messages_deleted)
    );

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Mensagens resetadas com sucesso',
        'user_id', target_user_id,
        'messages_reset', messages_deleted,
        'period', TO_CHAR(NOW(), 'YYYY-MM')
    );

EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
        'success', false,
        'error', 'SYSTEM_ERROR',
        'message', 'Erro interno: ' || SQLERRM,
        'sql_state', SQLSTATE
    );
END;
$$;
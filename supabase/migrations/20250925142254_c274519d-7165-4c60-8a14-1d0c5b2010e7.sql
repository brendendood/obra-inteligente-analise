-- First, let me check if these RPC functions exist and fix the admin_change_user_plan function
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
    current_plan TEXT;
    plan_enum public.subscription_plan;
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

    -- Buscar dados atuais do usuário
    SELECT us.plan, us.user_id, up.full_name, au.email
    INTO target_user_record
    FROM public.user_subscriptions us
    INNER JOIN public.user_profiles up ON us.user_id = up.user_id
    INNER JOIN auth.users au ON us.user_id = au.id
    WHERE us.user_id = target_user_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'USER_NOT_FOUND',
            'message', 'Usuário não encontrado'
        );
    END IF;

    current_plan := target_user_record.plan::text;

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

    -- Atualizar plano na tabela user_subscriptions
    UPDATE public.user_subscriptions SET
        plan = plan_enum,
        updated_at = now()
    WHERE user_id = target_user_id;

    -- Atualizar users table se existir
    UPDATE public.users SET
        plan_code = new_plan,
        updated_at = now()
    WHERE id = target_user_id;

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
        'message', 'Erro interno: ' || SQLERRM
    );
END;
$$;

-- Create the admin_add_project_credit function as well
CREATE OR REPLACE FUNCTION admin_add_project_credit(
    target_user_id UUID,
    admin_user_id UUID,
    credits_to_add INTEGER DEFAULT 1
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    admin_check_result BOOLEAN := FALSE;
    current_credits INTEGER := 0;
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

    -- Buscar créditos atuais
    SELECT COALESCE(credits, 0) INTO current_credits
    FROM public.user_profiles
    WHERE user_id = target_user_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'USER_NOT_FOUND',
            'message', 'Usuário não encontrado'
        );
    END IF;

    -- Adicionar créditos
    UPDATE public.user_profiles SET
        credits = credits + credits_to_add,
        updated_at = now()
    WHERE user_id = target_user_id;

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
        'ADD_PROJECT_CREDIT',
        'user',
        target_user_id,
        jsonb_build_object('credits', current_credits),
        jsonb_build_object('credits_added', credits_to_add, 'new_total', current_credits + credits_to_add)
    );

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Créditos adicionados com sucesso',
        'user_id', target_user_id,
        'credits_added', credits_to_add,
        'previous_credits', current_credits,
        'new_total', current_credits + credits_to_add
    );

EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
        'success', false,
        'error', 'SYSTEM_ERROR',
        'message', 'Erro interno: ' || SQLERRM
    );
END;
$$;
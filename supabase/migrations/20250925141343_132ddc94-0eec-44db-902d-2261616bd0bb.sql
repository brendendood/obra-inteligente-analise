-- Fix the admin_update_user_profile function to handle the correct enum values
CREATE OR REPLACE FUNCTION admin_update_user_profile(
    target_user_id UUID,
    admin_user_id UUID,
    user_data JSONB
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    admin_check_result BOOLEAN := FALSE;
    target_user_record RECORD;
    current_plan TEXT;
    new_plan TEXT;
    result JSONB;
BEGIN
    -- Verificar se o admin tem permissões (super_admin, marketing, financial, support)
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

    -- Buscar dados atuais do usuário
    SELECT up.plan_code, up.user_id, up.full_name, au.email
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

    current_plan := target_user_record.plan_code;
    new_plan := user_data->>'plan_code';

    -- Proteção suprema: verificar se é usuário supremo (email específico + plano enterprise)
    IF target_user_record.email = 'brendendood2014@gmail.com' 
       AND current_plan = 'enterprise' 
       AND new_plan != 'enterprise' THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'SUPREME_PROTECTION_TRIGGERED',
            'message', 'Usuário supremo protegido - plano enterprise não pode ser alterado'
        );
    END IF;

    -- Atualizar user_profiles
    UPDATE public.user_profiles SET
        full_name = COALESCE(user_data->>'name', full_name),
        cargo = COALESCE(user_data->>'role_title', cargo),
        company = COALESCE(user_data->>'company', company),
        phone = COALESCE(user_data->>'phone', phone),
        city = COALESCE(user_data->>'city', city),
        state = COALESCE(user_data->>'state', state),
        updated_at = now()
    WHERE user_id = target_user_id;

    -- Atualizar users table
    UPDATE public.users SET
        plan_code = COALESCE(user_data->>'plan_code', plan_code),
        status = COALESCE(user_data->>'status', status),
        updated_at = now()
    WHERE id = target_user_id;

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
        'UPDATE_USER_PROFILE',
        'user',
        target_user_id,
        jsonb_build_object(
            'plan_code', current_plan,
            'full_name', target_user_record.full_name
        ),
        user_data
    );

    -- Notificar mudanças em tempo real
    PERFORM pg_notify('user_profile_updated', jsonb_build_object(
        'user_id', target_user_id,
        'admin_id', admin_user_id,
        'changes', user_data
    )::text);

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Perfil atualizado com sucesso',
        'user_id', target_user_id
    );

EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
        'success', false,
        'error', 'SYSTEM_ERROR',
        'message', 'Erro interno: ' || SQLERRM
    );
END;
$$;
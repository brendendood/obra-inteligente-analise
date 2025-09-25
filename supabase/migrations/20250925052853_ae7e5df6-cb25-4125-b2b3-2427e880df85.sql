-- Criar funções administrativas adicionais solicitadas
CREATE OR REPLACE FUNCTION public.admin_reset_user_messages(
    target_user_id uuid,
    admin_user_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    admin_permission_check BOOLEAN := false;
    current_period TEXT;
BEGIN
    -- Verificar permissões de admin
    SELECT EXISTS (
        SELECT 1 FROM public.admin_permissions 
        WHERE user_id = admin_user_id 
        AND active = true
    ) INTO admin_permission_check;
    
    IF NOT admin_permission_check THEN
        RAISE EXCEPTION 'Admin não autorizado';
    END IF;
    
    -- Obter período atual
    current_period := TO_CHAR(NOW(), 'YYYY-MM');
    
    -- Resetar mensagens do usuário para o período atual
    UPDATE public.monthly_usage 
    SET messages_used = 0, updated_at = now()
    WHERE user_id = target_user_id AND period_ym = current_period;
    
    -- Se não existe registro, criar um
    IF NOT FOUND THEN
        INSERT INTO public.monthly_usage (user_id, period_ym, messages_used, projects_used)
        VALUES (target_user_id, current_period, 0, 0);
    END IF;
    
    -- Registrar ação de auditoria
    INSERT INTO public.admin_actions (
        admin_user_id,
        target_user_id,
        action,
        payload,
        created_at
    ) VALUES (
        admin_user_id,
        target_user_id,
        'RESET_MESSAGES',
        jsonb_build_object(
            'period', current_period,
            'reset_at', now()
        ),
        now()
    );
    
    RETURN jsonb_build_object(
        'success', true,
        'period', current_period,
        'reset_at', now()
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM
        );
END;
$function$;

-- Função para adicionar crédito de projeto
CREATE OR REPLACE FUNCTION public.admin_add_project_credit(
    target_user_id uuid,
    admin_user_id uuid,
    credits_to_add integer DEFAULT 1
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    admin_permission_check BOOLEAN := false;
    new_credits_total INTEGER;
BEGIN
    -- Verificar permissões de admin
    SELECT EXISTS (
        SELECT 1 FROM public.admin_permissions 
        WHERE user_id = admin_user_id 
        AND active = true
    ) INTO admin_permission_check;
    
    IF NOT admin_permission_check THEN
        RAISE EXCEPTION 'Admin não autorizado';
    END IF;
    
    -- Validar quantidade de créditos
    IF credits_to_add <= 0 OR credits_to_add > 50 THEN
        RAISE EXCEPTION 'Quantidade de créditos inválida (1-50)';
    END IF;
    
    -- Adicionar créditos ao usuário
    UPDATE public.user_profiles 
    SET credits = credits + credits_to_add, updated_at = now()
    WHERE user_id = target_user_id
    RETURNING credits INTO new_credits_total;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Usuário não encontrado';
    END IF;
    
    -- Registrar ação de auditoria
    INSERT INTO public.admin_actions (
        admin_user_id,
        target_user_id,
        action,
        payload,
        created_at
    ) VALUES (
        admin_user_id,
        target_user_id,
        'ADD_PROJECT_CREDITS',
        jsonb_build_object(
            'credits_added', credits_to_add,
            'new_total', new_credits_total,
            'added_at', now()
        ),
        now()
    );
    
    RETURN jsonb_build_object(
        'success', true,
        'credits_added', credits_to_add,
        'new_total', new_credits_total
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM
        );
END;
$function$;

-- Função para alterar plano específico
CREATE OR REPLACE FUNCTION public.admin_change_user_plan(
    target_user_id uuid,
    admin_user_id uuid,
    new_plan text,
    reset_monthly_messages boolean DEFAULT false
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    admin_permission_check BOOLEAN := false;
    is_supreme_user BOOLEAN := false;
    original_plan TEXT;
    current_period TEXT;
BEGIN
    -- Verificar permissões de admin
    SELECT EXISTS (
        SELECT 1 FROM public.admin_permissions 
        WHERE user_id = admin_user_id 
        AND active = true
    ) INTO admin_permission_check;
    
    IF NOT admin_permission_check THEN
        RAISE EXCEPTION 'Admin não autorizado';
    END IF;
    
    -- Validar plano
    IF new_plan NOT IN ('free', 'basic', 'pro', 'enterprise') THEN
        RAISE EXCEPTION 'Plano inválido. Use: free, basic, pro, enterprise';
    END IF;
    
    -- Verificar se é usuário supremo
    SELECT (au.email = 'brendendood2014@gmail.com') INTO is_supreme_user
    FROM auth.users au
    WHERE au.id = target_user_id;
    
    -- Buscar plano atual
    SELECT us.plan INTO original_plan
    FROM public.user_subscriptions us
    WHERE us.user_id = target_user_id;
    
    -- Proteção usuário supremo contra downgrades
    IF is_supreme_user AND original_plan IS NOT NULL THEN
        IF (original_plan = 'enterprise' AND new_plan IN ('basic', 'pro', 'free')) OR
           (original_plan = 'pro' AND new_plan IN ('basic', 'free')) THEN
            
            INSERT INTO public.admin_actions (
                admin_user_id, target_user_id, action, payload, created_at
            ) VALUES (
                admin_user_id, target_user_id, 'SUPREME_PROTECTION_TRIGGERED',
                jsonb_build_object(
                    'attempted_downgrade', jsonb_build_object('from', original_plan, 'to', new_plan),
                    'protection_reason', 'Supreme user downgrade blocked'
                ), now()
            );
            
            RETURN jsonb_build_object(
                'success', false,
                'error', 'SUPREME_PROTECTION_TRIGGERED',
                'message', 'Usuário supremo não pode ter o plano reduzido'
            );
        END IF;
    END IF;
    
    -- Atualizar ou criar subscription
    INSERT INTO public.user_subscriptions (user_id, plan, status, created_at, updated_at)
    VALUES (target_user_id, new_plan, 'active', now(), now())
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        plan = new_plan,
        status = 'active',
        updated_at = now();
    
    -- Reset de mensagens se solicitado
    IF reset_monthly_messages THEN
        current_period := TO_CHAR(NOW(), 'YYYY-MM');
        
        UPDATE public.monthly_usage 
        SET messages_used = 0, updated_at = now()
        WHERE user_id = target_user_id AND period_ym = current_period;
        
        IF NOT FOUND THEN
            INSERT INTO public.monthly_usage (user_id, period_ym, messages_used, projects_used)
            VALUES (target_user_id, current_period, 0, 0);
        END IF;
    END IF;
    
    -- Registrar ação de auditoria
    INSERT INTO public.admin_actions (
        admin_user_id,
        target_user_id,
        action,
        payload,
        created_at
    ) VALUES (
        admin_user_id,
        target_user_id,
        'PLAN_CHANGED',
        jsonb_build_object(
            'original_plan', original_plan,
            'new_plan', new_plan,
            'reset_messages', reset_monthly_messages,
            'changed_at', now()
        ),
        now()
    );
    
    RETURN jsonb_build_object(
        'success', true,
        'original_plan', original_plan,
        'new_plan', new_plan,
        'reset_messages', reset_monthly_messages
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM
        );
END;
$function$;
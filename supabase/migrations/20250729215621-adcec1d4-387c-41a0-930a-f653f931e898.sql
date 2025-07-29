-- Primeiro, criar uma função para sincronização bidirectional automática
CREATE OR REPLACE FUNCTION public.sync_admin_user_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Se é uma atualização na tabela user_subscriptions
  IF TG_TABLE_NAME = 'user_subscriptions' THEN
    -- Notificar via pg_notify que a subscription mudou (para refresh automático do admin)
    PERFORM pg_notify('user_subscription_changed', json_build_object(
      'user_id', NEW.user_id,
      'plan', NEW.plan,
      'status', NEW.status,
      'action', 'subscription_updated'
    )::text);
  END IF;
  
  -- Se é uma atualização na tabela user_profiles
  IF TG_TABLE_NAME = 'user_profiles' THEN
    -- Notificar via pg_notify que o perfil mudou (para refresh automático do admin)
    PERFORM pg_notify('user_profile_changed', json_build_object(
      'user_id', NEW.user_id,
      'full_name', NEW.full_name,
      'company', NEW.company,
      'action', 'profile_updated'
    )::text);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Criar triggers para sincronização automática
DROP TRIGGER IF EXISTS sync_user_subscriptions_changes ON public.user_subscriptions;
CREATE TRIGGER sync_user_subscriptions_changes
  AFTER UPDATE ON public.user_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.sync_admin_user_changes();

DROP TRIGGER IF EXISTS sync_user_profiles_changes ON public.user_profiles;
CREATE TRIGGER sync_user_profiles_changes
  AFTER UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.sync_admin_user_changes();

-- Função para atualizar perfil e assinatura via admin (com logs de auditoria)
CREATE OR REPLACE FUNCTION public.admin_update_user_complete(
  target_user_id uuid,
  admin_user_id uuid,
  profile_data jsonb DEFAULT '{}'::jsonb,
  subscription_data jsonb DEFAULT '{}'::jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  updated_profile RECORD;
  updated_subscription RECORD;
  audit_data jsonb := '{}'::jsonb;
BEGIN
  -- Verificar se o usuário que está fazendo a alteração é admin
  IF NOT (SELECT public.is_admin_user()) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized access');
  END IF;
  
  -- Atualizar perfil se houver dados
  IF jsonb_object_keys(profile_data) != '{}' THEN
    UPDATE public.user_profiles 
    SET 
      full_name = COALESCE(profile_data->>'full_name', full_name),
      company = COALESCE(profile_data->>'company', company),
      phone = COALESCE(profile_data->>'phone', phone),
      city = COALESCE(profile_data->>'city', city),
      state = COALESCE(profile_data->>'state', state),
      cargo = COALESCE(profile_data->>'cargo', cargo),
      updated_at = now()
    WHERE user_id = target_user_id
    RETURNING * INTO updated_profile;
    
    audit_data := audit_data || jsonb_build_object('profile_updated', true);
  END IF;
  
  -- Atualizar assinatura se houver dados
  IF jsonb_object_keys(subscription_data) != '{}' THEN
    INSERT INTO public.user_subscriptions (user_id, plan, status, updated_at)
    VALUES (
      target_user_id,
      COALESCE((subscription_data->>'plan')::subscription_plan, 'free'::subscription_plan),
      COALESCE((subscription_data->>'status')::subscription_status, 'active'::subscription_status),
      now()
    )
    ON CONFLICT (user_id) DO UPDATE SET
      plan = COALESCE((subscription_data->>'plan')::subscription_plan, user_subscriptions.plan),
      status = COALESCE((subscription_data->>'status')::subscription_status, user_subscriptions.status),
      updated_at = now()
    RETURNING * INTO updated_subscription;
    
    audit_data := audit_data || jsonb_build_object('subscription_updated', true);
    
    -- Log específico para mudança de plano pelo admin
    PERFORM public.log_admin_security_action(
      admin_user_id,
      'plan_change',
      target_user_id,
      jsonb_build_object(
        'new_plan', subscription_data->>'plan',
        'new_status', subscription_data->>'status',
        'changed_by_admin', true
      ),
      true
    );
  END IF;
  
  -- Notificar o usuário sobre mudanças feitas pelo admin (especialmente plano)
  IF updated_subscription IS NOT NULL THEN
    PERFORM pg_notify('admin_plan_change_notification', json_build_object(
      'user_id', target_user_id,
      'new_plan', updated_subscription.plan,
      'changed_by_admin', true,
      'admin_id', admin_user_id
    )::text);
  END IF;
  
  RETURN jsonb_build_object(
    'success', true,
    'profile_updated', updated_profile IS NOT NULL,
    'subscription_updated', updated_subscription IS NOT NULL,
    'audit_data', audit_data
  );
END;
$$;
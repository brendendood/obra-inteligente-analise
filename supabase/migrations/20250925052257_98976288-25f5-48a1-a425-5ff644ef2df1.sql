-- Criar evento para notificar mudanças no perfil do usuário
CREATE OR REPLACE FUNCTION public.notify_profile_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
    -- Notificar sobre mudança no perfil para atualização em tempo real
    PERFORM pg_notify('user_profile_updated', json_build_object(
        'user_id', NEW.user_id,
        'full_name', NEW.full_name,
        'company', NEW.company,
        'cargo', NEW.cargo,
        'updated_at', NEW.updated_at
    )::text);
    
    RETURN NEW;
END;
$function$;

-- Criar trigger para user_profiles
DROP TRIGGER IF EXISTS trigger_notify_profile_update ON public.user_profiles;
CREATE TRIGGER trigger_notify_profile_update
    AFTER UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_profile_update();

-- Criar evento para notificar mudanças na subscription
CREATE OR REPLACE FUNCTION public.notify_subscription_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
    -- Notificar sobre mudança na subscription
    PERFORM pg_notify('user_subscription_updated', json_build_object(
        'user_id', NEW.user_id,
        'plan', NEW.plan,
        'status', NEW.status,
        'updated_at', NEW.updated_at
    )::text);
    
    RETURN NEW;
END;
$function$;

-- Criar trigger para user_subscriptions
DROP TRIGGER IF EXISTS trigger_notify_subscription_update ON public.user_subscriptions;
CREATE TRIGGER trigger_notify_subscription_update
    AFTER UPDATE ON public.user_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_subscription_update();
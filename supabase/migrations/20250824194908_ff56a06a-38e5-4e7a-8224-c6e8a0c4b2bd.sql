-- Função atômica para incrementar o uso mensal de IA
CREATE OR REPLACE FUNCTION public.increment_ai_usage(p_user uuid, p_period char(7))
RETURNS TABLE (count int) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.ai_message_usage (user_id, period_ym, count, updated_at)
  VALUES (p_user, p_period, 1, now())
  ON CONFLICT (user_id, period_ym)
  DO UPDATE SET count = ai_message_usage.count + 1, updated_at = now()
  RETURNING ai_message_usage.count;
END;
$$;

-- Permissões: apenas roles seguras podem executar
REVOKE ALL ON FUNCTION public.increment_ai_usage(uuid, char(7)) FROM public;
GRANT EXECUTE ON FUNCTION public.increment_ai_usage(uuid, char(7)) TO authenticated;

-- Trigger para sincronizar messages_quota com o plano
CREATE OR REPLACE FUNCTION public.sync_messages_quota()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.plan_tier = 'FREE' THEN
    NEW.messages_quota := 50;
  ELSIF NEW.plan_tier = 'BASIC' THEN
    NEW.messages_quota := 500;
  ELSIF NEW.plan_tier = 'PRO' THEN
    NEW.messages_quota := 2000;
  ELSIF NEW.plan_tier = 'ENTERPRISE' THEN
    NEW.messages_quota := 2147483647; -- sentinel "ilimitado"
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_messages_quota ON public.user_plans;

CREATE TRIGGER trg_sync_messages_quota
BEFORE INSERT OR UPDATE OF plan_tier
ON public.user_plans
FOR EACH ROW
EXECUTE FUNCTION public.sync_messages_quota();
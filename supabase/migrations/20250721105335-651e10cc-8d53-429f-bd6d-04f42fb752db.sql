
-- Alterar o enum subscription_plan para usar 'basic' em vez de 'free'
ALTER TYPE subscription_plan RENAME TO subscription_plan_old;

CREATE TYPE subscription_plan AS ENUM ('basic', 'pro', 'enterprise');

-- Migrar dados existentes de 'free' para 'basic'
ALTER TABLE user_subscriptions 
ALTER COLUMN plan TYPE subscription_plan USING 
CASE 
  WHEN plan::text = 'free' THEN 'basic'::subscription_plan
  ELSE plan::text::subscription_plan 
END;

-- Remover o tipo antigo
DROP TYPE subscription_plan_old;

-- Atualizar o trigger para usar 'basic' como padrão
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  
  INSERT INTO public.user_subscriptions (user_id, plan, status)
  VALUES (NEW.id, 'basic', 'active');
  
  RETURN NEW;
END;
$$;


-- Adicionar 'basic' ao enum subscription_plan existente
ALTER TYPE subscription_plan ADD VALUE 'basic' BEFORE 'pro';

-- Atualizar trigger function para usar 'free' como padrão (não 'basic')
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.user_profiles (
    user_id, 
    full_name,
    avatar_url,
    avatar_type
  )
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NULL,
    'initials'
  );
  
  -- Inserir assinatura FREE como padrão (não basic)
  INSERT INTO public.user_subscriptions (user_id, plan, status)
  VALUES (NEW.id, 'free', 'active');
  
  RETURN NEW;
END;
$$;

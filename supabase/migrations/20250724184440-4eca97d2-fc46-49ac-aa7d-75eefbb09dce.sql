-- Garantir que os campos company e cargo são salvos no handle_new_user_profile
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.user_profiles (
    user_id, 
    full_name,
    company,
    cargo,
    avatar_url,
    avatar_type,
    gender
  )
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'company', ''),
    COALESCE(NEW.raw_user_meta_data->>'cargo', ''),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'avatar_type', 'initials'),
    COALESCE(NEW.raw_user_meta_data->>'gender', 'male')
  );
  
  -- Inserir assinatura FREE como padrão
  INSERT INTO public.user_subscriptions (user_id, plan, status)
  VALUES (NEW.id, 'free', 'active');
  
  RETURN NEW;
END;
$$;

-- Atualizar também a função sync_user_metadata para incluir os novos campos
CREATE OR REPLACE FUNCTION public.sync_user_metadata()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Atualizar user_metadata no auth.users quando user_profiles for alterado
  UPDATE auth.users 
  SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object(
    'full_name', NEW.full_name,
    'company', NEW.company,
    'phone', NEW.phone,
    'city', NEW.city,
    'state', NEW.state,
    'country', NEW.country,
    'avatar_url', NEW.avatar_url,
    'avatar_type', NEW.avatar_type,
    'gender', NEW.gender,
    'cargo', NEW.cargo,
    'empresa', NEW.empresa
  )
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$;

-- Recriar o trigger de sincronização que estava faltando
DROP TRIGGER IF EXISTS trigger_sync_user_metadata ON public.user_profiles;

-- Recriar a função de sincronização melhorada
CREATE OR REPLACE FUNCTION public.sync_user_metadata()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recriar o trigger
CREATE TRIGGER trigger_sync_user_metadata
  AFTER UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_user_metadata();

-- Corrigir a função handle_new_user_profile para usar 'basic' em vez de 'free'
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

-- Criar perfis para usuários que não os possuem
INSERT INTO public.user_profiles (user_id, full_name)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'full_name', au.email) as full_name
FROM auth.users au
LEFT JOIN public.user_profiles up ON au.id = up.user_id
WHERE up.user_id IS NULL;

-- Criar assinaturas para usuários que não as possuem
INSERT INTO public.user_subscriptions (user_id, plan, status)
SELECT 
  au.id,
  'basic' as plan,
  'active' as status
FROM auth.users au
LEFT JOIN public.user_subscriptions us ON au.id = us.user_id
WHERE us.user_id IS NULL;

-- Habilitar realtime para user_profiles
ALTER TABLE public.user_profiles REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_profiles;

-- Habilitar realtime para user_subscriptions 
ALTER TABLE public.user_subscriptions REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_subscriptions;

-- Habilitar realtime para projects
ALTER TABLE public.projects REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;

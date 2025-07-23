-- Verificar e corrigir o trigger de criação automática de perfil
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user_profile();

-- Recriar a função corrigida
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Inserir perfil com dados do cadastro
  INSERT INTO public.user_profiles (
    user_id, 
    full_name,
    avatar_url,
    avatar_type
  )
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    '😊',
    'emoji'
  );
  
  -- Inserir assinatura free como padrão
  INSERT INTO public.user_subscriptions (user_id, plan, status)
  VALUES (NEW.id, 'basic', 'active');
  
  RETURN NEW;
END;
$$;

-- Recriar o trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();

-- Criar dados faltantes para usuários existentes
INSERT INTO public.user_profiles (user_id, full_name, avatar_url, avatar_type)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'full_name', au.email) as full_name,
  '😊' as avatar_url,
  'emoji' as avatar_type
FROM auth.users au
LEFT JOIN public.user_profiles up ON au.id = up.user_id
WHERE up.user_id IS NULL;

-- Criar assinaturas faltantes para usuários existentes
INSERT INTO public.user_subscriptions (user_id, plan, status)
SELECT 
  au.id,
  'basic' as plan,
  'active' as status
FROM auth.users au
LEFT JOIN public.user_subscriptions us ON au.id = us.user_id
WHERE us.user_id IS NULL;
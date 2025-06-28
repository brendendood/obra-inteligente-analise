
-- Primeiro, limpar dados existentes problemáticos de forma mais segura
DELETE FROM public.admin_permissions WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'admin@arqcloud.com.br'
);

DELETE FROM public.user_profiles WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'admin@arqcloud.com.br'
);

DELETE FROM public.user_subscriptions WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'admin@arqcloud.com.br'
);

-- Remover usuário existente da auth.users
DELETE FROM auth.users WHERE email = 'admin@arqcloud.com.br';

-- Criar novo usuário admin com campos obrigatórios apenas
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  role,
  aud
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@arqcloud.com.br',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Admin ArqCloud"}',
  'authenticated',
  'authenticated'
);

-- Garantir que o usuário está na tabela admin_users
INSERT INTO public.admin_users (email, full_name, is_active) 
VALUES ('admin@arqcloud.com.br', 'Admin ArqCloud', true)
ON CONFLICT (email) DO UPDATE SET 
  is_active = true,
  full_name = 'Admin ArqCloud';

-- Criar profile para o usuário admin (usando ON CONFLICT para evitar duplicatas)
INSERT INTO public.user_profiles (user_id, full_name)
SELECT u.id, 'Admin ArqCloud'
FROM auth.users u
WHERE u.email = 'admin@arqcloud.com.br'
ON CONFLICT (user_id) DO UPDATE SET 
  full_name = 'Admin ArqCloud';

-- Criar subscription para o usuário admin (usando ON CONFLICT para evitar duplicatas)
INSERT INTO public.user_subscriptions (user_id, plan, status)
SELECT u.id, 'enterprise', 'active'
FROM auth.users u
WHERE u.email = 'admin@arqcloud.com.br'
ON CONFLICT (user_id) DO UPDATE SET 
  plan = 'enterprise',
  status = 'active';

-- Criar permissões administrativas (usando ON CONFLICT para evitar duplicatas)
INSERT INTO public.admin_permissions (
  user_id,
  role,
  active,
  granted_at
) 
SELECT 
  u.id,
  'super_admin',
  true,
  now()
FROM auth.users u
WHERE u.email = 'admin@arqcloud.com.br'
ON CONFLICT (user_id, role) DO UPDATE SET 
  active = true,
  granted_at = now();


-- Inserir o novo usuário admin na tabela admin_users
INSERT INTO public.admin_users (email, full_name, is_active) 
VALUES ('admin@arqcloud.com.br', 'Admin ArqCloud', true)
ON CONFLICT (email) DO UPDATE SET 
  is_active = true,
  full_name = 'Admin ArqCloud';

-- Garantir que o brendendood2014@gmail.com também esteja na tabela admin_users
INSERT INTO public.admin_users (email, full_name, is_active) 
VALUES ('brendendood2014@gmail.com', 'Brenden DOOD - Super Admin', true)
ON CONFLICT (email) DO UPDATE SET 
  is_active = true,
  full_name = 'Brenden DOOD - Super Admin';

-- Criar um usuário de autenticação para admin@arqcloud.com.br
-- Usando INSERT com WHERE NOT EXISTS para evitar duplicatas
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) 
SELECT 
  gen_random_uuid(),
  'admin@arqcloud.com.br',
  crypt('vovopepe', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Admin ArqCloud"}',
  false,
  'authenticated'
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'admin@arqcloud.com.br'
);

-- Atualizar senha se usuário já existir
UPDATE auth.users 
SET 
  encrypted_password = crypt('vovopepe', gen_salt('bf')),
  updated_at = now()
WHERE email = 'admin@arqcloud.com.br';

-- Criar permissões administrativas para admin@arqcloud.com.br
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
  AND NOT EXISTS (
    SELECT 1 FROM public.admin_permissions ap 
    WHERE ap.user_id = u.id AND ap.role = 'super_admin'
  );

-- Criar permissões administrativas para brendendood2014@gmail.com
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
WHERE u.email = 'brendendood2014@gmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM public.admin_permissions ap 
    WHERE ap.user_id = u.id AND ap.role = 'super_admin'
  );

-- Criar profiles para os usuários admin se não existirem
INSERT INTO public.user_profiles (user_id, full_name)
SELECT u.id, 'Admin ArqCloud'
FROM auth.users u
WHERE u.email = 'admin@arqcloud.com.br'
  AND NOT EXISTS (
    SELECT 1 FROM public.user_profiles up WHERE up.user_id = u.id
  );

-- Criar subscriptions para os usuários admin
INSERT INTO public.user_subscriptions (user_id, plan, status)
SELECT u.id, 'enterprise', 'active'
FROM auth.users u
WHERE u.email = 'admin@arqcloud.com.br'
  AND NOT EXISTS (
    SELECT 1 FROM public.user_subscriptions us WHERE us.user_id = u.id
  );

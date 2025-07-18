
-- Corrigir o usuário admin existente com todos os campos obrigatórios preenchidos corretamente
UPDATE auth.users 
SET 
  confirmation_token = '',
  recovery_token = '',
  email_change_token_new = '',
  email_change_token_current = '',
  phone_change_token = '',
  confirmation_sent_at = NULL,
  recovery_sent_at = NULL,
  email_change_sent_at = NULL,
  phone_change_sent_at = NULL,
  email_change = '',
  phone_change = '',
  phone = NULL,
  phone_confirmed_at = NULL,
  email_change_confirm_status = 0,
  banned_until = NULL,
  deleted_at = NULL,
  is_sso_user = false,
  is_anonymous = false
WHERE email = 'admin@arqcloud.com.br';

-- Se não existir, criar com todos os campos obrigatórios
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change_token_current,
  phone_change_token,
  raw_app_meta_data,
  raw_user_meta_data,
  role,
  aud,
  confirmation_sent_at,
  recovery_sent_at,
  email_change_sent_at,
  phone_change_sent_at,
  email_change,
  phone_change,
  phone,
  phone_confirmed_at,
  email_change_confirm_status,
  banned_until,
  deleted_at,
  is_sso_user,
  is_anonymous
) 
SELECT 
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@arqcloud.com.br',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  '',
  '',
  '',
  '',
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Admin ArqCloud"}',
  'authenticated',
  'authenticated',
  NULL,
  NULL,
  NULL,
  NULL,
  '',
  '',
  NULL,
  NULL,
  0,
  NULL,
  NULL,
  false,
  false
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'admin@arqcloud.com.br'
);

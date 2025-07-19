-- Adicionar permissões de admin para o usuário atual
-- Substitua o email pelo email real do usuário que deve ter acesso admin

INSERT INTO admin_permissions (user_id, role, granted_by, granted_at, active)
SELECT 
  id,
  'admin'::admin_role,
  id, -- self-granted for initial setup
  now(),
  true
FROM auth.users 
WHERE email = 'seu_email@exemplo.com' -- SUBSTITUA PELO SEU EMAIL REAL
ON CONFLICT (user_id, role) DO NOTHING;
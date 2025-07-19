-- Adicionar permissões de super_admin para o usuário atual
-- IMPORTANTE: Substitua 'seu_email@exemplo.com' pelo email real do usuário que deve ter acesso admin

INSERT INTO admin_permissions (user_id, role, granted_by, granted_at, active)
SELECT 
  id,
  'super_admin'::admin_role,
  id, -- self-granted for initial setup
  now(),
  true
FROM auth.users 
WHERE email ILIKE '%@%' -- Isso vai pegar o primeiro usuário que encontrar com @
  AND id = auth.uid() -- Apenas para o usuário logado atualmente
ON CONFLICT (user_id, role) DO NOTHING;

-- Se nenhum usuário for encontrado com o filtro acima, adicione manualmente:
-- Para adicionar manualmente, primeiro veja qual é o user_id:
-- SELECT id, email FROM auth.users;
-- Depois execute:
-- INSERT INTO admin_permissions (user_id, role, granted_by, granted_at, active)
-- VALUES ('SEU_USER_ID_AQUI', 'super_admin', 'SEU_USER_ID_AQUI', now(), true)
-- ON CONFLICT (user_id, role) DO NOTHING;
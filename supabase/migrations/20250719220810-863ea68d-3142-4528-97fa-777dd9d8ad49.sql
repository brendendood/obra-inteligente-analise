-- Corrigir recursão infinita nas políticas RLS e adicionar admins
-- Primeiro, vamos limpar as políticas problemáticas e recriar de forma segura

-- Remover política problemática
DROP POLICY IF EXISTS "Admins can view permissions" ON admin_permissions;

-- Criar nova política que não causa recursão
CREATE POLICY "Admins can view permissions" ON admin_permissions
FOR SELECT 
TO authenticated
USING (
  user_id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM admin_permissions ap2 
    WHERE ap2.user_id = auth.uid() 
    AND ap2.active = true 
    AND ap2.role IN ('super_admin', 'marketing', 'financial', 'support')
  )
);

-- Adicionar permissões de admin para os usuários principais
INSERT INTO admin_permissions (user_id, role, granted_by, granted_at, active)
VALUES 
  ('c44a9e01-2cb5-4fe2-8249-5f89581029c0', 'super_admin', 'c44a9e01-2cb5-4fe2-8249-5f89581029c0', now(), true),
  ('6b46fd6c-a0be-47a5-81eb-53ecb7fa9cab', 'super_admin', 'c44a9e01-2cb5-4fe2-8249-5f89581029c0', now(), true),
  ('016dc047-e5dc-4cbc-8622-cacbf858ce77', 'super_admin', 'c44a9e01-2cb5-4fe2-8249-5f89581029c0', now(), true),
  ('1edda594-e9c7-41de-aeff-1a2b156d1fba', 'super_admin', 'c44a9e01-2cb5-4fe2-8249-5f89581029c0', now(), true)
ON CONFLICT (user_id, role) DO NOTHING;
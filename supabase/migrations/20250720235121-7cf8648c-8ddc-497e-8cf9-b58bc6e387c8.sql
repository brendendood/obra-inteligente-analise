
-- Corrigir a função is_admin_user para usar admin_permissions em vez de user_roles
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.admin_permissions ap
    WHERE ap.user_id = auth.uid() 
    AND ap.active = true 
    AND ap.role IN ('super_admin', 'marketing', 'financial', 'support')
  );
$$;

-- Garantir que temos pelo menos um usuário admin para testes
-- (usando IDs dos usuários que já existem nas migrações anteriores)
INSERT INTO public.admin_permissions (user_id, role, granted_by, granted_at, active)
VALUES 
  ('c44a9e01-2cb5-4fe2-8249-5f89581029c0', 'super_admin', 'c44a9e01-2cb5-4fe2-8249-5f89581029c0', now(), true),
  ('6b46fd6c-a0be-47a5-81eb-53ecb7fa9cab', 'super_admin', 'c44a9e01-2cb5-4fe2-8249-5f89581029c0', now(), true)
ON CONFLICT (user_id, role) DO NOTHING;


-- Atualizar função is_admin_user para usar apenas valores válidos do enum admin_role
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.admin_permissions ap
    JOIN auth.users u ON u.id = ap.user_id
    WHERE u.id = auth.uid() 
      AND ap.active = true
      AND ap.role = 'super_admin'
  );
$$;

-- Garantir que o usuário admin@arqcloud.com.br existe e tem permissões corretas
INSERT INTO public.admin_users (email, full_name, is_active) 
VALUES ('admin@arqcloud.com.br', 'Admin ArqCloud - Super Admin', true)
ON CONFLICT (email) DO UPDATE SET 
  is_active = true,
  full_name = 'Admin ArqCloud - Super Admin';

-- Criar permissões administrativas para admin@arqcloud.com.br
INSERT INTO public.admin_permissions (
  user_id,
  role,
  active,
  granted_at
) 
SELECT 
  u.id,
  'super_admin'::admin_role,
  true,
  now()
FROM auth.users u
WHERE u.email = 'admin@arqcloud.com.br'
  AND NOT EXISTS (
    SELECT 1 FROM public.admin_permissions ap 
    WHERE ap.user_id = u.id AND ap.role = 'super_admin'
  );

-- Adicionar campo last_login na tabela user_profiles se não existir
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS last_login timestamp with time zone;

-- Habilitar RLS na tabela de auditoria se ainda não estiver
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Remover política existente se já existir e recriar
DROP POLICY IF EXISTS "Only admins can view audit logs" ON public.admin_audit_logs;

-- Política para que apenas admins vejam logs de auditoria
CREATE POLICY "Only admins can view audit logs" 
  ON public.admin_audit_logs 
  FOR SELECT 
  USING (public.is_admin_user() = true);

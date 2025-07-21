
-- Corrigir recursão infinita nas políticas RLS
-- Primeiro, remover as políticas problemáticas
DROP POLICY IF EXISTS "Admins can view permissions" ON admin_permissions;

-- Recriar política mais simples que não causa recursão
CREATE POLICY "Users can view own admin permissions" ON admin_permissions
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- Criar política para super admins poderem ver todas as permissões
CREATE POLICY "Super admins can view all permissions" ON admin_permissions
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM pg_roles 
    WHERE rolname = current_user AND rolsuper = true
  )
);

-- Simplificar função is_admin_user para evitar recursão
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
  -- Verificar se é superuser do PostgreSQL
  SELECT EXISTS (
    SELECT 1 FROM pg_roles 
    WHERE rolname = current_user AND rolsuper = true
  ) OR 
  -- OU verificar se tem permissão admin diretamente na tabela
  EXISTS (
    SELECT 1 FROM public.admin_permissions 
    WHERE user_id = auth.uid() 
    AND active = true 
    AND role IN ('super_admin', 'marketing', 'financial', 'support')
  );
$$;

-- Remover a política muito permissiva e criar políticas específicas
DROP POLICY IF EXISTS "System can update user data" ON public.users;

-- Política específica para triggers do sistema (SECURITY DEFINER functions)
CREATE POLICY "System functions can manage user data" 
ON public.users 
FOR ALL 
TO authenticator
USING (true);

-- Política para admins gerenciarem usuários
CREATE POLICY "Admins can manage all users" 
ON public.users 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_permissions 
    WHERE user_id = auth.uid() 
    AND active = true 
    AND role IN ('super_admin', 'marketing', 'financial', 'support')
  )
);
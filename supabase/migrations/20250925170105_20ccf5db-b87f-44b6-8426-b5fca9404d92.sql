-- Garantir que a tabela users tenha RLS habilitada e políticas adequadas para admins
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Criar política para admins verem todos os usuários
CREATE POLICY "Admins can view all users" 
ON public.users 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_permissions 
    WHERE user_id = auth.uid() 
    AND active = true 
    AND role IN ('super_admin', 'marketing', 'financial', 'support')
  )
);

-- Criar política para usuários verem apenas seus próprios dados
CREATE POLICY "Users can view own data" 
ON public.users 
FOR SELECT 
USING (auth.uid() = id);

-- Permitir que o sistema atualize dados de usuários (trigger)
CREATE POLICY "System can update user data" 
ON public.users 
FOR ALL 
USING (true);

-- Remover a política muito permissiva se existir
DROP POLICY IF EXISTS "System can update user data" ON public.users;
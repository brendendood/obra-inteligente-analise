
-- Criar política de INSERT para user_profiles
-- Permite que usuários criem seus próprios perfis
CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

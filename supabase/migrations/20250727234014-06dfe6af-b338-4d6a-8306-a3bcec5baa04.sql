-- Corrigir sistema de mudança de plano no admin
-- Problema: Admins não conseguem atualizar/deletar user_subscriptions

-- Adicionar policy para admins poderem atualizar planos de usuários
CREATE POLICY "Admins can update user subscriptions" 
ON public.user_subscriptions 
FOR UPDATE 
USING (public.is_admin_user());

-- Adicionar policy para admins poderem deletar subscriptions se necessário
CREATE POLICY "Admins can delete user subscriptions" 
ON public.user_subscriptions 
FOR DELETE 
USING (public.is_admin_user());

-- Permitir que sistema possa atualizar subscriptions (para webhooks, etc)
CREATE POLICY "System can update user subscriptions" 
ON public.user_subscriptions 
FOR UPDATE 
USING (true);
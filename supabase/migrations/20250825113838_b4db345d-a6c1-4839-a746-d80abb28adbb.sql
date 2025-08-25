-- Adicionar políticas RLS para a view v_crm_client_stats
-- A view herda as permissões das tabelas base, mas vamos garantir acesso explícito

-- Permitir que usuários vejam estatísticas dos seus próprios clientes
CREATE POLICY "Users can view own client stats"
ON public.v_crm_client_stats
FOR SELECT
TO authenticated
USING (owner_id = auth.uid());

-- Permitir que admins vejam todas as estatísticas
CREATE POLICY "Admins can view all client stats"
ON public.v_crm_client_stats
FOR SELECT
TO authenticated
USING (is_admin_user());
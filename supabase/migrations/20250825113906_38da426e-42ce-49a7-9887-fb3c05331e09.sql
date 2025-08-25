-- Habilitar RLS na view v_crm_client_stats
-- Views herdam as permissões das tabelas base, mas vamos habilitar RLS
ALTER VIEW public.v_crm_client_stats SET (security_barrier = true);

-- Conceder permissões explícitas para usuários autenticados
GRANT SELECT ON public.v_crm_client_stats TO authenticated;
-- Criar tabela para logs de impersonação
CREATE TABLE IF NOT EXISTS public.admin_impersonation_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL,
  user_impersonated_id uuid NOT NULL,
  started_at timestamp with time zone NOT NULL DEFAULT now(),
  ended_at timestamp with time zone,
  duration_minutes integer,
  reason text,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.admin_impersonation_logs ENABLE ROW LEVEL SECURITY;

-- Policy para superusers visualizarem todos os logs
CREATE POLICY "Superusers can view all impersonation logs"
ON public.admin_impersonation_logs
FOR SELECT
USING (public.is_superuser());

-- Policy para superusers gerenciarem logs
CREATE POLICY "Superusers can manage impersonation logs"
ON public.admin_impersonation_logs
FOR ALL
USING (public.is_superuser());

-- Função para finalizar sessão de impersonação
CREATE OR REPLACE FUNCTION public.end_impersonation_session(session_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.admin_impersonation_logs
  SET 
    ended_at = now(),
    duration_minutes = EXTRACT(MINUTES FROM (now() - started_at))::integer
  WHERE id = session_id AND ended_at IS NULL;
END;
$$;
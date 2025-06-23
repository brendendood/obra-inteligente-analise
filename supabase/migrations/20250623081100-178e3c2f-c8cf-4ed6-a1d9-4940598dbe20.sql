
-- Criar tabela para administradores autorizados
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Inserir o administrador autorizado
INSERT INTO public.admin_users (email, full_name) 
VALUES ('brendendood2014@gmail.com', 'Administrador Master');

-- Habilitar RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Política para que apenas o próprio admin possa ver seus dados
CREATE POLICY "Admin users can view own data" 
  ON public.admin_users 
  FOR SELECT 
  USING (
    email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    )
  );

-- Função para verificar se é admin baseado no email do usuário autenticado
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.admin_users a
    JOIN auth.users u ON u.email = a.email
    WHERE u.id = auth.uid() AND a.is_active = true
  );
$$;

-- Função para obter estatísticas do admin (apenas para admins)
CREATE OR REPLACE FUNCTION public.get_admin_stats()
RETURNS TABLE (
  total_users BIGINT,
  total_projects BIGINT,
  total_analyses BIGINT,
  recent_projects BIGINT,
  active_users_week BIGINT
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT 
    (SELECT COUNT(*) FROM auth.users)::BIGINT,
    (SELECT COUNT(*) FROM public.projects)::BIGINT,
    (SELECT COUNT(*) FROM public.project_analyses)::BIGINT,
    (SELECT COUNT(*) FROM public.projects WHERE created_at > CURRENT_DATE - INTERVAL '7 days')::BIGINT,
    (SELECT COUNT(DISTINCT user_id) FROM public.projects WHERE created_at > CURRENT_DATE - INTERVAL '7 days')::BIGINT
  WHERE public.is_admin() = true;
$$;

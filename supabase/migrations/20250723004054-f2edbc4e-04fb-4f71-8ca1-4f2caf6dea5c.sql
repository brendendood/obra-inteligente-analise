-- Criar função para verificar se o usuário é admin
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_permissions 
    WHERE user_id = auth.uid() 
    AND active = true 
    AND role IN ('super_admin', 'admin')
  ) OR public.is_superuser();
$$;

-- Adicionar policy para admins visualizarem todos os projetos
CREATE POLICY "Admins can view all projects" 
ON public.projects 
FOR SELECT 
USING (public.is_admin_user());

-- Adicionar policy para admins atualizarem todos os projetos  
CREATE POLICY "Admins can update all projects"
ON public.projects
FOR UPDATE
USING (public.is_admin_user());

-- Adicionar policy para admins deletarem todos os projetos
CREATE POLICY "Admins can delete all projects"  
ON public.projects
FOR DELETE
USING (public.is_admin_user());
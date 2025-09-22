-- Verificar e corrigir políticas RLS duplicadas na tabela projects
-- Primeiro, vamos remover políticas duplicadas mantendo apenas as necessárias

-- Remover políticas duplicadas
DROP POLICY IF EXISTS "Users can create projects" ON public.projects;
DROP POLICY IF EXISTS "Users can view own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON public.projects;

-- Criar políticas consolidadas e otimizadas
CREATE POLICY "projects_users_can_manage_own" 
ON public.projects 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Política específica para admins visualizarem todos os projetos
CREATE POLICY "projects_admins_can_view_all" 
ON public.projects 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_permissions 
    WHERE user_id = auth.uid() 
    AND active = true 
    AND role IN ('admin', 'super_admin')
  )
);

-- Política específica para superusers
CREATE POLICY "projects_superusers_can_view_all" 
ON public.projects 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_permissions 
    WHERE user_id = auth.uid() 
    AND active = true 
    AND role = 'super_admin'
  )
);

-- Garantir que storage bucket project-files existe e tem políticas corretas
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-files', 'project-files', false)
ON CONFLICT (id) DO NOTHING;

-- Corrigir políticas de storage para project-files
DROP POLICY IF EXISTS "Users can upload their own project files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own project files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own project files" ON storage.objects;

-- Política para upload (INSERT)
CREATE POLICY "project_files_users_can_upload" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'project-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Política para visualização (SELECT)
CREATE POLICY "project_files_users_can_view" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'project-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Política para exclusão (DELETE)
CREATE POLICY "project_files_users_can_delete" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'project-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Política para service role (edge functions) acessar todos os arquivos
CREATE POLICY "project_files_service_role_access" 
ON storage.objects 
FOR ALL 
USING (bucket_id = 'project-files')
WITH CHECK (bucket_id = 'project-files');

-- Adicionar logs para debug de autenticação
CREATE OR REPLACE FUNCTION public.debug_project_insert()
RETURNS TRIGGER AS $$
BEGIN
  RAISE LOG 'DEBUG: Tentativa de inserção na tabela projects - user_id: %, auth.uid(): %, NEW.user_id: %', 
    NEW.user_id, auth.uid(), NEW.user_id;
  
  IF auth.uid() IS NULL THEN
    RAISE LOG 'ERROR: auth.uid() é NULL durante inserção';
  END IF;
  
  IF NEW.user_id IS NULL THEN
    RAISE LOG 'ERROR: NEW.user_id é NULL durante inserção';
  END IF;
  
  IF auth.uid() != NEW.user_id THEN
    RAISE LOG 'ERROR: auth.uid() (%) não confere com NEW.user_id (%)', auth.uid(), NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
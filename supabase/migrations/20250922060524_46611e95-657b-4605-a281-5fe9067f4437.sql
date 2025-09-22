-- Corrigir políticas RLS para projetos sem referências problemáticas
-- Primeiro, limpar políticas duplicadas
DROP POLICY IF EXISTS "Users can create projects" ON public.projects;
DROP POLICY IF EXISTS "Users can view own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON public.projects;

-- Criar política consolidada e otimizada para usuários
CREATE POLICY "projects_users_can_manage_own" 
ON public.projects 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Garantir que storage bucket project-files existe
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
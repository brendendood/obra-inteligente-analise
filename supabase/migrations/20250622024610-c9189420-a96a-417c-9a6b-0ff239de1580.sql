
-- Criar bucket para armazenar arquivos PDF se não existir
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-files',
  'project-files',
  false,
  52428800, -- 50MB
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Remover políticas existentes se existirem e recriar
DROP POLICY IF EXISTS "Authenticated users can upload project files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their project files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their project files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can create their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON public.projects;

-- Políticas para storage bucket
CREATE POLICY "Authenticated users can upload project files" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (
    bucket_id = 'project-files' 
    AND auth.uid() IS NOT NULL 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their project files" 
  ON storage.objects 
  FOR SELECT 
  USING (
    bucket_id = 'project-files' 
    AND auth.uid() IS NOT NULL 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their project files" 
  ON storage.objects 
  FOR DELETE 
  USING (
    bucket_id = 'project-files' 
    AND auth.uid() IS NOT NULL 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Políticas para tabela projects
CREATE POLICY "Users can view their own projects" 
  ON public.projects 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects" 
  ON public.projects 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" 
  ON public.projects 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" 
  ON public.projects 
  FOR DELETE 
  USING (auth.uid() = user_id);

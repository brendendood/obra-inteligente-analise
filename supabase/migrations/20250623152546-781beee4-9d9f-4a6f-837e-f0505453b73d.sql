
-- Remover políticas existentes que podem estar causando conflito
DROP POLICY IF EXISTS "Authenticated users can upload project files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their project files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their project files" ON storage.objects;

-- Criar políticas mais específicas e funcionais
CREATE POLICY "Users can upload to their own folders" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (
    bucket_id = 'project-files' 
    AND auth.uid() IS NOT NULL 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view files in their own folders" 
  ON storage.objects 
  FOR SELECT 
  USING (
    bucket_id = 'project-files' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete files in their own folders" 
  ON storage.objects 
  FOR DELETE 
  USING (
    bucket_id = 'project-files' 
    AND auth.uid() IS NOT NULL 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

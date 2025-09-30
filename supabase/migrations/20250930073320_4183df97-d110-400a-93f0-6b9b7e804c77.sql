-- Atualizar bucket project-files para permitir tipos MIME de imagem
UPDATE storage.buckets 
SET allowed_mime_types = ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
WHERE id = 'project-files';

-- Criar bucket separado para thumbnails (fallback)
INSERT INTO storage.buckets (id, name, public, allowed_mime_types)
VALUES ('thumbnails', 'thumbnails', true, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'],
  public = true;

-- Políticas RLS para thumbnails
CREATE POLICY "Users can view all thumbnails" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'thumbnails');

CREATE POLICY "Users can upload thumbnails for their projects" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'thumbnails' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own thumbnails" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'thumbnails' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own thumbnails" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'thumbnails' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
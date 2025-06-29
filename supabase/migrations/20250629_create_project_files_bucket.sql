
-- Create project-files storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-files',
  'project-files',
  false,
  52428800, -- 50MB limit
  ARRAY['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'application/zip', 'application/x-zip-compressed']
)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for project-files bucket
CREATE POLICY "Users can upload their own project files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'project-files' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own project files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'project-files' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own project files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'project-files' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow Edge Functions to access project files
CREATE POLICY "Service role can manage project files" ON storage.objects
  FOR ALL USING (bucket_id = 'project-files');

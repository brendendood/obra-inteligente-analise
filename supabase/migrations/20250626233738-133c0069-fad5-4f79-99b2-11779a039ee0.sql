
-- Create storage bucket for project documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-documents',
  'project-documents',
  false,
  52428800, -- 50MB limit
  ARRAY[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/dwg',
    'image/vnd.dwg',
    'application/acad',
    'application/x-dwg',
    'application/x-autocad',
    'image/x-dwg'
  ]
);

-- Create storage policies for project documents
CREATE POLICY "Users can view their project documents"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their project documents"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'project-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their project documents"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'project-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their project documents"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'project-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create project_documents table
CREATE TABLE public.project_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('plantas', 'rrts', 'licencas', 'memoriais', 'outros')),
  mime_type TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for project_documents
ALTER TABLE public.project_documents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for project_documents
CREATE POLICY "Users can view their project documents"
  ON public.project_documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their project documents"
  ON public.project_documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their project documents"
  ON public.project_documents FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their project documents"
  ON public.project_documents FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_project_documents_project_id ON public.project_documents(project_id);
CREATE INDEX idx_project_documents_category ON public.project_documents(category);
CREATE INDEX idx_project_documents_user_id ON public.project_documents(user_id);

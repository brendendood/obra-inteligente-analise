
export interface ProjectDocument {
  id: string;
  project_id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  category: 'plantas' | 'rrts' | 'licencas' | 'memoriais' | 'outros';
  mime_type: string;
  uploaded_at: string;
  updated_at: string;
}

export interface DocumentCategory {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
}

export interface UploadProgress {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

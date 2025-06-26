
import { useState } from 'react';
import { UploadProgress } from '@/types/document';

export const useUploadProgress = () => {
  const [uploading, setUploading] = useState<UploadProgress[]>([]);

  const addUpload = (file: File) => {
    const uploadProgress: UploadProgress = {
      file,
      progress: 0,
      status: 'uploading'
    };
    setUploading(prev => [...prev, uploadProgress]);
  };

  const updateProgress = (file: File, progress: number) => {
    setUploading(prev => prev.map(upload => 
      upload.file === file 
        ? { ...upload, progress }
        : upload
    ));
  };

  const setSuccess = (file: File) => {
    setUploading(prev => prev.map(upload => 
      upload.file === file 
        ? { ...upload, progress: 100, status: 'success' }
        : upload
    ));
  };

  const setError = (file: File, error: string) => {
    setUploading(prev => prev.map(upload => 
      upload.file === file 
        ? { ...upload, status: 'error', error }
        : upload
    ));
  };

  const clearCompleted = () => {
    setUploading(prev => prev.filter(upload => upload.status === 'uploading'));
  };

  return {
    uploading,
    addUpload,
    updateProgress,
    setSuccess,
    setError,
    clearCompleted
  };
};

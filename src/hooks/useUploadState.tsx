
import { useState } from 'react';

export const useUploadState = () => {
  const [file, setFile] = useState<File | null>(null);
  const [projectName, setProjectName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [validatedProject, setValidatedProject] = useState<any>(null);

  const resetUpload = () => {
    setFile(null);
    setProjectName('');
    setUploading(false);
    setProgress(0);
    setUploadComplete(false);
  };

  return {
    file,
    projectName,
    uploading,
    progress,
    uploadComplete,
    validatedProject,
    setFile,
    setProjectName,
    setUploading,
    setProgress,
    setUploadComplete,
    setValidatedProject,
    resetUpload
  };
};

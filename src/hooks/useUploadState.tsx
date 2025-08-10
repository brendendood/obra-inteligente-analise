
import { useState } from 'react';

export const useUploadState = () => {
  const [file, setFile] = useState<File | null>(null);
  const [projectName, setProjectName] = useState('');
  const [stateUF, setStateUF] = useState('');
  const [cityName, setCityName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [validatedProject, setValidatedProject] = useState<any>(null);

  const resetUpload = () => {
    setFile(null);
    setProjectName('');
    setStateUF('');
    setCityName('');
    setUploading(false);
    setProgress(0);
    setUploadComplete(false);
  };

  return {
    file,
    projectName,
    stateUF,
    cityName,
    uploading,
    progress,
    uploadComplete,
    validatedProject,
    setFile,
    setProjectName,
    setStateUF,
    setCityName,
    setUploading,
    setProgress,
    setUploadComplete,
    setValidatedProject,
    resetUpload
  };
};


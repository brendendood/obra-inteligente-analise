
import { useProject } from '@/contexts/ProjectContext';
import { useProcessingSteps } from '@/hooks/useProcessingSteps';
import { useUploadState } from '@/hooks/useUploadState';
import { useUploadAuth } from '@/hooks/useUploadAuth';
import { useUploadHandlers } from '@/hooks/useUploadHandlers';

export const useUploadLogic = () => {
  const { currentProject, loadUserProjects, clearAllProjects } = useProject();
  const { isAuthenticated, user, authLoading } = useUploadAuth();
  
  const {
    file,
    projectName,
    stateUF,
    cityName,
    uploading,
    progress,
    uploadComplete,
    setFile,
    setProjectName,
    setStateUF,
    setCityName,
    setUploading,
    setProgress,
    setUploadComplete,
    resetUpload
  } = useUploadState();
  
  const { 
    steps, 
    currentStep, 
    isProcessing, 
    progress: processingProgress, 
    startProcessing, 
    stopProcessing 
  } = useProcessingSteps();

  const { handleUpload } = useUploadHandlers({
    file,
    projectName,
    stateUF,
    cityName,
    user,
    validatedProject: null,
    setUploading,
    setProgress,
    setUploadComplete,
    setValidatedProject: () => {},
    startProcessing,
    stopProcessing,
    loadUserProjects
  });

  return {
    // State
    file,
    projectName,
    stateUF,
    cityName,
    uploading,
    progress,
    uploadComplete,
    authLoading,
    isAuthenticated,
    steps,
    currentStep,
    isProcessing,
    processingProgress,
    // Actions
    setFile,
    setProjectName,
    setStateUF,
    setCityName,
    handleUpload,
    resetUpload
  };
};

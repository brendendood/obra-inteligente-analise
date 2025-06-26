
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
    uploading,
    progress,
    uploadComplete,
    setFile,
    setProjectName,
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
    handleUpload,
    resetUpload
  };
};

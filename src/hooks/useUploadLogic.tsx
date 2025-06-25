
import { useProject } from '@/contexts/ProjectContext';
import { useProcessingSteps } from '@/hooks/useProcessingSteps';
import { useUploadState } from '@/hooks/useUploadState';
import { useUploadAuth } from '@/hooks/useUploadAuth';
import { useProjectValidationEffect } from '@/hooks/useProjectValidationEffect';
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
    validatedProject,
    setFile,
    setProjectName,
    setUploading,
    setProgress,
    setUploadComplete,
    setValidatedProject,
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

  // Validar projeto atual quando o componente carregar
  useProjectValidationEffect({
    currentProject,
    user,
    clearAllProjects,
    setValidatedProject
  });

  const { handleUpload, handleAnalyzeExisting } = useUploadHandlers({
    file,
    projectName,
    user,
    validatedProject,
    setUploading,
    setProgress,
    setUploadComplete,
    setValidatedProject,
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
    validatedProject,
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
    handleAnalyzeExisting,
    resetUpload
  };
};

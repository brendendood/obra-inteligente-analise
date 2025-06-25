
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProject } from '@/contexts/ProjectContext';
import { useToast } from '@/hooks/use-toast';
import { useProcessingSteps } from '@/hooks/useProcessingSteps';
import { supabase } from '@/integrations/supabase/client';

export const useUploadLogic = () => {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const { currentProject, loadUserProjects, clearAllProjects } = useProject();
  const [file, setFile] = useState<File | null>(null);
  const [projectName, setProjectName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [validatedProject, setValidatedProject] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { 
    steps, 
    currentStep, 
    isProcessing, 
    progress: processingProgress, 
    startProcessing, 
    stopProcessing 
  } = useProcessingSteps();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Validar projeto atual quando o componente carregar
  useEffect(() => {
    const validateCurrentProject = async () => {
      if (currentProject && user) {
        console.log('Validando projeto atual na página de upload:', currentProject.id);
        
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', currentProject.id)
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error) {
          console.error('Erro ao validar projeto:', error);
          clearAllProjects();
          setValidatedProject(null);
          return;
        }
        
        if (data) {
          console.log('Projeto validado com sucesso:', data.name);
          setValidatedProject(data);
        } else {
          console.log('Projeto não existe mais no DB, limpando estado');
          clearAllProjects();
          setValidatedProject(null);
        }
      } else {
        setValidatedProject(null);
      }
    };

    if (user && currentProject) {
      validateCurrentProject();
    }
  }, [currentProject, user, clearAllProjects]);

  const handleUpload = async () => {
    if (!file || !user || !projectName.trim()) {
      toast({
        title: "❌ Campos obrigatórios",
        description: "Por favor, selecione um arquivo e informe o nome do projeto.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setProgress(0);
    startProcessing();

    try {
      const fileName = `${user.id}/${Date.now()}-${file.name}`;
      
      // Simular progresso de upload
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 80) {
            clearInterval(progressInterval);
            return 80;
          }
          return prev + 10;
        });
      }, 200);

      console.log('Uploading file to storage:', fileName);

      // Upload do arquivo para o storage
      const { error: uploadError } = await supabase.storage
        .from('project-files')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error(`Erro no upload: ${uploadError.message}`);
      }

      console.log('File uploaded successfully, calling edge function');
      setProgress(90);

      // Chamar edge function para processar metadados
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Sessão não encontrada. Faça login novamente.');
      }

      const { data, error: processError } = await supabase.functions
        .invoke('upload-project', {
          body: {
            fileName,
            originalName: file.name,
            projectName: projectName.trim(),
            fileSize: file.size
          }
        });

      if (processError) {
        console.error('Edge function error:', processError);
        throw new Error(`Erro no processamento: ${processError.message}`);
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Erro no processamento');
      }

      clearInterval(progressInterval);
      setProgress(100);
      setUploadComplete(true);
      stopProcessing();
      
      console.log('Upload completed successfully:', data);
      
      toast({
        title: "🎉 Upload concluído!",
        description: data.message || "Seu projeto foi analisado com sucesso.",
      });

      // Recarregar projetos e limpar estado de projeto validado
      setTimeout(() => {
        setValidatedProject(null);
        loadUserProjects();
        navigate('/painel');
      }, 2000);

    } catch (error) {
      console.error('Upload error:', error);
      stopProcessing();
      
      let errorMessage = "Erro desconhecido";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast({
        title: "❌ Erro no upload",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyzeExisting = () => {
    if (validatedProject) {
      navigate('/assistant');
    } else {
      toast({
        title: "ℹ️ Nenhum projeto encontrado",
        description: "Faça upload de um projeto primeiro.",
        variant: "default",
      });
    }
  };

  const resetUpload = () => {
    setFile(null);
    setProjectName('');
    setUploading(false);
    setProgress(0);
    setUploadComplete(false);
  };

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

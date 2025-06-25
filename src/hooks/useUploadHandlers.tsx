
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UseUploadHandlersProps {
  file: File | null;
  projectName: string;
  user: any;
  validatedProject: any;
  setUploading: (uploading: boolean) => void;
  setProgress: (progress: number) => void;
  setUploadComplete: (complete: boolean) => void;
  setValidatedProject: (project: any) => void;
  startProcessing: () => void;
  stopProcessing: () => void;
  loadUserProjects: () => Promise<any[]>;
}

export const useUploadHandlers = ({
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
}: UseUploadHandlersProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

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
      
      // Simular progresso de upload - CORREÇÃO DO ERRO
      let currentProgress = 0;
      const progressInterval = setInterval(() => {
        currentProgress += 10;
        if (currentProgress >= 80) {
          clearInterval(progressInterval);
          setProgress(80);
        } else {
          setProgress(currentProgress);
        }
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

      // Recarregar projetos e navegar para o dashboard
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
      navigate(`/projeto/${validatedProject.id}/assistente`);
    } else {
      toast({
        title: "ℹ️ Nenhum projeto encontrado",
        description: "Faça upload de um projeto primeiro.",
        variant: "default",
      });
    }
  };

  return {
    handleUpload,
    handleAnalyzeExisting
  };
};

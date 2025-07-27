
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Project } from '@/types/project';
import { useUnifiedProjectStore } from '@/stores/unifiedProjectStore';
import { useProjectLimits } from '@/hooks/useProjectLimits';

export const useProjectUpload = (
  setCurrentProject: (project: Project | null) => void
) => {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { addProject, forceRefresh } = useUnifiedProjectStore();
  const { checkAndConsumeCredit } = useProjectLimits();

  const uploadProject = useCallback(async (file: File, projectName: string): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      toast({
        title: "❌ Acesso necessário",
        description: "Faça login para enviar projetos.",
        variant: "destructive",
      });
      return false;
    }

    if (!projectName.trim()) {
      toast({
        title: "❌ Nome obrigatório",
        description: "Informe um nome para o projeto.",
        variant: "destructive",
      });
      return false;
    }

    // Verificar limite de projetos e consumir crédito se necessário
    const canProceed = await checkAndConsumeCredit();
    if (!canProceed) {
      return false;
    }

    try {
      const fileName = `${user.id}/${Date.now()}-${file.name}`;

      console.log('Enviando arquivo:', file.name, 'Como projeto:', projectName, 'Usuário:', user.email);

      // Upload do arquivo para o storage
      const { error: uploadError } = await supabase.storage
        .from('project-files')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error(`Erro no upload: ${uploadError.message}`);
      }

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
      
      // SYNC: Atualizar store global e contexto atual
      if (data.project) {
        console.log('📦 UPLOAD SYNC: Adicionando projeto ao store global:', data.project.name);
        
        // Adicionar ao store global primeiro
        addProject(data.project);
        
        // Definir como projeto atual
        console.log('📌 UPLOAD SYNC: Definindo como projeto atual:', data.project.name);
        setCurrentProject(data.project);
        
        // Forçar refresh para garantir sincronização completa
        console.log('🔄 UPLOAD SYNC: Forçando refresh da lista de projetos');
        await forceRefresh();
      }
      
      toast({
        title: data.analysis?.isRealProject ? "🎉 Projeto técnico analisado!" : "📄 PDF processado!",
        description: data.message,
      });
      
      return true;
    } catch (error) {
      console.error('Upload error:', error);
      
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        toast({
          title: "🔐 Acesso necessário",
          description: "Faça login para enviar projetos.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "❌ Erro no upload",
          description: error instanceof Error ? error.message : "Não foi possível processar o arquivo.",
          variant: "destructive",
        });
      }
      return false;
    }
  }, [toast, setCurrentProject, isAuthenticated, user, addProject, forceRefresh, checkAndConsumeCredit]);

  return { uploadProject };
};

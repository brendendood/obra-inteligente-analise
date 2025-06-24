
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Project } from '@/types/project';

export function useProjectOperations() {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

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
      
      toast({
        title: data.analysis?.isRealProject ? "🎉 Projeto técnico analisado!" : "📄 PDF processado!",
        description: data.message,
      });
      
      console.log('Upload bem-sucedido, projeto definido:', data.project);
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
  }, [toast, isAuthenticated, user]);

  const loadUserProjects = useCallback(async (): Promise<Project[]> => {
    if (!isAuthenticated) {
      console.log('Usuário não autenticado, não carregando projetos');
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const projectsData = data || [];
      return projectsData;
    } catch (error) {
      console.error('Error loading projects:', error);
      return [];
    }
  }, [isAuthenticated]);

  return {
    uploadProject,
    loadUserProjects,
  };
}


import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseProjectValidationEffectProps {
  currentProject: any;
  user: any;
  clearAllProjects: () => void;
  setValidatedProject: (project: any) => void;
}

export const useProjectValidationEffect = ({
  currentProject,
  user,
  clearAllProjects,
  setValidatedProject
}: UseProjectValidationEffectProps) => {
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
  }, [currentProject, user, clearAllProjects, setValidatedProject]);
};

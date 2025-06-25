
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Project } from '@/types/project';

export const useProjectValidation = () => {
  const { user } = useAuth();

  const validateProject = useCallback(async (project: Project): Promise<Project | null> => {
    if (!user || !project) return null;

    console.log('Verificando se projeto ainda existe no DB:', project.id);
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', project.id)
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (error) {
      console.error('Erro ao verificar projeto:', error);
      return null;
    }
    
    if (data) {
      console.log('Projeto validado:', data.name);
      return data;
    } else {
      console.log('Projeto não existe mais no DB');
      return null;
    }
  }, [user]);

  return { validateProject };
};

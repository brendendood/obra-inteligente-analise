
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Project } from '@/types/project';

export function useProjectState() {
  const [currentProject, setCurrentProjectState] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Carregar projeto do localStorage ao inicializar
  useEffect(() => {
    if (isAuthenticated) {
      const savedProject = localStorage.getItem('currentProject');
      if (savedProject) {
        try {
          const project = JSON.parse(savedProject);
          setCurrentProjectState(project);
          console.log('Projeto carregado do localStorage:', project);
        } catch (error) {
          console.error('Erro ao carregar projeto do localStorage:', error);
          localStorage.removeItem('currentProject');
        }
      }
    } else {
      // Limpar projeto se não estiver autenticado
      setCurrentProjectState(null);
      setProjects([]);
      localStorage.removeItem('currentProject');
    }
  }, [isAuthenticated]);

  // Função para atualizar o projeto atual com persistência
  const setCurrentProject = useCallback((project: Project | null) => {
    setCurrentProjectState(project);
    if (project && isAuthenticated) {
      localStorage.setItem('currentProject', JSON.stringify(project));
      console.log('Projeto salvo no localStorage:', project);
    } else {
      localStorage.removeItem('currentProject');
      console.log('Projeto removido do localStorage');
    }
  }, [isAuthenticated]);

  return {
    currentProject,
    projects,
    isLoading,
    setCurrentProject,
    setProjects,
    setIsLoading,
  };
}


import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProjectHeader } from '@/components/layout/ProjectHeader';
import { ProjectWorkspaceTabs } from './ProjectWorkspaceTabs';
import { useProject } from '@/contexts/ProjectContext';
import { useAuth } from '@/hooks/useAuth';
import { useProjectsConsistency } from '@/hooks/useProjectsConsistency';
import { useContextualNavigation } from '@/hooks/useContextualNavigation';
import { ErrorFallback } from '@/components/error/ErrorFallback';
import { Info } from 'lucide-react';

interface ProjectWorkspaceContainerProps {
  children: React.ReactNode;
}

export const ProjectWorkspaceContainer = ({ children }: ProjectWorkspaceContainerProps) => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { currentProject, setCurrentProject } = useProject();
  const { getProject, projectExists } = useProjectsConsistency();
  const { saveToHistory } = useContextualNavigation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Determinar seção atual baseada na URL
  const getCurrentSection = () => {
    const path = location.pathname;
    if (path.includes('/orcamento')) return 'orcamento';
    if (path.includes('/cronograma')) return 'cronograma';
    if (path.includes('/assistente')) return 'assistente';
    if (path.includes('/documentos')) return 'documentos';
    return 'visao-geral';
  };

  const [activeTab, setActiveTab] = useState(getCurrentSection());

  // Atualizar tab ativa quando a URL mudar
  useEffect(() => {
    setActiveTab(getCurrentSection());
  }, [location.pathname]);

  // Carregar projeto específico usando o hook de consistência
  useEffect(() => {
    const loadProject = async () => {
      console.log('🏗️ WORKSPACE: Carregando projeto', { projectId, isAuthenticated, userId: user?.id });
      
      if (!projectId || !isAuthenticated || !user) {
        console.log('❌ WORKSPACE: Parâmetros inválidos para carregar projeto');
        navigate('/painel');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Verificar se o projeto existe usando o hook de consistência
        if (!projectExists(projectId)) {
          console.error('❌ WORKSPACE: Projeto não encontrado na lista:', projectId);
          throw new Error('Projeto não encontrado ou acesso negado');
        }

        const project = getProject(projectId);
        if (!project) {
          console.error('❌ WORKSPACE: Projeto não retornado pelo getProject:', projectId);
          throw new Error('Projeto não encontrado');
        }

        console.log('✅ WORKSPACE: Projeto carregado:', {
          id: project.id,
          name: project.name,
          userId: project.user_id
        });
        
        setCurrentProject(project);
        
        // Salvar no histórico para navegação contextual
        saveToHistory(location.pathname, projectId, project.name);
        
      } catch (error) {
        console.error('💥 WORKSPACE: Erro ao carregar projeto:', error);
        setError(error instanceof Error ? error : new Error('Erro desconhecido'));
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId, isAuthenticated, user, setCurrentProject, navigate, saveToHistory, location.pathname, projectExists, getProject]);

  const handleTabChange = (value: string) => {
    if (!currentProject) return;
    
    console.log('🔄 WORKSPACE: Mudando tab para:', value);
    setActiveTab(value);
    const newPath = value === 'visao-geral' 
      ? `/projeto/${projectId}` 
      : `/projeto/${projectId}/${value}`;
    
    // Usar navigate diretamente para mudanças de tab (não salvar no histórico)
    navigate(newPath);
  };

  const getSectionTitle = (section: string) => {
    switch (section) {
      case 'orcamento': return 'Orçamento';
      case 'cronograma': return 'Cronograma';
      case 'assistente': return 'Assistente IA';
      case 'documentos': return 'Documentos';
      default: return 'Visão Geral';
    }
  };

  if (error) {
    return (
      <ErrorFallback 
        error={error}
        title="Erro ao carregar projeto"
        message="Não foi possível carregar os detalhes do projeto. Verifique se o projeto existe e tente novamente."
      />
    );
  }

  if (loading) {
    return null; // Loading will be handled by parent component
  }

  if (!currentProject) {
    return (
      <ErrorFallback 
        title="Projeto não encontrado"
        message="O projeto que você está tentando acessar não foi encontrado ou você não tem permissão para visualizá-lo."
      />
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        <ProjectHeader 
          projectName={currentProject.name}
          projectId={currentProject.id}
          currentSection={getSectionTitle(activeTab)}
        />
        
        <div className="flex-1 p-6">
          {activeTab === 'visao-geral' && (
            <Alert className="mb-6 border-blue-200 bg-blue-50">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                <strong>Projeto:</strong> {currentProject.name} - Use as abas acima para acessar diferentes funcionalidades deste projeto específico.
              </AlertDescription>
            </Alert>
          )}
          
          <ProjectWorkspaceTabs 
            activeTab={activeTab} 
            onTabChange={handleTabChange}
          >
            {children}
          </ProjectWorkspaceTabs>
        </div>
      </div>
    </AppLayout>
  );
};

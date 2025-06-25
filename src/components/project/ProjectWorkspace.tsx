
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProjectHeader } from '@/components/layout/ProjectHeader';
import { useProject } from '@/contexts/ProjectContext';
import { useAuth } from '@/hooks/useAuth';
import { useContextualNavigation } from '@/hooks/useContextualNavigation';
import { 
  FileText, 
  Calculator, 
  Calendar, 
  Bot, 
  Download 
} from 'lucide-react';

interface ProjectWorkspaceProps {
  children: React.ReactNode;
}

export const ProjectWorkspace = ({ children }: ProjectWorkspaceProps) => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { currentProject, setCurrentProject, loadUserProjects } = useProject();
  const { navigateContextual } = useContextualNavigation();
  const [loading, setLoading] = useState(true);

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

  // Carregar e validar projeto
  useEffect(() => {
    const loadProject = async () => {
      if (!projectId || !isAuthenticated || !user) {
        navigate('/painel');
        return;
      }

      try {
        setLoading(true);
        const projects = await loadUserProjects();
        const project = projects.find(p => p.id === projectId);
        
        if (!project) {
          console.error('Projeto não encontrado:', projectId);
          navigate('/obras');
          return;
        }

        setCurrentProject(project);
      } catch (error) {
        console.error('Erro ao carregar projeto:', error);
        navigate('/obras');
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId, isAuthenticated, user, loadUserProjects, setCurrentProject, navigate]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const newPath = value === 'visao-geral' 
      ? `/projeto/${projectId}` 
      : `/projeto/${projectId}/${value}`;
    navigateContextual(newPath, projectId);
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

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando projeto...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!currentProject) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-600">Projeto não encontrado</p>
          </div>
        </div>
      </AppLayout>
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
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger 
                value="visao-geral"
                className="flex items-center space-x-2"
              >
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Visão Geral</span>
              </TabsTrigger>
              <TabsTrigger 
                value="orcamento"
                className="flex items-center space-x-2"
              >
                <Calculator className="h-4 w-4" />
                <span className="hidden sm:inline">Orçamento</span>
              </TabsTrigger>
              <TabsTrigger 
                value="cronograma"
                className="flex items-center space-x-2"
              >
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Cronograma</span>
              </TabsTrigger>
              <TabsTrigger 
                value="assistente"
                className="flex items-center space-x-2"
              >
                <Bot className="h-4 w-4" />
                <span className="hidden sm:inline">Assistente</span>
              </TabsTrigger>
              <TabsTrigger 
                value="documentos"
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Documentos</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="flex-1">
              {children}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
};

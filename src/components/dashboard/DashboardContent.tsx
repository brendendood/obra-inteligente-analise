
import { useEffect } from 'react';
import DashboardRecentProjects from './DashboardRecentProjects';
import { QuickActions } from './QuickActions';
import { StatsCards } from './StatsCards';
import { ProjectDeleteConfirmDialog } from '@/components/projects/ProjectDeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { Plus, FolderOpen, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProjectStore, useProjectStats } from '@/stores/projectStore';
import { useProjectDeletion } from '@/hooks/useProjectDeletion';

interface DashboardContentProps {
  stats: any;
  projects: any[]; // Mantido para compatibilidade, mas não usado
  isDataLoading: boolean; // Mantido para compatibilidade, mas não usado
}

const DashboardContent = ({ stats }: DashboardContentProps) => {
  const navigate = useNavigate();
  
  // Estado do Zustand
  const { 
    projects, 
    isLoading, 
    error, 
    fetchProjects, 
    forceRefresh,
    clearError 
  } = useProjectStore();
  
  // Estatísticas dos projetos
  const { recentProjects } = useProjectStats();
  
  // Hook para gerenciar exclusão
  const {
    projectToDelete,
    isDeleting,
    confirmDelete,
    cancelDelete,
    executeDelete,
  } = useProjectDeletion();

  // Carregar projetos quando o dashboard carregar
  useEffect(() => {
    console.log('🏠 DASHBOARD: Carregando projetos...');
    fetchProjects();
  }, [fetchProjects]);

  // Limpar erro automaticamente
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleRefresh = async () => {
    console.log('🔄 DASHBOARD: Atualizando projetos...');
    await forceRefresh();
  };

  return (
    <div className="space-y-6 sm:space-y-8 w-full min-w-0">
      {/* Stats Cards */}
      <StatsCards stats={stats} />
      
      {/* Quick Actions */}
      <QuickActions />
      
      {/* Projects Section - Estilo Pasta de Arquivos */}
      <div className="relative w-full min-w-0">
        <Card className="border border-gray-200 bg-white w-full min-w-0">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 w-full min-w-0">
              <div className="flex items-center space-x-2 min-w-0">
                <FolderOpen className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                  Meus Projetos
                </CardTitle>
                <span className="text-sm text-gray-500 flex-shrink-0">
                  ({projects.length})
                </span>
                {isLoading && (
                  <div className="flex items-center space-x-1">
                    <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
                    <span className="text-xs text-blue-600">Carregando...</span>
                  </div>
                )}
              </div>
              
              {/* Botões de Ação */}
              <div className="flex items-center space-x-2">
                {!isLoading && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    className="text-gray-600 hover:text-blue-600 border-gray-300 hover:border-blue-300"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                )}
                
                <Button
                  onClick={() => navigate('/upload')}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-10 px-4 sm:px-6 font-medium rounded-lg w-full sm:w-auto min-w-0"
                  style={{ fontSize: '16px' }}
                >
                  <Plus className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Novo Projeto</span>
                </Button>
              </div>
            </div>

            {/* Mostrar erro se houver */}
            {error && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">
                  ⚠️ {error}
                </p>
              </div>
            )}
          </CardHeader>
          
          <CardContent className="w-full min-w-0">
            {/* Projetos Recentes com Drag & Drop */}
            <DashboardRecentProjects
              projects={recentProjects}
              isLoading={isLoading}
              onDeleteProject={confirmDelete}
            />
            
            {projects.length > 6 && (
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  onClick={() => navigate('/projetos')}
                  className="border-gray-300 hover:border-blue-300 hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition-all duration-200"
                >
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Ver Todos os Projetos ({projects.length})
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog de Confirmação de Exclusão */}
      <ProjectDeleteConfirmDialog
        project={projectToDelete}
        isOpen={!!projectToDelete}
        isDeleting={isDeleting}
        onConfirm={executeDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default DashboardContent;

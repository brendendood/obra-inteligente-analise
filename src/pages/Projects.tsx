
import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProjectsGrid } from '@/components/projects/ProjectsGrid';
import ProjectsFiltersBar from '@/components/projects/ProjectsFiltersBar';
import ProjectsStats from '@/components/projects/ProjectsStats';
import ProjectsEmptyState from '@/components/projects/ProjectsEmptyState';
import { ProjectDeleteConfirmDialog } from '@/components/projects/ProjectDeleteConfirmDialog';
import { EnhancedSkeleton } from '@/components/ui/enhanced-skeleton';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus } from 'lucide-react';
import { useUnifiedProjectStore } from '@/stores/unifiedProjectStore';
import { useProjectDeletion } from '@/hooks/useProjectDeletion';
import { useProjectSync } from '@/hooks/useProjectSync';
import { SyncStatusIndicator } from '@/components/common/SyncStatusIndicator';

export default function Projects() {
  const navigate = useNavigate();
  
  // Estado do Zustand
  const { 
    projects, 
    isLoading, 
    error, 
    fetchProjects, 
    clearError 
  } = useUnifiedProjectStore();
  
  // Hook para gerenciar exclusão
  const {
    projectToDelete,
    isDeleting,
    confirmDelete,
    cancelDelete,
    executeDelete,
  } = useProjectDeletion();
  
  // Hook para sincronização automática
  useProjectSync();
  
  // Estados locais para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'area' | 'date'>('date');
  const [showAnalyzedOnly, setShowAnalyzedOnly] = useState(false);

  // Carregar projetos ao montar o componente
  useEffect(() => {
    console.log('🔄 PROJETOS: Carregando projetos...');
    fetchProjects();
  }, [fetchProjects]);

  // Limpar erro quando houver mudanças
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  // Filtrar e ordenar projetos
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects.filter(project =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (showAnalyzedOnly) {
      filtered = filtered.filter(project => project.analysis_data);
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'area':
          return (b.total_area || 0) - (a.total_area || 0);
        case 'date':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
  }, [projects, searchTerm, sortBy, showAnalyzedOnly]);

  const handleSortChange = (value: string) => {
    setSortBy(value as 'name' | 'area' | 'date');
  };

  const analyzedProjects = projects.filter(project => project.analysis_data).length;

  // Mostrar loading enquanto busca projetos
  if (isLoading && projects.length === 0) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gray-50/30">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
              <div className="flex justify-between items-center">
                <EnhancedSkeleton variant="text" className="h-8 w-64" />
                <EnhancedSkeleton variant="default" className="h-10 w-32" />
              </div>
              <EnhancedSkeleton variant="default" className="h-32" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <EnhancedSkeleton key={i} variant="default" className="h-48" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <ScrollArea className="h-screen">
        <div className="min-h-screen bg-gray-50/30">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Meus Projetos</h1>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base">Gerencie e analise seus projetos de construção</p>
                  {error && (
                    <p className="text-red-600 text-sm mt-2 bg-red-50 px-3 py-2 rounded-md border border-red-200">
                      ⚠️ {error}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center space-x-3">
                  <SyncStatusIndicator />
                  <Button
                    onClick={() => navigate('/upload')}
                    className="bg-blue-600 hover:bg-blue-700 text-white h-11 px-6 font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Novo Projeto</span>
                    <span className="sm:hidden">Novo</span>
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <ProjectsStats 
                totalProjects={projects.length} 
                processedProjects={analyzedProjects} 
              />

              {projects.length === 0 ? (
                <ProjectsEmptyState />
              ) : (
                <>
                  {/* Filters */}
                  <ProjectsFiltersBar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    sortBy={sortBy}
                    onSortChange={handleSortChange}
                    totalProjects={projects.length}
                    analyzedProjects={analyzedProjects}
                  />

                  {/* Projects Grid */}
                  <div className="pb-8">
                    <ProjectsGrid 
                      projects={filteredAndSortedProjects}
                      onDeleteProject={confirmDelete}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Dialog de Confirmação de Exclusão */}
      <ProjectDeleteConfirmDialog
        project={projectToDelete}
        isOpen={!!projectToDelete}
        isDeleting={isDeleting}
        onConfirm={executeDelete}
        onCancel={cancelDelete}
      />
    </AppLayout>
  );
}

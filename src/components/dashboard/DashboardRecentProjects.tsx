
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Folder } from 'lucide-react';
import { EnhancedSkeleton } from '@/components/ui/enhanced-skeleton';
import { DragDropProjectCard } from './DragDropProjectCard';
import { useProjectDragDrop } from '@/hooks/useProjectDragDrop';
import { Project } from '@/types/project';

interface DashboardRecentProjectsProps {
  projects: Project[];
  isLoading: boolean;
}

const DashboardRecentProjects = ({ projects, isLoading }: DashboardRecentProjectsProps) => {
  const navigate = useNavigate();
  const [orderedProjects, setOrderedProjects] = useState<Project[]>([]);

  // Carregar ordem salva do localStorage
  useEffect(() => {
    if (projects.length > 0) {
      const savedOrder = localStorage.getItem('dashboardProjectOrder');
      if (savedOrder) {
        try {
          const orderIds = JSON.parse(savedOrder);
          const orderedByPreference = projects.sort((a, b) => {
            const indexA = orderIds.indexOf(a.id);
            const indexB = orderIds.indexOf(b.id);
            if (indexA === -1 && indexB === -1) return 0;
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            return indexA - indexB;
          });
          setOrderedProjects(orderedByPreference);
        } catch {
          setOrderedProjects(projects);
        }
      } else {
        setOrderedProjects(projects);
      }
    }
  }, [projects]);

  const handleReorder = (reorderedProjects: Project[]) => {
    setOrderedProjects(reorderedProjects);
    // Salvar nova ordem no localStorage
    const projectOrder = reorderedProjects.map(p => p.id);
    localStorage.setItem('dashboardProjectOrder', JSON.stringify(projectOrder));
  };

  const {
    dragState,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd
  } = useProjectDragDrop(orderedProjects, handleReorder);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {[...Array(6)].map((_, i) => (
          <EnhancedSkeleton key={i} variant="card" className="h-64" />
        ))}
      </div>
    );
  }

  const recentProjects = orderedProjects.slice(0, 6);

  if (recentProjects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 rounded-2xl p-8 sm:p-12 border-2 border-dashed border-gray-200">
          <Folder className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Nenhum projeto ainda
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Comece criando seu primeiro projeto. Faça upload de plantas, documentos ou dados do seu projeto.
          </p>
          <Button 
            onClick={() => navigate('/upload')}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Criar Primeiro Projeto
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Indicador de Drag & Drop Ativo */}
      {dragState.isDragging && (
        <div className="fixed top-4 right-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-pulse">🎯</div>
            <span className="text-sm font-medium">Arraste para reordenar</span>
          </div>
        </div>
      )}

      {/* Grid de Projetos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {recentProjects.map((project, index) => (
          <DragDropProjectCard
            key={project.id}
            project={project}
            index={index}
            isDragging={dragState.draggedProject?.id === project.id}
            dragOverIndex={dragState.dragOverIndex}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardRecentProjects;

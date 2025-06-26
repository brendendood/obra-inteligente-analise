
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Folder, Plus, GripVertical } from 'lucide-react';
import { EnhancedSkeleton } from '@/components/ui/enhanced-skeleton';
import { ProjectCard } from './ProjectCard';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import { useToast } from '@/hooks/use-toast';
import { DropIndicator } from '@/components/ui/DropIndicator';

interface DashboardRecentProjectsProps {
  projects: any[];
  isLoading: boolean;
}

const DashboardRecentProjects = ({ projects, isLoading }: DashboardRecentProjectsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orderedProjects, setOrderedProjects] = useState(projects);

  // Configurar drag & drop
  const {
    isDragging,
    getDragItemProps,
    getDropZoneProps,
    getDropIndicatorProps,
  } = useDragAndDrop({
    items: orderedProjects,
    onReorder: (reorderedProjects) => {
      setOrderedProjects(reorderedProjects);
      // Salvar ordem no localStorage
      const projectOrder = reorderedProjects.map(p => p.id);
      localStorage.setItem('dashboardProjectOrder', JSON.stringify(projectOrder));
      
      toast({
        title: "✅ Ordem atualizada",
        description: "A nova ordem dos projetos foi salva.",
      });
    },
    keyExtractor: (project) => project.id,
  });

  // Atualizar projetos ordenados quando props mudarem
  useState(() => {
    const savedOrder = localStorage.getItem('dashboardProjectOrder');
    if (savedOrder && projects.length > 0) {
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
  });

  if (isLoading) {
    return (
      <div className="w-full min-w-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
          {[...Array(6)].map((_, i) => (
            <EnhancedSkeleton key={i} variant="card" className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const recentProjects = orderedProjects.slice(0, 6);

  if (recentProjects.length === 0) {
    return (
      <div className="text-center py-12 w-full">
        <div className="bg-gray-50 rounded-2xl p-8 sm:p-12 border-2 border-dashed border-gray-200 w-full">
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
            style={{ fontSize: '16px' }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Criar Primeiro Projeto
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0">
      {/* Grid de Projetos Arrastáveis */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
        {recentProjects.map((project, index) => (
          <div key={project.id} className="relative group w-full min-w-0">
            {/* Drop Indicator */}
            <DropIndicator {...getDropIndicatorProps(index)} className="mb-4" />
            
            {/* Project Card Container Arrastável */}
            <div
              className={`relative transition-all duration-300 w-full min-w-0 ${
                isDragging ? 'select-none' : ''
              }`}
              {...getDragItemProps(project, index)}
              {...getDropZoneProps(index)}
            >
              {/* Grip Handle - Visível apenas no hover */}
              <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="bg-white/90 backdrop-blur-sm rounded-md p-1 shadow-sm border border-gray-200">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Project Card */}
              <ProjectCard
                project={project}
                index={index}
                draggedItem={null}
                onDragStart={() => {}}
                onDragOver={() => {}}
                onDrop={() => {}}
              />
            </div>
            
            {/* Drop Indicator Final */}
            {index === recentProjects.length - 1 && (
              <DropIndicator {...getDropIndicatorProps(recentProjects.length)} className="mt-4" />
            )}
          </div>
        ))}
      </div>

      {/* Indicador de Drag & Drop Ativo */}
      {isDragging && (
        <div className="fixed top-4 right-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <GripVertical className="h-4 w-4" />
            <span className="text-sm font-medium">Arrastar para reordenar</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardRecentProjects;

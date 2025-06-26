
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Folder, Plus } from 'lucide-react';
import { EnhancedSkeleton } from '@/components/ui/enhanced-skeleton';
import { ProjectCard } from './ProjectCard';

interface DashboardRecentProjectsProps {
  projects: any[];
  isLoading: boolean;
}

const DashboardRecentProjects = ({ projects, isLoading }: DashboardRecentProjectsProps) => {
  const navigate = useNavigate();
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  if (isLoading) {
    return (
      <Card className="border border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gray-900">
            <Folder className="h-5 w-5" />
            <span>Projetos Recentes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <EnhancedSkeleton key={i} variant="card" className="h-64" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentProjects = projects.slice(0, 6);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    setDraggedItem(null);
  };

  return (
    <Card className="border border-gray-200 bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-gray-900">
            <Folder className="h-5 w-5 text-blue-600" />
            <span>Projetos Recentes</span>
          </CardTitle>
          {projects.length > 6 && (
            <Button 
              variant="ghost" 
              onClick={() => navigate('/projetos')}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              Ver todos
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {recentProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                draggedItem={draggedItem}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum projeto ainda</h3>
            <p className="text-gray-500 mb-6">Comece criando seu primeiro projeto</p>
            <Button 
              onClick={() => navigate('/upload')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Projeto
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardRecentProjects;

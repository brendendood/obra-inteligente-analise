
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Folder } from 'lucide-react';
import { EnhancedSkeleton } from '@/components/ui/enhanced-skeleton';
import { useIsMobile } from '@/hooks/use-mobile';
import { ProjectCard } from './ProjectCard';
import { EmptyProjectsState } from './EmptyProjectsState';

interface DashboardRecentProjectsProps {
  projects: any[];
  isLoading: boolean;
}

const DashboardRecentProjects = ({ projects, isLoading }: DashboardRecentProjectsProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gray-900">
            <Folder className="h-5 w-5" />
            <span>Projetos Recentes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <EnhancedSkeleton key={i} variant="card" className="h-48" />
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
    if (draggedItem === null) return;
    
    // Aqui você implementaria a lógica de reordenação
    console.log(`Movendo projeto do índice ${draggedItem} para ${dropIndex}`);
    setDraggedItem(null);
  };

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-gray-900">
            <Folder className="h-5 w-5 text-blue-600" />
            <span>Projetos Recentes</span>
          </CardTitle>
          {projects.length > 6 && (
            <Button 
              variant="ghost" 
              onClick={() => navigate('/obras')}
              className="text-blue-600 hover:text-blue-700"
            >
              Ver todos
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {recentProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          <EmptyProjectsState />
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardRecentProjects;

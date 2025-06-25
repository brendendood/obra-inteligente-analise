
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FolderOpen } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  total_area?: number;
  created_at: string;
}

interface RecentProjectsProps {
  projects: Project[];
}

export const RecentProjects = ({ projects }: RecentProjectsProps) => {
  const navigate = useNavigate();

  if (projects.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Projetos Recentes</h2>
        <Button 
          variant="outline" 
          onClick={() => navigate('/obras')}
          className="flex items-center space-x-2"
        >
          <FolderOpen className="h-4 w-4" />
          <span>Ver Todos</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.slice(0, 6).map((project) => (
          <Card 
            key={project.id}
            className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => navigate(`/obra/${project.id}`)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-gray-900 line-clamp-2">
                {project.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {project.total_area && (
                  <p className="text-sm text-gray-600">
                    Área: {project.total_area}m²
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  {new Date(project.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

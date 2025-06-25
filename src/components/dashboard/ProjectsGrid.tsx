
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, BarChart3, ExternalLink, Pin, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Project } from '@/types/project';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ProjectsGridProps {
  projects: Project[];
}

const ProjectsGrid = ({ projects }: ProjectsGridProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pinnedProjects, setPinnedProjects] = useState<string[]>([]);

  const handlePinProject = (projectId: string) => {
    setPinnedProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
    toast({
      title: pinnedProjects.includes(projectId) ? "📌 Projeto despinado" : "📌 Projeto pinado",
      description: "Projetos pinados aparecem no topo da lista.",
    });
  };

  const handleDeleteProject = (projectId: string, projectName: string) => {
    // TODO: Implementar exclusão real do projeto
    toast({
      title: "🗑️ Funcionalidade em desenvolvimento",
      description: `A exclusão do projeto "${projectName}" será implementada em breve.`,
    });
  };

  const sortedProjects = [...projects].sort((a, b) => {
    const aIsPinned = pinnedProjects.includes(a.id);
    const bIsPinned = pinnedProjects.includes(b.id);
    
    if (aIsPinned && !bIsPinned) return -1;
    if (!aIsPinned && bIsPinned) return 1;
    
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Seus Projetos</h2>
        <Button
          onClick={() => navigate('/upload')}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all"
        >
          <FileText className="h-4 w-4 mr-2" />
          Novo Projeto
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProjects.map((project) => (
          <Card 
            key={project.id} 
            className="bg-card border-border hover:shadow-md hover:border-primary/20 transition-all duration-200 group cursor-pointer relative overflow-hidden"
          >
            {pinnedProjects.includes(project.id) && (
              <div className="absolute top-2 right-2 z-10">
                <Pin className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              </div>
            )}
            
            <CardHeader className="pb-3">
              <CardTitle className="text-foreground text-lg group-hover:text-primary transition-colors break-words">
                {project.name}
              </CardTitle>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{project.project_type || 'Projeto'}</span>
                {project.total_area && (
                  <span>{project.total_area}m²</span>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 inline mr-1" />
                Criado em {new Date(project.created_at).toLocaleDateString('pt-BR')}
              </div>
              
              <div className="flex flex-wrap gap-2">
                <span className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs border border-green-200">
                  ✅ Processado
                </span>
                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs border border-blue-200">
                  🤖 IA Ready
                </span>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePinProject(project.id);
                    }}
                    className={`text-muted-foreground hover:text-yellow-500 ${
                      pinnedProjects.includes(project.id) ? 'text-yellow-500' : ''
                    }`}
                  >
                    <Pin className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(project.id, project.name);
                    }}
                    className="text-muted-foreground hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button
                  onClick={() => navigate(`/obra/${project.id}`)}
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-sm hover:shadow-md transition-all"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Abrir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProjectsGrid;


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Calendar, Eye, CheckCircle, Clock, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Project {
  id: string;
  name: string;
  analysis_data?: any;
  project_type?: string;
  total_area?: number;
  created_at: string;
}

interface ProjectCardProps {
  project: Project;
  editingProject: string | null;
  editName: string;
  onStartEdit: (projectId: string, currentName: string) => void;
  onSaveEdit: (projectId: string, newName: string) => void;
  onCancelEdit: () => void;
  onEditNameChange: (name: string) => void;
}

const ProjectCard = ({
  project,
  editingProject,
  editName,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onEditNameChange
}: ProjectCardProps) => {
  const navigate = useNavigate();

  const getStatusBadge = (project: Project) => {
    if (project.analysis_data) {
      return (
        <Badge className="bg-green-600 text-white">
          <CheckCircle className="h-3 w-3 mr-1" />
          Concluído
        </Badge>
      );
    }
    return (
      <Badge className="bg-orange-600 text-white">
        <Clock className="h-3 w-3 mr-1" />
        Em análise
      </Badge>
    );
  };

  return (
    <Card className="shadow-lg border border-gray-700 hover:shadow-xl transition-all duration-300 bg-gray-800">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {editingProject === project.id ? (
              <div className="space-y-2">
                <Input
                  value={editName}
                  onChange={(e) => onEditNameChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onSaveEdit(project.id, editName);
                    }
                    if (e.key === 'Escape') {
                      onCancelEdit();
                    }
                  }}
                  autoFocus
                  className="text-lg font-bold bg-gray-700 border-gray-600 text-white"
                />
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => onSaveEdit(project.id, editName)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Salvar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onCancelEdit}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="group">
                <CardTitle className="text-lg mb-2 line-clamp-2 cursor-pointer flex items-center text-white">
                  {project.name}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 hover:bg-gray-700 text-gray-300"
                    onClick={() => onStartEdit(project.id, project.name)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                </CardTitle>
              </div>
            )}
            
            <div className="space-y-2">
              {getStatusBadge(project)}
              {project.project_type && (
                <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                  {project.project_type}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {project.total_area && (
            <div className="flex items-center text-sm text-gray-300">
              <span className="font-medium">Área: {project.total_area}m²</span>
            </div>
          )}
          
          <div className="flex items-center text-sm text-gray-300">
            <Calendar className="h-4 w-4 mr-2" />
            {new Date(project.created_at).toLocaleDateString('pt-BR')}
          </div>
          
          <Button 
            onClick={() => navigate(`/obra/${project.id}`)}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white border border-gray-600"
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver Obra
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;


import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Eye, 
  Calendar, 
  Ruler, 
  Building, 
  ArrowRight,
  Folder
} from 'lucide-react';
import { EnhancedSkeleton } from '@/components/ui/enhanced-skeleton';
import { useIsMobile } from '@/hooks/use-mobile';

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
              <div
                key={project.id}
                draggable={!isMobile}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className={`group relative bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer ${
                  !isMobile ? 'hover:scale-[1.02]' : ''
                } ${draggedItem === index ? 'opacity-50' : ''}`}
                onClick={() => navigate(`/projeto/${project.id}`)}
              >
                {/* Header do projeto */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate text-sm">
                      {project.name}
                    </h3>
                    <div className="flex items-center space-x-1 mt-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {new Date(project.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                  
                  {/* Badge de status - apenas ícone no mobile */}
                  <Badge className="bg-green-100 text-green-700 border-green-200 shrink-0">
                    {isMobile ? (
                      <span className="text-xs">✓</span>
                    ) : (
                      'Analisado'
                    )}
                  </Badge>
                </div>

                {/* Informações do projeto */}
                <div className="space-y-2 mb-4">
                  {project.total_area && (
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <Ruler className="h-3 w-3" />
                      <span>{project.total_area}m²</span>
                    </div>
                  )}
                  {project.project_type && (
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <Building className="h-3 w-3" />
                      <span>{project.project_type}</span>
                    </div>
                  )}
                </div>

                {/* Ações rápidas */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/projeto/${project.id}/orcamento`);
                    }}
                    className="flex items-center justify-center space-x-1 py-2 px-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-xs"
                  >
                    {isMobile ? (
                      <span>💰</span>
                    ) : (
                      <>
                        <span>💰</span>
                        <span>Orçamento</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/projeto/${project.id}/assistente`);
                    }}
                    className="flex items-center justify-center space-x-1 py-2 px-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-xs"
                  >
                    {isMobile ? (
                      <span>🤖</span>
                    ) : (
                      <>
                        <span>🤖</span>
                        <span>IA</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Indicador de hover */}
                <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Folder className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum projeto ainda</h3>
            <p className="text-gray-500 mb-6">Comece criando seu primeiro projeto.</p>
            <Button 
              onClick={() => navigate('/upload')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              + Novo Projeto
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardRecentProjects;

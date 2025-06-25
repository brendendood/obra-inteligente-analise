
import { useNavigate } from 'react-router-dom';
import { ProjectCardEnhanced } from '@/components/ui/project-card-enhanced';
import { Plus } from 'lucide-react';

interface DashboardRecentProjectsProps {
  projects: any[];
  isLoading: boolean;
}

const DashboardRecentProjects = ({ projects, isLoading }: DashboardRecentProjectsProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return null; // Loading handled by parent
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Nenhum projeto ainda
          </h3>
          <p className="text-gray-600 mb-6">
            Comece enviando seu primeiro projeto PDF para análise com IA MadenAI.
          </p>
          <button 
            onClick={() => navigate('/upload')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 mx-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Enviar Primeiro Projeto</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Projetos Recentes</h2>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            Última atualização: {new Date().toLocaleTimeString('pt-BR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
          <button 
            onClick={() => navigate('/projetos')}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 hover:underline"
          >
            Ver todos os {projects.length} projetos →
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {projects.slice(0, 8).map((project, index) => (
          <div
            key={project.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <ProjectCardEnhanced
              project={project}
              showQuickActions={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardRecentProjects;


import { Button } from '@/components/ui/button';
import { Plus, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProjectsEmptyStateProps {
  hasProjects: boolean;
}

const ProjectsEmptyState = ({ hasProjects }: ProjectsEmptyStateProps) => {
  const navigate = useNavigate();

  return (
    <div className="text-center py-16 animate-fade-in">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building2 className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {hasProjects ? 'Nenhum resultado na busca' : 'Nenhum projeto encontrado'}
        </h3>
        <p className="text-gray-600 mb-6">
          {hasProjects 
            ? 'Tente ajustar os filtros de busca ou criar um novo projeto.'
            : 'Comece enviando seu primeiro projeto PDF para análise com IA MadenAI.'
          }
        </p>
        <Button 
          onClick={() => navigate('/upload')}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          size="lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          {hasProjects ? 'Novo Projeto' : 'Enviar Primeiro Projeto'}
        </Button>
      </div>
    </div>
  );
};

export default ProjectsEmptyState;

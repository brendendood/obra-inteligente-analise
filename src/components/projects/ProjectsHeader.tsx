
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Plus, FolderOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProjectsHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <FolderOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Meus Projetos
            </h1>
            <p className="text-gray-600">
              Gerencie todos os seus projetos arquitetônicos em um só lugar
            </p>
          </div>
        </div>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              onClick={() => navigate('/upload')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
              size="lg"
            >
              <Plus className="h-5 w-5" />
              <span>Novo Projeto</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Enviar novo projeto PDF para análise</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default ProjectsHeader;

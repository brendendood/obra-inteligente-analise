
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProjectsHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Minhas Obras
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Gerencie todos os seus projetos arquitetônicos. Arraste os cards para reorganizar.
        </p>
      </div>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            onClick={() => navigate('/upload')}
            className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Nova Obra</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Enviar novo projeto PDF</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default ProjectsHeader;

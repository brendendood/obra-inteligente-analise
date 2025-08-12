
import { Button } from '@/components/ui/button';
import { Plus, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProjectsPageHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Meus Projetos</h1>
            <p className="text-gray-600">
              Gerencie e analise seus projetos com inteligência artificial MadeAI
            </p>
          </div>
        </div>
        
        <Button 
          onClick={() => navigate('/upload')}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
          size="lg"
        >
          <Plus className="h-5 w-5" />
          <span>Novo Projeto</span>
        </Button>
      </div>
    </div>
  );
};

export default ProjectsPageHeader;

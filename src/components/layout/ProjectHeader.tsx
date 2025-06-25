
import { ArrowLeft, Building2, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';

interface ProjectHeaderProps {
  projectName: string;
  projectId: string;
  currentSection?: string;
}

export const ProjectHeader = ({ projectName, projectId, currentSection }: ProjectHeaderProps) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    console.log('🔙 HEADER: Voltando para projetos');
    navigate('/projetos');
  };

  const handleGoToDashboard = () => {
    console.log('🏠 HEADER: Indo para dashboard');
    navigate('/painel');
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGoBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar para Projetos</span>
          </Button>
          
          <Separator orientation="vertical" className="h-6" />
          
          <div className="flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-gray-900 text-lg">{projectName}</span>
          </div>
          
          {currentSection && currentSection !== 'Visão Geral' && (
            <>
              <Separator orientation="vertical" className="h-6" />
              <span className="text-gray-600 font-medium">{currentSection}</span>
            </>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleGoToDashboard}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <Home className="h-4 w-4" />
          <span className="hidden sm:inline">Dashboard</span>
        </Button>
      </div>
    </div>
  );
};

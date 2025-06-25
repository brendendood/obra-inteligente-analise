
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Building2, Calendar, Ruler } from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';
import { useContextualNavigation } from '@/hooks/useContextualNavigation';

interface ProjectHeaderProps {
  projectName: string;
  projectId: string;
  currentSection: string;
}

export const ProjectHeader = ({ projectName, projectId, currentSection }: ProjectHeaderProps) => {
  const { currentProject } = useProject();
  const { goBack } = useContextualNavigation();

  return (
    <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 p-6 sticky top-0 z-20">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex items-start space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={goBack}
            className="flex-shrink-0 hover:bg-blue-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Building2 className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">{projectName}</h1>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
              {currentProject?.total_area && (
                <div className="flex items-center space-x-1">
                  <Ruler className="h-4 w-4" />
                  <span>Área: {currentProject.total_area}m²</span>
                </div>
              )}
              
              {currentProject?.created_at && (
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Criado: {new Date(currentProject.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
              )}
              
              <Badge className={`${
                currentProject?.analysis_data 
                  ? 'bg-green-100 text-green-700 border-green-200' 
                  : 'bg-yellow-100 text-yellow-700 border-yellow-200'
              }`}>
                {currentProject?.analysis_data ? '✅ Analisado' : '⏳ Processando'}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-gray-500">Seção Atual</p>
          <p className="font-semibold text-gray-900">{currentSection}</p>
        </div>
      </div>
    </div>
  );
};

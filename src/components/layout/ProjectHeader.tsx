
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Building2 } from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';
import { useContextualNavigation } from '@/hooks/useContextualNavigation';

interface ProjectHeaderProps {
  projectName: string;
  projectId: string;
  currentSection: string;
  sectionSelector?: ReactNode;
}

export const ProjectHeader = ({ projectName, projectId, currentSection, sectionSelector }: ProjectHeaderProps) => {
  const { currentProject } = useProject();
  const { goBack } = useContextualNavigation();

  return (
    <div className="bg-apple-gray-50 border-b border-apple-gray-200 sticky top-0 z-20">
      <div className="p-6 space-y-4">
        {/* Breadcrumb e Voltar */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={goBack}
            className="text-apple-gray-600 hover:text-apple-gray-900 hover:bg-white/60 h-10 px-4 rounded-xl font-medium transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>

        {/* Título do Projeto e Seção Atual */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{projectName}</h1>
              <p className="text-sm text-gray-500">Seção Atual: <span className="font-medium text-gray-700">{currentSection}</span></p>
            </div>
          </div>
          
          {/* Ações do Header (Seletor de seção + Status) */}
          <div className="flex items-center gap-3">
            {sectionSelector}
            {currentProject && (
              <Badge 
                className={`${
                  currentProject?.analysis_data 
                    ? 'bg-green-50 text-green-700 border-green-200' 
                    : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                } font-medium px-3 py-1.5 rounded-lg`}
              >
                {currentProject?.analysis_data ? '✅ Analisado' : '⏳ Processando'}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

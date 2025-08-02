
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Building2, Calendar, Ruler, CheckCircle, Clock } from 'lucide-react';
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
    <div className="bg-apple-gray-50 border-b border-apple-gray-200 sticky top-0 z-20">
      <div className="p-8 space-y-6">
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

        {/* Informações Principais do Projeto */}
        <div className="space-y-4">
          {/* Título e Ícone */}
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 truncate">{projectName}</h1>
              <p className="text-gray-600 text-sm mt-1">Projeto de construção civil</p>
            </div>
          </div>

          {/* Informações e Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Área */}
            {currentProject?.total_area && (
              <div className="flex items-center space-x-4 p-4 bg-white rounded-2xl border border-apple-gray-100 shadow-sm">
                <div className="p-3 bg-apple-gray-50 rounded-xl">
                  <Ruler className="h-5 w-5 text-apple-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-apple-gray-500 font-medium">Área Total</p>
                  <p className="text-xl font-semibold text-apple-gray-900">{currentProject.total_area}m²</p>
                </div>
              </div>
            )}

            {/* Data de Criação */}
            {currentProject?.created_at && (
              <div className="flex items-center space-x-4 p-4 bg-white rounded-2xl border border-apple-gray-100 shadow-sm">
                <div className="p-3 bg-apple-gray-50 rounded-xl">
                  <Calendar className="h-5 w-5 text-apple-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-apple-gray-500 font-medium">Criado em</p>
                  <p className="text-xl font-semibold text-apple-gray-900">
                    {new Date(currentProject.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            )}

            {/* Status de Análise */}
            <div className="flex items-center space-x-4 p-4 bg-white rounded-2xl border border-apple-gray-100 shadow-sm">
              <div className="p-3 bg-apple-gray-50 rounded-xl">
                {currentProject?.analysis_data ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <Clock className="h-5 w-5 text-yellow-600" />
                )}
              </div>
              <div>
                <p className="text-sm text-apple-gray-500 font-medium">Status</p>
                <Badge 
                  className={`${
                    currentProject?.analysis_data 
                      ? 'bg-green-50 text-green-700 border-green-200' 
                      : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                  } font-medium px-3 py-1 rounded-lg`}
                >
                  {currentProject?.analysis_data ? 'Ativo' : 'Processando'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Seção Atual */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-500 font-medium">Seção Atual</p>
              <p className="text-lg font-semibold text-gray-900">{currentSection}</p>
            </div>
            
            {currentProject?.analysis_data && (
              <div className="text-right">
                <p className="text-xs text-green-600 font-medium">Projeto Pronto</p>
                <p className="text-sm text-gray-600">Todas as ferramentas disponíveis</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


import { useProjectDetail } from '@/contexts/ProjectDetailContext';
import { useProjectNavigation } from '@/hooks/useProjectNavigation';
import { useParams } from 'react-router-dom';
import ProjectActionCard from './ProjectActionCard';
import { Calculator, Calendar, Bot, FileText, Building2, Ruler, Clock } from 'lucide-react';
import { ProjectAnalysisExporter } from './ProjectAnalysisExporter';
import { InlineUnifiedLoading } from '@/components/ui/unified-loading';

export const ProjectOverview = () => {
  const { project } = useProjectDetail();
  const { navigateToProjectSection } = useProjectNavigation();
  const { projectId } = useParams<{ projectId: string }>();

  if (!project) {
    return <InlineUnifiedLoading />;
  }

  const handleNavigateToSection = (section: 'orcamento' | 'cronograma' | 'assistente' | 'documentos') => {
    if (projectId) {
      navigateToProjectSection(projectId, section);
    }
  };

  return (
    <div className="space-y-8">
      {/* Informações do Projeto */}
      <div className="bg-white rounded-2xl shadow-sm border border-apple-gray-100 p-6 sm:p-8 mx-2 sm:mx-0">
        <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-6 sm:mb-8">
          <div className="p-3 sm:p-4 bg-apple-blue/10 rounded-2xl flex-shrink-0">
            <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-apple-blue" />
          </div>
          <div className="flex-1 w-full">
            <h1 className="text-2xl sm:text-3xl font-semibold text-apple-gray-900 mb-3 break-words">{project.name}</h1>
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-6 text-apple-gray-600">
              {project.total_area && (
                <div className="flex items-center space-x-2">
                  <Ruler className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base">Área: {project.total_area}m²</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span className="font-medium text-sm sm:text-base">Criado: {new Date(project.created_at).toLocaleDateString('pt-BR')}</span>
              </div>
              <div className={`inline-flex px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium self-start ${
                project.analysis_data 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
              }`}>
                {project.analysis_data ? '✅ Analisado' : '⏳ Processando'}
              </div>
            </div>
          </div>
        </div>

        {project.analysis_data && (
          <div className="bg-apple-blue/5 border border-apple-blue/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-apple-blue mb-3">
              Projeto Pronto para Análise
            </h3>
              <ProjectAnalysisExporter project={project} />
          </div>
        )}
      </div>

      {/* Cards de Funcionalidades */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 px-1 sm:px-0">
        <ProjectActionCard
          icon={Calculator}
          title="Orçamento SINAPI"
          description="Gere orçamentos detalhados baseados na tabela SINAPI oficial com custos atualizados para seu projeto específico."
          onClick={() => handleNavigateToSection('orcamento')}
          disabled={!project.analysis_data}
          className="bg-white border border-apple-gray-100 rounded-2xl hover:border-green-200 hover:shadow-sm transition-all duration-200 hover:scale-[1.02]"
        />

        <ProjectActionCard
          icon={Calendar}
          title="Cronograma Inteligente"
          description="Visualize o cronograma otimizado das etapas da obra com prazos realistas e dependências entre tarefas."
          onClick={() => handleNavigateToSection('cronograma')}
          disabled={!project.analysis_data}
          className="bg-white border border-apple-gray-100 rounded-2xl hover:border-blue-200 hover:shadow-sm transition-all duration-200 hover:scale-[1.02]"
        />

        <ProjectActionCard
          icon={Bot}
          title="Assistente IA Especializado"
          description="Converse com nossa IA técnica que conhece todos os detalhes do seu projeto para tirar dúvidas específicas."
          onClick={() => handleNavigateToSection('assistente')}
          disabled={!project.analysis_data}
          className="bg-white border border-apple-gray-100 rounded-2xl hover:border-purple-200 hover:shadow-sm transition-all duration-200 hover:scale-[1.02]"
        />

        <ProjectActionCard
          icon={FileText}
          title="Documentos Técnicos"
          description="Acesse relatórios, plantas processadas e documentos gerados automaticamente para seu projeto."
          onClick={() => handleNavigateToSection('documentos')}
          disabled={!project.analysis_data}
          className="bg-white border border-apple-gray-100 rounded-2xl hover:border-orange-200 hover:shadow-sm transition-all duration-200 hover:scale-[1.02]"
        />
      </div>

      {!project.analysis_data && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <InlineUnifiedLoading text="Processando..." />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-yellow-900 mb-2">
                Processamento em Andamento
              </h3>
              <p className="text-yellow-800 text-lg">
                Estamos analisando seu projeto para liberar todas as funcionalidades. 
                Este processo geralmente leva alguns minutos. As ferramentas serão liberadas automaticamente quando concluído.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

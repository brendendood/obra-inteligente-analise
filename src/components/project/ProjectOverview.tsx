
import { useProjectDetail } from '@/contexts/ProjectDetailContext';
import { useProjectNavigation } from '@/hooks/useProjectNavigation';
import { useParams } from 'react-router-dom';
import ProjectActionCard from './ProjectActionCard';
import { Calculator, Calendar, Bot, FileText, Building2, Ruler, Clock, Hammer } from 'lucide-react';

export const ProjectOverview = () => {
  const { project } = useProjectDetail();
  const { navigateToProjectSection } = useProjectNavigation();
  const { projectId } = useParams<{ projectId: string }>();

  if (!project) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando projeto...</p>
        </div>
      </div>
    );
  }

  const handleNavigateToSection = (section: 'orcamento' | 'cronograma' | 'assistente' | 'documentos') => {
    if (projectId) {
      navigateToProjectSection(projectId, section);
    }
  };

  return (
    <div className="space-y-8">
      {/* Informações do Projeto */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-8">
        <div className="flex items-start space-x-4 mb-6">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Building2 className="h-8 w-8 text-blue-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-600">
              {project.total_area && (
                <div className="flex items-center space-x-2">
                  <Ruler className="h-4 w-4" />
                  <span>Área: {project.total_area}m²</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Criado: {new Date(project.created_at).toLocaleDateString('pt-BR')}</span>
              </div>
              <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                project.analysis_data 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
              }`}>
                {project.analysis_data ? '✅ Analisado' : '⏳ Processando'}
              </div>
            </div>
          </div>
        </div>

        {project.analysis_data && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              🎯 Projeto Pronto para Análise
            </h3>
            <p className="text-blue-800">
              Seu projeto foi processado com sucesso! Agora você pode acessar todas as funcionalidades avançadas: 
              orçamento SINAPI, cronograma inteligente, assistente IA especializado e documentos técnicos.
            </p>
          </div>
        )}
      </div>

      {/* Cards de Funcionalidades */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProjectActionCard
          icon={Calculator}
          title="Orçamento SINAPI"
          description="Gere orçamentos detalhados baseados na tabela SINAPI oficial com custos atualizados para seu projeto específico."
          onClick={() => handleNavigateToSection('orcamento')}
          disabled={!project.analysis_data}
          className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100"
        />

        <ProjectActionCard
          icon={Calendar}
          title="Cronograma Inteligente"
          description="Visualize o cronograma otimizado das etapas da obra com prazos realistas e dependências entre tarefas."
          onClick={() => handleNavigateToSection('cronograma')}
          disabled={!project.analysis_data}
          className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100"
        />

        <ProjectActionCard
          icon={Bot}
          title="Assistente IA Especializado"
          description="Converse com nossa IA técnica que conhece todos os detalhes do seu projeto para tirar dúvidas específicas."
          onClick={() => handleNavigateToSection('assistente')}
          disabled={!project.analysis_data}
          className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100"
        />

        <ProjectActionCard
          icon={FileText}
          title="Documentos Técnicos"
          description="Acesse relatórios, plantas processadas e documentos gerados automaticamente para seu projeto."
          onClick={() => handleNavigateToSection('documentos')}
          disabled={!project.analysis_data}
          className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100"
        />
      </div>

      {!project.analysis_data && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="animate-hammer">
                <Hammer className="h-6 w-6 text-orange-500" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-yellow-900 mb-1">
                ⏳ Processamento em Andamento
              </h3>
              <p className="text-yellow-800">
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

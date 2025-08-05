
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
    <div className="bg-background min-h-screen">
      {/* Header Simplificado - Apple Style */}
      <div className="px-6 py-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-medium text-foreground mb-2 tracking-tight">
            {project.name}
          </h1>
          {project.total_area && (
            <p className="text-muted-foreground text-lg">
              {project.total_area}m²
            </p>
          )}
          
          {/* Status Badge Minimalista */}
          <div className="mt-4 inline-flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              project.analysis_data ? 'bg-green-500' : 'bg-yellow-500'
            }`} />
            <span className="text-sm text-muted-foreground">
              {project.analysis_data ? 'Pronto' : 'Processando'}
            </span>
          </div>
        </div>
      </div>

      {/* Cards Grid 2x2 - Apple Minimalista */}
      <div className="px-6 pb-12">
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-2 gap-4">
            <ProjectActionCard
              icon={Calculator}
              title="Orçamento"
              onClick={() => handleNavigateToSection('orcamento')}
              disabled={!project.analysis_data}
              isMinimal={true}
            />

            <ProjectActionCard
              icon={Calendar}
              title="Cronograma"
              onClick={() => handleNavigateToSection('cronograma')}
              disabled={!project.analysis_data}
              isMinimal={true}
            />

            <ProjectActionCard
              icon={Bot}
              title="Assistente IA"
              onClick={() => handleNavigateToSection('assistente')}
              disabled={!project.analysis_data}
              isMinimal={true}
            />

            <ProjectActionCard
              icon={FileText}
              title="Documentos"
              onClick={() => handleNavigateToSection('documentos')}
              disabled={!project.analysis_data}
              isMinimal={true}
            />
          </div>
        </div>
      </div>

      {/* Processing State - Discreto */}
      {!project.analysis_data && (
        <div className="px-6">
          <div className="max-w-md mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-muted rounded-full">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse mr-2" />
              <span className="text-sm text-muted-foreground">
                Analisando projeto...
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

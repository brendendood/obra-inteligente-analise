
import { Project } from '@/types/project';
import { AdvancedMetricsCards } from './AdvancedMetricsCards';
import { EnhancedProjectsSection } from './EnhancedProjectsSection';
import { QuickActions } from './QuickActions';
import { RecentActivity } from './RecentActivity';
import { EmptyProjectsState } from './EmptyProjectsState';

interface DashboardContentProps {
  stats: any;
  projects: Project[];
  isDataLoading: boolean;
}

const DashboardContent = ({ stats, projects, isDataLoading }: DashboardContentProps) => {
  if (isDataLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return <EmptyProjectsState />;
  }

  return (
    <div className="space-y-8 w-full">
      {/* Informações sobre métricas - sempre visível */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <div className="text-blue-600 text-lg">ℹ️</div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">
              Sobre as Métricas do Dashboard
            </h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• <strong>N/D (Não Disponível):</strong> Aparece quando não há projetos suficientes com os dados necessários</p>
              <p>• <strong>Custo/m² e Duração:</strong> Calculados apenas com projetos que foram processados pela IA</p>
              <p>• <strong>Análise de Risco:</strong> Baseada em projetos pendentes, orçamentos altos e cronogramas apertados</p>
              <p>• <strong>Dica:</strong> Faça upload e processe mais projetos para ver métricas mais precisas!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas Avançadas */}
      <AdvancedMetricsCards projects={projects} />

      {/* Grid de Conteúdo Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Coluna Esquerda - Projetos (2/3 do espaço) */}
        <div className="lg:col-span-2 space-y-6">
          <EnhancedProjectsSection 
            projects={projects} 
            stats={stats}
          />
        </div>

        {/* Coluna Direita - Ações e Atividades (1/3 do espaço) */}
        <div className="space-y-6">
          <QuickActions />
          <RecentActivity projects={projects} />
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;

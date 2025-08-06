
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { Target, Calendar } from 'lucide-react';

interface ProjectStatusCardProps {
  projectStatus: {
    projectsWithBudget: number;
    lastSubmissionDate: string | null;
    totalProjects: number;
  };
}

export const ProjectStatusCard = ({ projectStatus }: ProjectStatusCardProps) => {
  const budgetPercentage = projectStatus.totalProjects > 0 
    ? Math.round((projectStatus.projectsWithBudget / projectStatus.totalProjects) * 100)
    : 0;

  const getStatusColor = (value: number) => {
    if (value >= 80) return 'text-green-600';
    if (value >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const tooltipContent = (
    <div className="space-y-3">
      <div>
        <strong className="text-gray-800 block mb-1">STATUS DOS PROJETOS</strong>
        <span className="text-sm">Como Interpretar:</span>
      </div>
      
      <div className="space-y-2 text-sm">
        <div>
          <strong className="text-gray-800">• PROJETOS COM ORÇAMENTO:</strong>
          <span className="ml-1">Quantos projetos possuem orçamento aprovado e registrado no sistema.</span>
        </div>
        
        <div>
          <strong className="text-gray-800">• ÚLTIMA SUBMISSÃO:</strong>
          <span className="ml-1">Data do último projeto enviado para análise na plataforma.</span>
        </div>
        
        <div>
          <strong className="text-gray-800">• TAXA DE CONCLUSÃO:</strong>
          <span className="ml-1">Percentual de projetos que possuem orçamento completo em relação ao total.</span>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="group relative overflow-hidden bg-gradient-to-br from-white via-orange-50/30 to-amber-50/50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="relative pb-3 sm:pb-4">
        <CardTitle className="text-sm sm:text-base md:text-lg font-bold text-gray-900 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="p-1.5 sm:p-2 bg-orange-100 rounded-lg flex-shrink-0">
              <Target className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-orange-600" />
            </div>
            <span className="truncate">Status</span>
          </div>
          <InfoTooltip content={tooltipContent} />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative space-y-3 sm:space-y-4 pt-0">
        {/* Porcentagem de Conclusão */}
        <div className="text-center">
          <div className="relative p-3 sm:p-4 md:p-5 bg-white/80 backdrop-blur-sm rounded-xl border border-orange-200/60 shadow-sm hover:shadow-md transition-all duration-200">
            <div className={`text-2xl sm:text-3xl md:text-4xl font-black mb-1 sm:mb-2 tracking-tight leading-tight ${getStatusColor(budgetPercentage)}`}>
              {budgetPercentage}%
            </div>
            <div className="text-xs sm:text-sm font-medium text-gray-600 leading-tight">Conclusão Orçamentos</div>
          </div>
        </div>

        {/* Grid de informações */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {/* Projetos com Orçamento */}
          <div className="text-center">
            <div className="relative p-2 sm:p-3 md:p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-green-200/60 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-green-600 mb-1 tracking-tight leading-tight">
                {projectStatus.projectsWithBudget}
              </div>
              <div className="text-xs font-medium text-gray-600 leading-tight">Com Orçamento</div>
            </div>
          </div>

          {/* Última Submissão */}
          <div className="text-center">
            <div className="relative p-2 sm:p-3 md:p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-blue-200/60 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="text-xs sm:text-sm md:text-base font-black text-blue-600 mb-1 tracking-tight leading-tight">
                {projectStatus.lastSubmissionDate 
                  ? new Date(projectStatus.lastSubmissionDate).toLocaleDateString('pt-BR', { 
                      day: '2-digit', 
                      month: '2-digit' 
                    })
                  : 'Nenhuma'}
              </div>
              <div className="text-xs font-medium text-gray-600 leading-tight">Última Submissão</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

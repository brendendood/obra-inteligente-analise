
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { CheckCircle, Calendar, FileText } from 'lucide-react';

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
    <Card className="group relative overflow-hidden bg-gradient-to-br from-white via-orange-50/30 to-amber-50/50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="relative">
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FileText className="h-6 w-6 text-orange-600" />
            </div>
            <span>Status Projetos</span>
          </div>
          <InfoTooltip content={tooltipContent} />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative space-y-4">
        {/* Primeira linha - Taxa de Conclusão (destaque) */}
        <div className="relative p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-200/60 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-4xl font-black ${getStatusColor(budgetPercentage)} mb-1 tracking-tight`}>
                {budgetPercentage}%
              </div>
              <div className="text-sm font-medium text-gray-600">Taxa de Conclusão</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                {projectStatus.projectsWithBudget}
              </div>
              <div className="text-xs text-gray-500">com orçamento</div>
            </div>
          </div>
        </div>

        {/* Segunda linha - Última Data de Envio */}
        <div className="relative p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-orange-200/60 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold text-orange-600 mb-1">
                {projectStatus.lastSubmissionDate 
                  ? new Date(projectStatus.lastSubmissionDate).toLocaleDateString('pt-BR', { 
                      day: '2-digit', 
                      month: '2-digit',
                      year: '2-digit'
                    })
                  : 'N/D'}
              </div>
              <div className="text-xs font-medium text-gray-600">Última Data de Envio</div>
            </div>
            <Calendar className="h-6 w-6 text-orange-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

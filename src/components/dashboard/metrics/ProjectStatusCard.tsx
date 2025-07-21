
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
    <Card className="border border-gray-200 shadow-sm bg-white hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <FileText className="h-5 w-5 text-orange-600" />
          <span className="whitespace-nowrap">Status Projetos</span>
          <InfoTooltip content={tooltipContent} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {/* Projetos com Orçamento */}
          <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {projectStatus.projectsWithBudget}
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center space-x-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Projetos com Orçamento</span>
            </div>
          </div>

          {/* Última Data de Envio */}
          <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {projectStatus.lastSubmissionDate 
                ? new Date(projectStatus.lastSubmissionDate).toLocaleDateString('pt-BR', { 
                    day: '2-digit', 
                    month: '2-digit',
                    year: '2-digit'
                  })
                : 'N/D'}
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center space-x-1">
              <Calendar className="h-4 w-4 text-orange-500" />
              <span>Última Data de Envio</span>
            </div>
          </div>

          {/* Taxa de Conclusão */}
          <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
            <div className={`text-3xl font-bold ${getStatusColor(budgetPercentage)} mb-2`}>
              {budgetPercentage}%
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center space-x-1">
              <FileText className="h-4 w-4 text-purple-500" />
              <span>Taxa de Conclusão</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { MetricTile } from '@/components/ui/metric-tile';
import { CheckCircle, Calendar, FileText, TrendingUp } from 'lucide-react';

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
    <Card className="rounded-2xl border bg-card text-card-foreground shadow-sm">
      <CardHeader>
        <CardTitle className="font-semibold tracking-tight flex items-center space-x-2">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <span className="whitespace-nowrap">Status Projetos</span>
          <InfoTooltip content={tooltipContent} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <MetricTile
            title="Projetos com Orçamento"
            value={projectStatus.projectsWithBudget}
            icon={CheckCircle}
          />
          <MetricTile
            title="Última Data de Envio"
            value={projectStatus.lastSubmissionDate 
              ? new Date(projectStatus.lastSubmissionDate).toLocaleDateString('pt-BR', { 
                  day: '2-digit', 
                  month: '2-digit',
                  year: '2-digit'
                })
              : 'N/D'}
            icon={Calendar}
          />
          <MetricTile
            title="Taxa de Conclusão"
            value={`${budgetPercentage}%`}
            icon={TrendingUp}
          />
        </div>
      </CardContent>
    </Card>
  );
};


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { MetricTile } from '@/components/ui/metric-tile';
import { Building, Calculator, BarChart3 } from 'lucide-react';

interface ProjectMetricsCardProps {
  projectMetrics: {
    totalArea: number;
    avgCostPerProject: number | null;
    projectCount: number;
  };
}

export const ProjectMetricsCard = ({ projectMetrics }: ProjectMetricsCardProps) => {
  const tooltipContent = (
    <div className="space-y-3">
      <div>
        <strong className="text-gray-800 block mb-1">MÉTRICAS DOS PROJETOS</strong>
        <span className="text-sm">Como Interpretar:</span>
      </div>
      
      <div className="space-y-2 text-sm">
        <div>
          <strong className="text-gray-800">• ÁREA TOTAL:</strong>
          <span className="ml-1">Soma de todos os metros quadrados dos seus projetos. Útil para dimensionar capacidade.</span>
        </div>
        
        <div>
          <strong className="text-gray-800">• CUSTO MÉDIO POR PROJETO:</strong>
          <span className="ml-1">Investimento total dividido pelo número de projetos. Ajuda no planejamento financeiro.</span>
        </div>
        
        <div>
          <strong className="text-gray-800">• TOTAL DE PROJETOS:</strong>
          <span className="ml-1">Quantidade total de projetos cadastrados na plataforma.</span>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="rounded-2xl border bg-card text-card-foreground shadow-sm">
      <CardHeader>
        <CardTitle className="font-semibold tracking-tight flex items-center space-x-2">
          <Building className="h-5 w-5 text-muted-foreground" />
          <span className="whitespace-nowrap">Métricas Projetos</span>
          <InfoTooltip content={tooltipContent} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          <MetricTile
            title="Área Total dos Projetos"
            value={`${projectMetrics.totalArea.toLocaleString('pt-BR')} m²`}
            icon={Building}
            className="min-h-[100px]"
          />
          <MetricTile
            title="Custo Médio por Projeto"
            value={projectMetrics.avgCostPerProject 
              ? `R$ ${projectMetrics.avgCostPerProject.toLocaleString('pt-BR')}` 
              : 'N/D'}
            icon={Calculator}
            className="min-h-[100px]"
          />
          <MetricTile
            title="Total de Projetos"
            value={projectMetrics.projectCount}
            icon={BarChart3}
            className="min-h-[100px]"
          />
        </div>
      </CardContent>
    </Card>
  );
};

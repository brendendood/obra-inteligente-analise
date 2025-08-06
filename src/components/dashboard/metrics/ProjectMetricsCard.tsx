
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoTooltip } from '@/components/ui/info-tooltip';
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
    <Card className="border border-gray-200 shadow-sm bg-white hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <Building className="h-5 w-5 text-blue-600" />
          <span className="whitespace-nowrap">Métricas Projetos</span>
          <InfoTooltip content={tooltipContent} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {/* Área Total dos Projetos */}
          <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {projectMetrics.totalArea.toLocaleString('pt-BR')} m²
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center space-x-1">
              <Building className="h-4 w-4 text-blue-500" />
              <span>Área Total dos Projetos</span>
            </div>
          </div>

          {/* Custo Médio por Projeto */}
          <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {projectMetrics.avgCostPerProject 
                ? `R$ ${projectMetrics.avgCostPerProject.toLocaleString('pt-BR')}` 
                : 'N/D'}
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center space-x-1">
              <Calculator className="h-4 w-4 text-green-500" />
              <span>Custo Médio por Projeto</span>
            </div>
          </div>

          {/* Total de Projetos */}
          <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {projectMetrics.projectCount}
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center space-x-1">
              <BarChart3 className="h-4 w-4 text-purple-500" />
              <span>Total de Projetos</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

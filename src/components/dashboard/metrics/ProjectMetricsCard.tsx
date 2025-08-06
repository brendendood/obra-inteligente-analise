
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
    <Card className="group relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-sky-50/50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-sky-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="relative">
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
            <span>Métricas Projetos</span>
          </div>
          <InfoTooltip content={tooltipContent} />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative space-y-4">
        {/* Primeira linha - Área Total */}
        <div className="relative p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-200/60 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-black text-blue-600 mb-1 tracking-tight">
                {projectMetrics.totalArea.toLocaleString('pt-BR')} m²
              </div>
              <div className="text-sm font-medium text-gray-600">Área Total dos Projetos</div>
            </div>
            <Building className="h-8 w-8 text-blue-400" />
          </div>
        </div>

        {/* Segunda linha - Grid de 2 colunas */}
        <div className="grid grid-cols-2 gap-4">
          {/* Custo Médio por Projeto */}
          <div className="text-center">
            <div className="relative p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-green-200/60 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="text-2xl font-black text-green-600 mb-1 tracking-tight">
                {projectMetrics.avgCostPerProject 
                  ? `R$ ${projectMetrics.avgCostPerProject.toLocaleString('pt-BR')}` 
                  : 'N/D'}
              </div>
              <div className="text-xs font-medium text-gray-600">Custo Médio</div>
            </div>
          </div>

          {/* Total de Projetos */}
          <div className="text-center">
            <div className="relative p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-purple-200/60 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="text-2xl font-black text-purple-600 mb-1 tracking-tight">
                {projectMetrics.projectCount}
              </div>
              <div className="text-xs font-medium text-gray-600">Total Projetos</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

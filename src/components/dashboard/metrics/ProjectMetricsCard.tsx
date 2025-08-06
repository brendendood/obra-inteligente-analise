
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
    <Card className="group relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-sky-50/50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-sky-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="relative pb-3 sm:pb-4">
        <CardTitle className="text-sm sm:text-base md:text-lg font-bold text-gray-900 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
              <Building className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-blue-600" />
            </div>
            <span className="truncate">Projetos</span>
          </div>
          <InfoTooltip content={tooltipContent} />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative space-y-3 sm:space-y-4 pt-0">
        {/* Área Total */}
        <div className="relative p-3 sm:p-4 md:p-5 bg-white/80 backdrop-blur-sm rounded-xl border border-blue-200/60 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-blue-600 mb-1 tracking-tight leading-tight">
                {projectMetrics.totalArea.toLocaleString('pt-BR')} m²
              </div>
              <div className="text-xs sm:text-sm font-medium text-gray-600 leading-tight">Área Total</div>
            </div>
            <Building className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-blue-400 flex-shrink-0 ml-2" />
          </div>
        </div>

        {/* Grid de 2 colunas */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {/* Custo Médio por Projeto */}
          <div className="text-center">
            <div className="relative p-2 sm:p-3 md:p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-green-200/60 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-green-600 mb-1 tracking-tight leading-tight">
                {projectMetrics.avgCostPerProject 
                  ? `R$ ${Math.round(projectMetrics.avgCostPerProject / 1000)}k` 
                  : 'N/D'}
              </div>
              <div className="text-xs font-medium text-gray-600 leading-tight">Custo Médio</div>
            </div>
          </div>

          {/* Total de Projetos */}
          <div className="text-center">
            <div className="relative p-2 sm:p-3 md:p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-purple-200/60 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-purple-600 mb-1 tracking-tight leading-tight">
                {projectMetrics.projectCount}
              </div>
              <div className="text-xs font-medium text-gray-600 leading-tight">Total Projetos</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

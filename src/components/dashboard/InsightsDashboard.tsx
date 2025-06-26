import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, TrendingUp, Calendar, Target } from 'lucide-react';
interface InsightsDashboardProps {
  stats: {
    totalProjects: number;
    totalArea: number;
    recentProjects: number;
    processedProjects: number;
    monthlyProjects: number;
    averageArea: number;
    projectsByType: Record<string, number>;
  };
}
export const InsightsDashboard = ({
  stats
}: InsightsDashboardProps) => {
  const growthRate = stats.monthlyProjects > 0 && stats.recentProjects > 0 ? Math.round((stats.recentProjects / 7 * 30 / stats.monthlyProjects - 1) * 100) : 0;
  const processingEfficiency = stats.totalProjects > 0 ? Math.round(stats.processedProjects / stats.totalProjects * 100) : 0;
  return <div className="space-y-6">
      {/* Insights e Análises */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-50 to-slate-50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Activity className="h-5 w-5 text-gray-600" />
            <span>Análise de Desempenho</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">{stats.processedProjects}</div>
              <div className="text-sm text-gray-600">Projetos Analisados</div>
              <div className="text-xs text-green-600 font-medium">{processingEfficiency}% processados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">{stats.averageArea.toLocaleString()}m²</div>
              <div className="text-sm text-gray-600">Área Média</div>
              <div className="text-xs text-gray-500">por projeto</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">{stats.recentProjects}</div>
              <div className="text-sm text-gray-600">Últimos 7 dias</div>
              <div className={`text-xs font-medium ${growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {growthRate >= 0 ? '+' : ''}{growthRate}% vs mês
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-1">{Object.keys(stats.projectsByType || {}).length}</div>
              <div className="text-sm text-gray-600">Tipos Diferentes</div>
              <div className="text-xs text-gray-500">de projetos</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Distribuição por Tipo */}
      {Object.keys(stats.projectsByType || {}).length > 0 && <Card className="border-0 shadow-lg">
          
          
        </Card>}
    </div>;
};
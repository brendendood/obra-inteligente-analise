
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Activity
} from 'lucide-react';

interface InsightsDashboardProps {
  stats: {
    totalProjects: number;
    totalArea: number;
    recentProjects: number;
    timeSaved: number;
    monthlyProjects: number;
    estimatedValue: number;
    aiEfficiency: number;
    projectsByType: Record<string, number>;
  };
}

export const InsightsDashboard = ({ stats }: InsightsDashboardProps) => {
  return (
    <div className="space-y-6">
      {/* Apenas Resumo de Atividade - removendo cards duplicados */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-50 to-slate-50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Activity className="h-5 w-5 text-gray-600" />
            <span>Resumo de Atividade</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">{stats.totalProjects}</div>
              <div className="text-sm text-gray-600">Total de Projetos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">{stats.totalArea.toLocaleString()}m²</div>
              <div className="text-sm text-gray-600">Área Total</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">{stats.timeSaved}h</div>
              <div className="text-sm text-gray-600">Tempo Economizado</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-1">{stats.recentProjects}</div>
              <div className="text-sm text-gray-600">Últimos 7 dias</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

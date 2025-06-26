
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  Building2, 
  Calendar,
  DollarSign,
  Activity,
  Users,
  Target,
  Zap
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
  const insights = [
    {
      title: "Projetos Este Mês",
      value: stats.monthlyProjects,
      description: "Novos projetos criados",
      icon: Calendar,
      gradient: "from-blue-50 to-cyan-50",
      iconColor: "text-blue-600",
      textColor: "text-blue-800",
      valueColor: "text-blue-900"
    },
    {
      title: "Valor Estimado",
      value: `R$ ${(stats.estimatedValue || 0).toLocaleString()}`,
      description: "Valor total dos projetos",
      icon: DollarSign,
      gradient: "from-emerald-50 to-green-50",
      iconColor: "text-emerald-600",
      textColor: "text-emerald-800",
      valueColor: "text-emerald-900"
    },
    {
      title: "Eficiência IA",
      value: `${stats.aiEfficiency || 95}%`,
      description: "Precisão das análises",
      icon: Zap,
      gradient: "from-yellow-50 to-amber-50",
      iconColor: "text-yellow-600",
      textColor: "text-yellow-800",
      valueColor: "text-yellow-900"
    },
    {
      title: "Crescimento",
      value: "+23%",
      description: "vs. mês anterior",
      icon: TrendingUp,
      gradient: "from-pink-50 to-rose-50",
      iconColor: "text-pink-600",
      textColor: "text-pink-800",
      valueColor: "text-pink-900"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <Card key={index} className={`border-0 shadow-md bg-gradient-to-br ${insight.gradient} hover:shadow-lg transition-all duration-200`}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className={`text-sm font-medium ${insight.textColor}`}>
                    {insight.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${insight.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${insight.valueColor} mb-1`}>
                  {insight.value}
                </div>
                <p className={`text-xs ${insight.textColor.replace('800', '600')}`}>
                  {insight.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats Summary */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-50 to-slate-50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Activity className="h-5 w-5 text-gray-600" />
            <span>Resumo de Atividade</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalProjects}</div>
              <div className="text-sm text-gray-600">Total de Projetos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.totalArea.toLocaleString()}m²</div>
              <div className="text-sm text-gray-600">Área Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.timeSaved}h</div>
              <div className="text-sm text-gray-600">Tempo Economizado</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.recentProjects}</div>
              <div className="text-sm text-gray-600">Últimos 7 dias</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

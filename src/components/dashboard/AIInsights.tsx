
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, Target, Lightbulb, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AIInsightsProps {
  projects: any[];
}

export const AIInsights = ({
  projects
}: AIInsightsProps) => {
  const navigate = useNavigate();

  const generateInsights = () => {
    const totalArea = projects.reduce((sum, p) => sum + (p.total_area || 0), 0);
    const averageArea = projects.length > 0 ? Math.round(totalArea / projects.length) : 0;
    const processedCount = projects.filter(p => p.analysis_data).length;

    const insights = [
      {
        icon: TrendingUp,
        title: 'Crescimento Detectado',
        description: `Você teve ${projects.filter(p => {
          const createdAt = new Date(p.created_at);
          const monthAgo = new Date();
          monthAgo.setDate(monthAgo.getDate() - 30);
          return createdAt >= monthAgo;
        }).length} novos projetos este mês`,
        color: 'text-green-600'
      },
      {
        icon: Target,
        title: 'Área Média Otimizada',
        description: `Seus projetos têm média de ${averageArea}m², ideal para análise eficiente`,
        color: 'text-blue-600'
      },
      {
        icon: Lightbulb,
        title: 'Oportunidade',
        description: processedCount < projects.length 
          ? `${projects.length - processedCount} projetos aguardam análise completa`
          : 'Todos os projetos estão analisados! Ótimo trabalho.',
        color: 'text-orange-600'
      }
    ];

    return insights.slice(0, 2);
  };

  const insights = generateInsights();

  return (
    <Card className="border-0 shadow-lg w-full h-full">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="flex items-center space-x-2 text-gray-900 text-lg sm:text-xl">
          <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
          <span>Insights IA</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <div key={index} className="space-y-2 sm:space-y-3">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 p-2 rounded-lg bg-gray-100">
                  <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${insight.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                    {insight.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {insight.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        
        <div className="pt-2 sm:pt-4 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={() => navigate('/assistant')}
            className="w-full justify-center sm:justify-start text-sm sm:text-base"
          >
            <Brain className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Ver Mais Insights</span>
            <span className="sm:hidden">Mais Insights</span>
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

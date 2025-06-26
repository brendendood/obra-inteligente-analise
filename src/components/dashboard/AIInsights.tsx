
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, Target, Lightbulb, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AIInsightsProps {
  projects: any[];
}

export const AIInsights = ({ projects }: AIInsightsProps) => {
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
        description: processedCount < projects.length ? 
          `${projects.length - processedCount} projetos aguardam análise completa` :
          'Todos os projetos estão analisados! Ótimo trabalho.',
        color: 'text-orange-600'
      }
    ];

    return insights.slice(0, 2);
  };

  const insights = generateInsights();

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-gray-900">
          <Brain className="h-5 w-5 text-indigo-600" />
          <span>Insights da IA</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <div key={index} className="p-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200">
                <div className="flex items-start space-x-3">
                  <Icon className={`h-5 w-5 mt-0.5 ${insight.color}`} />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{insight.title}</h4>
                    <p className="text-sm text-gray-600">{insight.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
          
          <div className="pt-4 border-t border-gray-200">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/assistente')}
            >
              <Brain className="h-4 w-4 mr-2" />
              Conversar com IA
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

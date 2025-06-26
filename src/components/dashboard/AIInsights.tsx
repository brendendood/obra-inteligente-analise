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
    const insights = [{
      icon: TrendingUp,
      title: 'Crescimento Detectado',
      description: `Você teve ${projects.filter(p => {
        const createdAt = new Date(p.created_at);
        const monthAgo = new Date();
        monthAgo.setDate(monthAgo.getDate() - 30);
        return createdAt >= monthAgo;
      }).length} novos projetos este mês`,
      color: 'text-green-600'
    }, {
      icon: Target,
      title: 'Área Média Otimizada',
      description: `Seus projetos têm média de ${averageArea}m², ideal para análise eficiente`,
      color: 'text-blue-600'
    }, {
      icon: Lightbulb,
      title: 'Oportunidade',
      description: processedCount < projects.length ? `${projects.length - processedCount} projetos aguardam análise completa` : 'Todos os projetos estão analisados! Ótimo trabalho.',
      color: 'text-orange-600'
    }];
    return insights.slice(0, 2);
  };
  const insights = generateInsights();
  return <Card className="border-0 shadow-lg">
      
      
    </Card>;
};
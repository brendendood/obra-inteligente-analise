
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Brain, TrendingUp, MessageSquare, ThumbsUp, ThumbsDown, Zap, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AIMetric {
  id: string;
  user_id: string;
  project_id: string;
  feature_type: string;
  tokens_used: number;
  cost_usd: number;
  response_rating: number | null;
  feedback_text: string | null;
  created_at: string;
}

interface AIStats {
  totalInteractions: number;
  totalTokens: number;
  totalCost: number;
  avgRating: number;
  topFeatures: Array<{ feature: string; count: number; cost: number }>;
  dailyUsage: Array<{ date: string; interactions: number; tokens: number; cost: number }>;
}

export const AdminAIMetrics = () => {
  const [metrics, setMetrics] = useState<AIMetric[]>([]);
  const [stats, setStats] = useState<AIStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const { toast } = useToast();

  const loadAIMetrics = async () => {
    try {
      setLoading(true);
      
      const daysAgo = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const startDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
      
      const { data: metricsData, error } = await supabase
        .from('ai_usage_metrics')
        .select('*')
        .gte('created_at', startDate)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (metricsData) {
        setMetrics(metricsData);
        
        // Calcular estatísticas
        const totalInteractions = metricsData.length;
        const totalTokens = metricsData.reduce((sum, m) => sum + (m.tokens_used || 0), 0);
        const totalCost = metricsData.reduce((sum, m) => sum + (Number(m.cost_usd) || 0), 0);
        
        const ratingsData = metricsData.filter(m => m.response_rating !== null);
        const avgRating = ratingsData.length > 0 
          ? ratingsData.reduce((sum, m) => sum + (m.response_rating || 0), 0) / ratingsData.length 
          : 0;

        // Features mais usadas
        const featureStats = metricsData.reduce((acc, m) => {
          const feature = m.feature_type || 'unknown';
          if (!acc[feature]) {
            acc[feature] = { count: 0, cost: 0 };
          }
          acc[feature].count++;
          acc[feature].cost += Number(m.cost_usd) || 0;
          return acc;
        }, {} as Record<string, { count: number; cost: number }>);

        const topFeatures = Object.entries(featureStats)
          .map(([feature, data]) => ({ feature, ...data }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        // Uso diário
        const dailyStats = metricsData.reduce((acc, m) => {
          const date = new Date(m.created_at).toISOString().split('T')[0];
          if (!acc[date]) {
            acc[date] = { interactions: 0, tokens: 0, cost: 0 };
          }
          acc[date].interactions++;
          acc[date].tokens += m.tokens_used || 0;
          acc[date].cost += Number(m.cost_usd) || 0;
          return acc;
        }, {} as Record<string, { interactions: number; tokens: number; cost: number }>);

        const dailyUsage = Object.entries(dailyStats)
          .map(([date, data]) => ({ date: new Date(date).toLocaleDateString('pt-BR'), ...data }))
          .sort((a, b) => new Date(a.date.split('/').reverse().join('-')).getTime() - new Date(b.date.split('/').reverse().join('-')).getTime())
          .slice(-14); // Últimos 14 dias

        setStats({
          totalInteractions,
          totalTokens,
          totalCost,
          avgRating,
          topFeatures,
          dailyUsage
        });
      }
    } catch (error) {
      console.error('Erro ao carregar métricas de IA:', error);
      toast({
        title: "❌ Erro",
        description: "Não foi possível carregar as métricas de IA.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAIMetrics();
  }, [timeRange]);

  const getRatingColor = (rating: number | null) => {
    if (rating === null) return 'bg-gray-100 text-gray-800';
    if (rating === 1) return 'bg-green-100 text-green-800';
    if (rating === -1) return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const getRatingIcon = (rating: number | null) => {
    if (rating === 1) return <ThumbsUp className="h-3 w-3" />;
    if (rating === -1) return <ThumbsDown className="h-3 w-3" />;
    return <MessageSquare className="h-3 w-3" />;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Métricas de IA</h1>
          <p className="text-gray-600 mt-1">Análise do uso e performance da IA</p>
        </div>
        
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 dias</SelectItem>
              <SelectItem value="30d">30 dias</SelectItem>
              <SelectItem value="90d">90 dias</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={loadAIMetrics} variant="outline">
            Atualizar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Interações</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalInteractions.toLocaleString()}</p>
                </div>
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tokens Utilizados</p>
                  <p className="text-2xl font-bold text-green-600">{stats.totalTokens.toLocaleString()}</p>
                </div>
                <Zap className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Custo Total</p>
                  <p className="text-2xl font-bold text-purple-600">
                    ${stats.totalCost.toFixed(2)}
                  </p>
                </div>
                <Target className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avaliação Média</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {stats.avgRating.toFixed(1)}/5
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Uso Diário de IA</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.dailyUsage}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="interactions" stroke="#8884d8" name="Interações" />
                  <Line type="monotone" dataKey="tokens" stroke="#82ca9d" name="Tokens" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Features Mais Utilizadas</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.topFeatures}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="feature" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" name="Usos" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Interactions */}
      <Card>
        <CardHeader>
          <CardTitle>Interações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.slice(0, 10).map((metric) => (
              <div key={metric.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline">{metric.feature_type}</Badge>
                    {metric.response_rating !== null && (
                      <Badge className={getRatingColor(metric.response_rating)}>
                        {getRatingIcon(metric.response_rating)}
                        {metric.response_rating === 1 ? 'Positiva' : metric.response_rating === -1 ? 'Negativa' : 'Neutra'}
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    {metric.tokens_used} tokens • ${Number(metric.cost_usd).toFixed(4)}
                  </div>
                  {metric.feedback_text && (
                    <div className="text-sm text-gray-500 mt-1 italic">
                      "{metric.feedback_text}"
                    </div>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(metric.created_at).toLocaleString('pt-BR')}
                </div>
              </div>
            ))}
          </div>
          
          {metrics.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhuma métrica de IA encontrada no período selecionado.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

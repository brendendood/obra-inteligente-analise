
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Brain, MessageSquare, ThumbsUp, ThumbsDown, Zap, DollarSign, Users, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AIMetrics {
  totalUsage: number;
  monthlyUsage: number;
  totalCost: number;
  monthlyCost: number;
  avgResponseTime: number;
  positiveRating: number;
  negativeRating: number;
  topFeatures: Array<{ feature: string; usage: number }>;
  dailyUsage: Array<{ date: string; usage: number; cost: number }>;
  userEngagement: Array<{ user_id: string; total_usage: number; avg_rating: number }>;
}

export const AdminAIMetrics = () => {
  const [metrics, setMetrics] = useState<AIMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  const loadAIMetrics = async () => {
    try {
      setLoading(true);
      
      // Carregar dados de uso de IA
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      
      const { data: aiUsageData } = await supabase
        .from('ai_usage_metrics')
        .select('*')
        .gte('created_at', thirtyDaysAgo)
        .order('created_at');

      if (aiUsageData && aiUsageData.length > 0) {
        // Calcular métricas totais
        const totalUsage = aiUsageData.length;
        const totalCost = aiUsageData.reduce((sum, usage) => sum + (Number(usage.cost_usd) || 0), 0);
        
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const monthlyData = aiUsageData.filter(usage => {
          const usageDate = new Date(usage.created_at);
          return usageDate.getMonth() === currentMonth && usageDate.getFullYear() === currentYear;
        });
        
        const monthlyUsage = monthlyData.length;
        const monthlyCost = monthlyData.reduce((sum, usage) => sum + (Number(usage.cost_usd) || 0), 0);
        
        // Calcular ratings
        const ratingsData = aiUsageData.filter(usage => usage.response_rating !== null);
        const positiveRating = ratingsData.filter(usage => usage.response_rating === 1).length;
        const negativeRating = ratingsData.filter(usage => usage.response_rating === -1).length;
        
        // Agrupar por feature
        const featureUsage = aiUsageData.reduce((acc, usage) => {
          const feature = usage.feature_type || 'Não especificado';
          acc[feature] = (acc[feature] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        const topFeatures = Object.entries(featureUsage)
          .map(([feature, usage]) => ({ feature, usage }))
          .sort((a, b) => b.usage - a.usage)
          .slice(0, 5);
        
        // Uso diário nos últimos 30 dias
        const dailyUsage = Array.from({ length: 30 }, (_, i) => {
          const date = new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000);
          const dateStr = date.toISOString().split('T')[0];
          
          const dayUsage = aiUsageData.filter(usage => 
            usage.created_at.startsWith(dateStr)
          );
          
          return {
            date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
            usage: dayUsage.length,
            cost: dayUsage.reduce((sum, usage) => sum + (Number(usage.cost_usd) || 0), 0)
          };
        });
        
        // Engajamento por usuário
        const userEngagement = Object.entries(
          aiUsageData.reduce((acc, usage) => {
            const userId = usage.user_id;
            if (!acc[userId]) {
              acc[userId] = { total: 0, ratings: [] };
            }
            acc[userId].total++;
            if (usage.response_rating !== null) {
              acc[userId].ratings.push(usage.response_rating);
            }
            return acc;
          }, {} as Record<string, { total: number; ratings: number[] }>)
        )
        .map(([user_id, data]) => ({
          user_id: user_id.slice(0, 8) + '...',
          total_usage: data.total,
          avg_rating: data.ratings.length > 0 
            ? data.ratings.reduce((sum, r) => sum + r, 0) / data.ratings.length 
            : 0
        }))
        .sort((a, b) => b.total_usage - a.total_usage)
        .slice(0, 10);

        setMetrics({
          totalUsage,
          monthlyUsage,
          totalCost,
          monthlyCost,
          avgResponseTime: 1.2, // Mock data
          positiveRating,
          negativeRating,
          topFeatures,
          dailyUsage,
          userEngagement
        });
      } else {
        // Dados mock se não houver dados reais
        setMetrics({
          totalUsage: 0,
          monthlyUsage: 0,
          totalCost: 0,
          monthlyCost: 0,
          avgResponseTime: 0,
          positiveRating: 0,
          negativeRating: 0,
          topFeatures: [],
          dailyUsage: [],
          userEngagement: []
        });
      }
    } catch (error) {
      console.error('Error loading AI metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAIMetrics();
  }, [timeRange]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Métricas de IA</h1>
        <p className="text-gray-600 mt-2">Análise de uso e performance da inteligência artificial</p>
      </div>

      {/* KPI Cards */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Interações</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {metrics.totalUsage.toLocaleString()}
                  </p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Interações Mensais</p>
                  <p className="text-2xl font-bold text-green-600">
                    {metrics.monthlyUsage.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Custo Total</p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(metrics.totalCost)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tempo Médio</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {metrics.avgResponseTime}s
                  </p>
                </div>
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Usage Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Uso Diário de IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics?.dailyUsage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="usage" stroke="#8884d8" name="Interações" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Features Mais Usadas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics?.topFeatures}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="feature" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="usage" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Ratings and Engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Avaliações dos Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ThumbsUp className="h-5 w-5 text-green-600" />
                  <span>Avaliações Positivas</span>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  {metrics?.positiveRating || 0}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ThumbsDown className="h-5 w-5 text-red-600" />
                  <span>Avaliações Negativas</span>
                </div>
                <Badge className="bg-red-100 text-red-800">
                  {metrics?.negativeRating || 0}
                </Badge>
              </div>

              <div className="pt-4">
                <div className="text-sm text-gray-600 mb-2">Taxa de Satisfação</div>
                <div className="text-2xl font-bold text-blue-600">
                  {metrics && (metrics.positiveRating + metrics.negativeRating) > 0
                    ? Math.round((metrics.positiveRating / (metrics.positiveRating + metrics.negativeRating)) * 100)
                    : 0}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Top Usuários Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics?.userEngagement.map((user, index) => (
                <div key={user.user_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{index + 1}</Badge>
                    <span className="font-mono text-sm">{user.user_id}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{user.total_usage} interações</div>
                    <div className="text-xs text-gray-500">
                      Rating: {user.avg_rating.toFixed(1)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Análise de Custos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metrics?.dailyUsage}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="cost" stroke="#ff7300" name="Custo (USD)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

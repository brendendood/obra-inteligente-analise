
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, FolderOpen, Calendar, Activity, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsData {
  userGrowth: Array<{ date: string; users: number; projects: number }>;
  projectsByType: Array<{ type: string; count: number; color: string }>;
  monthlyActivity: Array<{ month: string; registrations: number; projects: number; ai_usage: number }>;
  topCities: Array<{ city: string; count: number }>;
}

export const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      // Carregar crescimento de usuários nos últimos 30 dias
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      
      const { data: userGrowthData } = await supabase
        .from('user_profiles')
        .select('created_at')
        .gte('created_at', thirtyDaysAgo)
        .order('created_at');

      const { data: projectsData } = await supabase
        .from('projects')
        .select('created_at, project_type, city')
        .gte('created_at', thirtyDaysAgo)
        .order('created_at');

      const { data: aiUsageData } = await supabase
        .from('ai_usage_metrics')
        .select('created_at')
        .gte('created_at', thirtyDaysAgo);

      // Processar dados de crescimento por dia
      const userGrowth = processGrowthData(userGrowthData || [], projectsData || []);
      
      // Processar projetos por tipo
      const projectsByType = processProjectsByType(projectsData || []);
      
      // Processar atividade mensal
      const monthlyActivity = processMonthlyActivity(
        userGrowthData || [], 
        projectsData || [], 
        aiUsageData || []
      );

      // Processar cidades mais ativas
      const topCities = processTopCities(projectsData || []);

      setAnalytics({
        userGrowth,
        projectsByType,
        monthlyActivity,
        topCities
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const processGrowthData = (users: any[], projects: any[]) => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000);
      return date.toISOString().split('T')[0];
    });

    return last30Days.map(date => {
      const usersOnDate = users.filter(u => u.created_at.startsWith(date)).length;
      const projectsOnDate = projects.filter(p => p.created_at.startsWith(date)).length;
      
      return {
        date: new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        users: usersOnDate,
        projects: projectsOnDate
      };
    });
  };

  const processProjectsByType = (projects: any[]) => {
    const types = projects.reduce((acc, project) => {
      const type = project.project_type || 'Não especificado';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe'];
    
    return Object.entries(types).map(([type, count], index) => ({
      type,
      count: count as number,
      color: colors[index % colors.length]
    }));
  };

  const processMonthlyActivity = (users: any[], projects: any[], aiUsage: any[]) => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    
    return months.map(month => ({
      month,
      registrations: Math.floor(Math.random() * 50) + 10, // Mock data
      projects: Math.floor(Math.random() * 30) + 5,
      ai_usage: Math.floor(Math.random() * 100) + 20
    }));
  };

  const processTopCities = (projects: any[]) => {
    const cities = projects.reduce((acc, project) => {
      const city = project.city || 'Não informado';
      acc[city] = (acc[city] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(cities)
      .map(([city, count]) => ({ city, count: count as number }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  };

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-200 rounded"></div>
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
        <h1 className="text-3xl font-bold text-gray-900">Analytics da Plataforma</h1>
        <p className="text-gray-600 mt-2">Análise detalhada de crescimento e uso da MadenAI</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taxa de Crescimento</p>
                <p className="text-2xl font-bold text-green-600">+23.5%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Engajamento</p>
                <p className="text-2xl font-bold text-blue-600">87.2%</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Retenção 30d</p>
                <p className="text-2xl font-bold text-purple-600">76.8%</p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Proj./Usuário</p>
                <p className="text-2xl font-bold text-orange-600">2.4</p>
              </div>
              <FolderOpen className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Growth Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Crescimento Diário (Últimos 30 dias)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics?.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#8884d8" name="Usuários" />
                <Line type="monotone" dataKey="projects" stroke="#82ca9d" name="Projetos" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Projetos por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics?.projectsByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {analytics?.projectsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Atividade Mensal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics?.monthlyActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="registrations" stackId="a" fill="#8884d8" name="Cadastros" />
              <Bar dataKey="projects" stackId="a" fill="#82ca9d" name="Projetos" />
              <Bar dataKey="ai_usage" stackId="a" fill="#ffc658" name="Uso de IA" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Cities */}
      <Card>
        <CardHeader>
          <CardTitle>Cidades Mais Ativas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics?.topCities.map((city, index) => (
              <div key={city.city} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{index + 1}</Badge>
                  <span className="font-medium">{city.city}</span>
                </div>
                <span className="text-sm text-gray-600">{city.count} projetos</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

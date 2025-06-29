
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Activity, Calendar } from 'lucide-react';

const monthlyData = [
  { name: 'Jan', usuarios: 65, projetos: 28, analises: 45 },
  { name: 'Fev', usuarios: 78, projetos: 32, analises: 52 },
  { name: 'Mar', usuarios: 90, projetos: 41, analises: 63 },
  { name: 'Abr', usuarios: 85, projetos: 38, analises: 58 },
  { name: 'Mai', usuarios: 102, projetos: 45, analises: 71 },
  { name: 'Jun', usuarios: 120, projetos: 52, analises: 84 }
];

const projectTypeData = [
  { name: 'Residencial', value: 45, color: '#3B82F6' },
  { name: 'Comercial', value: 30, color: '#10B981' },
  { name: 'Industrial', value: 25, color: '#F59E0B' }
];

export const AdminAnalytics = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">Análise detalhada de dados da plataforma</p>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-sm font-medium text-gray-600">Taxa de Crescimento</CardTitle>
              <CardDescription className="text-2xl font-bold text-gray-900 mt-1">+15.3%</CardDescription>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-sm font-medium text-gray-600">Engajamento</CardTitle>
              <CardDescription className="text-2xl font-bold text-gray-900 mt-1">87.2%</CardDescription>
            </div>
            <Activity className="h-8 w-8 text-blue-600" />
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-sm font-medium text-gray-600">Retenção</CardTitle>
              <CardDescription className="text-2xl font-bold text-gray-900 mt-1">92.8%</CardDescription>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-sm font-medium text-gray-600">Conversão</CardTitle>
              <CardDescription className="text-2xl font-bold text-gray-900 mt-1">6.4%</CardDescription>
            </div>
            <Calendar className="h-8 w-8 text-orange-600" />
          </CardHeader>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crescimento Mensal */}
        <Card>
          <CardHeader>
            <CardTitle>Crescimento Mensal</CardTitle>
            <CardDescription>Usuários, projetos e análises por mês</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="usuarios" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="projetos" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="analises" stroke="#F59E0B" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribuição de Tipos de Projeto */}
        <Card>
          <CardHeader>
            <CardTitle>Tipos de Projeto</CardTitle>
            <CardDescription>Distribuição por categoria</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {projectTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Barras */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade Semanal</CardTitle>
          <CardDescription>Comparação de atividades por categoria</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="usuarios" fill="#3B82F6" />
              <Bar dataKey="projetos" fill="#10B981" />
              <Bar dataKey="analises" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

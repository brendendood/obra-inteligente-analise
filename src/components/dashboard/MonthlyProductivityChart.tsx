
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, DollarSign, Calendar } from 'lucide-react';

interface MonthlyProductivityChartProps {
  data: {
    month: string;
    started: number;
    completed: number;
    investment: number;
  }[];
}

export const MonthlyProductivityChart = ({ data }: MonthlyProductivityChartProps) => {
  // Calcular tendências
  const latestMonth = data[data.length - 1];
  const previousMonth = data[data.length - 2];
  
  const projectTrend = latestMonth && previousMonth ? 
    ((latestMonth.started - previousMonth.started) / Math.max(1, previousMonth.started)) * 100 : 0;
  
  const investmentTrend = latestMonth && previousMonth ? 
    ((latestMonth.investment - previousMonth.investment) / Math.max(1, previousMonth.investment)) * 100 : 0;

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `R$ ${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `R$ ${(value / 1000).toFixed(0)}K`;
    }
    return `R$ ${value.toLocaleString('pt-BR')}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey === 'investment' ? 
                `${entry.name}: ${formatCurrency(entry.value)}` :
                `${entry.name}: ${entry.value}`
              }
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Gráfico Principal - Projetos */}
      <Card className="xl:col-span-2 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span>Evolução Mensal de Projetos</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  stroke="#666" 
                  fontSize={12}
                />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="started" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  name="Iniciados"
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  name="Concluídos"
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Painel de Investimentos */}
      <div className="space-y-6">
        {/* Gráfico de Investimentos */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span>Investimentos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#666" 
                    fontSize={10}
                  />
                  <YAxis 
                    stroke="#666" 
                    fontSize={10}
                    tickFormatter={formatCurrency}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="investment" 
                    fill="#10B981"
                    name="Investimento"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Resumo de Tendências */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-slate-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <span>Tendências</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Tendência de Projetos */}
              <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100">
                <div>
                  <div className="text-sm font-medium text-gray-700">Novos Projetos</div>
                  <div className="text-xs text-gray-500">vs mês anterior</div>
                </div>
                <div className={`text-right ${projectTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <div className="text-lg font-bold">
                    {projectTrend >= 0 ? '+' : ''}{projectTrend.toFixed(0)}%
                  </div>
                  <div className="text-xs">
                    {latestMonth?.started || 0} este mês
                  </div>
                </div>
              </div>

              {/* Tendência de Investimentos */}
              <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100">
                <div>
                  <div className="text-sm font-medium text-gray-700">Investimento</div>
                  <div className="text-xs text-gray-500">vs mês anterior</div>
                </div>
                <div className={`text-right ${investmentTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <div className="text-lg font-bold">
                    {investmentTrend >= 0 ? '+' : ''}{investmentTrend.toFixed(0)}%
                  </div>
                  <div className="text-xs">
                    {formatCurrency(latestMonth?.investment || 0)}
                  </div>
                </div>
              </div>

              {/* Taxa de Conclusão */}
              <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100">
                <div>
                  <div className="text-sm font-medium text-gray-700">Taxa Conclusão</div>
                  <div className="text-xs text-gray-500">mês atual</div>
                </div>
                <div className="text-right text-blue-600">
                  <div className="text-lg font-bold">
                    {latestMonth && latestMonth.started > 0 ? 
                      Math.round((latestMonth.completed / latestMonth.started) * 100) : 0}%
                  </div>
                  <div className="text-xs">
                    {latestMonth?.completed || 0}/{latestMonth?.started || 0}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

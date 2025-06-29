
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface RevenueChartProps {
  data?: Array<{
    date: string;
    value: number;
  }>;
  detailed?: boolean;
}

export const RevenueChart = ({ data = [], detailed = false }: RevenueChartProps) => {
  const totalRevenue = data.reduce((sum, item) => sum + item.value, 0);
  const avgRevenue = data.length > 0 ? totalRevenue / data.length : 0;
  
  // Calcular tendência
  const recentRevenue = data.slice(-7).reduce((sum, item) => sum + item.value, 0) / 7;
  const previousRevenue = data.slice(-14, -7).reduce((sum, item) => sum + item.value, 0) / 7;
  const trend = recentRevenue > previousRevenue ? 'up' : 'down';
  const trendPercentage = previousRevenue > 0 ? ((recentRevenue - previousRevenue) / previousRevenue) * 100 : 0;

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            {detailed ? 'Análise Detalhada de Receita' : 'Receita ao Longo do Tempo'}
          </div>
          <div className="flex items-center gap-2 text-sm">
            {trend === 'up' ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={trend === 'up' ? 'text-green-600' : 'text-red-600'}>
              {trendPercentage.toFixed(1)}%
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Total do Período</p>
                <p className="font-semibold text-lg">
                  R$ {totalRevenue.toLocaleString('pt-BR')}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Média Diária</p>
                <p className="font-semibold text-lg">
                  R$ {avgRevenue.toLocaleString('pt-BR')}
                </p>
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                {detailed ? (
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      fontSize={12}
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString('pt-BR', { 
                          day: '2-digit', 
                          month: '2-digit' 
                        });
                      }}
                    />
                    <YAxis 
                      fontSize={12}
                      tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Receita']}
                      labelFormatter={(label) => `Data: ${label}`}
                    />
                    <Bar dataKey="value" fill="#10b981" />
                  </BarChart>
                ) : (
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      fontSize={12}
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString('pt-BR', { 
                          day: '2-digit', 
                          month: '2-digit' 
                        });
                      }}
                    />
                    <YAxis 
                      fontSize={12}
                      tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Receita']}
                      labelFormatter={(label) => `Data: ${label}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p>Nenhum dado de receita disponível para o período selecionado</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Brain, Zap } from 'lucide-react';

interface AIUsageChartProps {
  data?: Array<{
    feature: string;
    usage: number;
    cost: number;
  }>;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export const AIUsageChart = ({ data = [] }: AIUsageChartProps) => {
  const totalUsage = data.reduce((sum, item) => sum + item.usage, 0);
  const totalCost = data.reduce((sum, item) => sum + item.cost, 0);
  const mostUsedFeature = data.length > 0 ? data.reduce((max, item) => 
    item.usage > max.usage ? item : max
  ) : null;

  const getFeatureName = (feature: string) => {
    const names: Record<string, string> = {
      budget: 'Orçamento',
      schedule: 'Cronograma', 
      chat: 'Chat IA',
      analysis: 'Análise'
    };
    return names[feature] || feature;
  };

  const chartData = data.map(item => ({
    ...item,
    featureName: getFeatureName(item.feature)
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Barras - Uso por Feature */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              Uso por Funcionalidade
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.length > 0 ? (
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  <p>Total de interações: <strong>{totalUsage.toLocaleString('pt-BR')}</strong></p>
                  <p>Feature mais usada: <strong>{mostUsedFeature ? getFeatureName(mostUsedFeature.feature) : 'N/A'}</strong></p>
                </div>
                
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="featureName" 
                        fontSize={12}
                      />
                      <YAxis fontSize={12} />
                      <Tooltip 
                        formatter={(value: number) => [value.toLocaleString('pt-BR'), 'Interações']}
                      />
                      <Bar dataKey="usage" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Zap className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p>Nenhum dado de uso da IA disponível</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gráfico de Pizza - Distribuição de Custos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Distribuição de Custos IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.length > 0 ? (
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  <p>Custo total: <strong>$ {totalCost.toFixed(2)}</strong></p>
                  <p>Custo médio por interação: <strong>$ {totalUsage > 0 ? (totalCost / totalUsage).toFixed(4) : '0.0000'}</strong></p>
                </div>
                
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ featureName, cost, percent }) => 
                          `${featureName}: $${cost.toFixed(2)} (${(percent * 100).toFixed(1)}%)`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="cost"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => [`$ ${value.toFixed(2)}`, 'Custo']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Brain className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p>Nenhum dado de custo da IA disponível</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Detalhes */}
      {data.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Detalhamento por Funcionalidade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Funcionalidade</th>
                    <th className="text-right p-2">Interações</th>
                    <th className="text-right p-2">Custo Total</th>
                    <th className="text-right p-2">Custo Médio</th>
                    <th className="text-right p-2">% do Total</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2 font-medium">{item.featureName}</td>
                      <td className="p-2 text-right">{item.usage.toLocaleString('pt-BR')}</td>
                      <td className="p-2 text-right">$ {item.cost.toFixed(2)}</td>
                      <td className="p-2 text-right">
                        $ {item.usage > 0 ? (item.cost / item.usage).toFixed(4) : '0.0000'}
                      </td>
                      <td className="p-2 text-right">
                        {totalUsage > 0 ? ((item.usage / totalUsage) * 100).toFixed(1) : '0.0'}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

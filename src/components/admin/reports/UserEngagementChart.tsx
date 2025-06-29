
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Users, UserPlus } from 'lucide-react';

interface UserEngagementChartProps {
  data?: Array<{
    date: string;
    activeUsers: number;
    newUsers: number;
  }>;
  detailed?: boolean;
}

export const UserEngagementChart = ({ data = [], detailed = false }: UserEngagementChartProps) => {
  const totalActiveUsers = data.reduce((sum, item) => sum + item.activeUsers, 0);
  const totalNewUsers = data.reduce((sum, item) => sum + item.newUsers, 0);
  const avgActiveUsers = data.length > 0 ? Math.round(totalActiveUsers / data.length) : 0;

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" />
          {detailed ? 'Análise Detalhada de Usuários' : 'Engajamento de Usuários'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Média de Usuários Ativos</p>
                <p className="font-semibold text-lg flex items-center gap-1">
                  <Users className="h-4 w-4 text-blue-600" />
                  {avgActiveUsers.toLocaleString('pt-BR')}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Novos Usuários (Total)</p>
                <p className="font-semibold text-lg flex items-center gap-1">
                  <UserPlus className="h-4 w-4 text-green-600" />
                  {totalNewUsers.toLocaleString('pt-BR')}
                </p>
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
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
                  <YAxis fontSize={12} />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      value.toLocaleString('pt-BR'), 
                      name === 'activeUsers' ? 'Usuários Ativos' : 'Novos Usuários'
                    ]}
                    labelFormatter={(label) => `Data: ${label}`}
                  />
                  <Legend 
                    formatter={(value) => 
                      value === 'activeUsers' ? 'Usuários Ativos' : 'Novos Usuários'
                    }
                  />
                  <Line 
                    type="monotone" 
                    dataKey="activeUsers" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="newUsers" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p>Nenhum dado de usuários disponível para o período selecionado</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

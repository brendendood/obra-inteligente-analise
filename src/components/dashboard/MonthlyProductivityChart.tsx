
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Activity } from 'lucide-react';

interface MonthlyProductivityChartProps {
  data: {
    month: string;
    started: number;
    completed: number;
  }[];
}

export const MonthlyProductivityChart = ({ data }: MonthlyProductivityChartProps) => {
  const hasData = data.some(item => item.started > 0 || item.completed > 0);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value} projeto${entry.value !== 1 ? 's' : ''}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!hasData) {
    return (
      <Card className="border border-gray-200 bg-white w-full">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-gray-600" />
            <CardTitle className="text-xl font-semibold text-gray-900">
              Produtividade Mensal
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="p-4 bg-gray-50 rounded-full mb-4">
              <TrendingUp className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma atividade registrada
            </h3>
            <p className="text-sm text-gray-500 max-w-md">
              Seus dados de produtividade aparecerão aqui quando você começar a criar e finalizar projetos.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 px-2 sm:px-0">
        Análise de Produtividade
      </h2>
      <Card className="border border-gray-200 bg-white w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-gray-600" />
              <CardTitle className="text-lg font-semibold text-gray-900">
                Produtividade Mensal
              </CardTitle>
            </div>
            <div className="text-sm text-gray-500">
              Últimos 6 meses
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="started" 
                  name="Projetos Iniciados"
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="completed" 
                  name="Projetos Finalizados"
                  fill="#10b981" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-6 flex items-center justify-center space-x-8 text-sm text-gray-600 border-t border-gray-100 pt-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
              <span className="font-medium">Projetos Iniciados</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
              <span className="font-medium">Projetos Finalizados</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Zap, MessageSquare, TrendingUp, Clock, Target } from 'lucide-react';

export const AdminAIMetrics = () => {
  const aiMetrics = [
    {
      title: 'Total de Consultas IA',
      value: '12,450',
      change: '+23%',
      positive: true,
      icon: Brain,
      color: 'text-purple-600'
    },
    {
      title: 'Tempo Médio de Resposta',
      value: '1.2s',
      change: '-15%',
      positive: true,
      icon: Clock,
      color: 'text-blue-600'
    },
    {
      title: 'Taxa de Sucesso',
      value: '96.8%',
      change: '+2.1%',
      positive: true,
      icon: Target,
      color: 'text-green-600'
    },
    {
      title: 'Conversas Ativas',
      value: '2,847',
      change: '+18%',
      positive: true,
      icon: MessageSquare,
      color: 'text-orange-600'
    }
  ];

  const aiFeatures = [
    { name: 'Análise de Orçamentos', usage: 85, requests: 3421 },
    { name: 'Cronograma Inteligente', usage: 72, requests: 2156 },
    { name: 'Chat Assistente', usage: 91, requests: 4532 },
    { name: 'Análise de Documentos', usage: 68, requests: 1876 },
    { name: 'Sugestões de Projeto', usage: 79, requests: 2987 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Métricas de IA</h1>
        <p className="text-gray-600 mt-1">Análise de performance e uso dos recursos de IA</p>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {aiMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div className="flex-1">
                  <CardTitle className="text-sm font-medium text-gray-600">{metric.title}</CardTitle>
                  <CardDescription className="text-2xl font-bold text-gray-900 mt-1">
                    {metric.value}
                  </CardDescription>
                  <div className="flex items-center mt-2">
                    <Badge variant={metric.positive ? "default" : "destructive"} className="text-xs">
                      {metric.change}
                    </Badge>
                    <span className="text-xs text-gray-500 ml-2">vs mês anterior</span>
                  </div>
                </div>
                <div className={`p-2 rounded-lg bg-gray-50`}>
                  <Icon className={`h-6 w-6 ${metric.color}`} />
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {/* Status do Sistema IA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              Status dos Serviços IA
            </CardTitle>
            <CardDescription>Monitoramento em tempo real</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">GPT-4 API:</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <Badge variant="outline" className="text-green-700 border-green-200">Online</Badge>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Claude API:</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <Badge variant="outline" className="text-green-700 border-green-200">Online</Badge>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Processamento N8N:</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <Badge variant="outline" className="text-green-700 border-green-200">Ativo</Badge>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Cache Redis:</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <Badge variant="outline" className="text-yellow-700 border-yellow-200">Limitado</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Performance Insights
            </CardTitle>
            <CardDescription>Métricas de eficiência</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">CPU Usage:</span>
                <span className="font-medium">67%</span>
              </div>
              <Progress value={67} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Memory Usage:</span>
                <span className="font-medium">82%</span>
              </div>
              <Progress value={82} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tokens/min:</span>
                <span className="font-medium">1,247</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Queue Length:</span>
                <span className="font-medium">23 jobs</span>
              </div>
              <Progress value={30} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Uso por Feature */}
      <Card>
        <CardHeader>
          <CardTitle>Uso por Funcionalidade IA</CardTitle>
          <CardDescription>Análise detalhada do uso de cada recurso</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {aiFeatures.map((feature, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">{feature.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">{feature.requests.toLocaleString()} requests</span>
                    <Badge variant="outline">{feature.usage}%</Badge>
                  </div>
                </div>
                <Progress value={feature.usage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAlertSystem } from '@/hooks/useAlertSystem';
import { useToast } from '@/hooks/use-toast';
import { 
  Bell, 
  Users, 
  Clock, 
  DollarSign, 
  AlertTriangle, 
  Play,
  TestTube
} from 'lucide-react';

export const AlertsSystemDemo = () => {
  const [isTestingAlerts, setIsTestingAlerts] = useState(false);
  const { 
    alertUserInactive, 
    alertProjectStalled, 
    alertAICostSpike, 
    alertSubscriptionExpiring 
  } = useAlertSystem();
  const { toast } = useToast();

  const testAlerts = [
    {
      id: 'user_inactive',
      name: 'Usuário Inativo',
      description: 'Simular usuário inativo há 7 dias',
      icon: Users,
      color: 'text-blue-600',
      test: () => alertUserInactive('test-user-123', 7)
    },
    {
      id: 'project_stalled',
      name: 'Projeto Parado',
      description: 'Projeto sem cronograma há 3+ dias',
      icon: Clock,
      color: 'text-orange-600',
      test: () => alertProjectStalled('test-user-123', 'test-project-456', 'Casa Modelo')
    },
    {
      id: 'ai_cost_spike',
      name: 'Pico Custo IA',
      description: 'Custo de IA acima do limite',
      icon: DollarSign,
      color: 'text-red-600',
      test: () => alertAICostSpike(75.50, 50)
    },
    {
      id: 'subscription_expiring',
      name: 'Assinatura Vencendo',
      description: 'Plano expira em 2 dias',
      icon: AlertTriangle,
      color: 'text-yellow-600',
      test: () => alertSubscriptionExpiring('test-user-123', 2, 'Plano Pro')
    }
  ];

  const runSingleTest = async (alertTest: any) => {
    try {
      setIsTestingAlerts(true);
      console.log(`🧪 DEMO: Testando alerta ${alertTest.id}...`);
      
      await alertTest.test();
      
      toast({
        title: "✅ Alerta testado",
        description: `Alerta "${alertTest.name}" foi disparado com sucesso`,
      });
    } catch (error) {
      console.error('❌ DEMO: Erro no teste:', error);
      toast({
        title: "Erro no teste",
        description: "Não foi possível testar o alerta",
        variant: "destructive",
      });
    } finally {
      setIsTestingAlerts(false);
    }
  };

  const runAllTests = async () => {
    try {
      setIsTestingAlerts(true);
      console.log('🧪 DEMO: Executando todos os testes de alerta...');
      
      for (const alertTest of testAlerts) {
        await alertTest.test();
        // Pequeno delay entre testes
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      toast({
        title: "✅ Todos os alertas testados",
        description: "Sistema de alertas funcionando corretamente",
      });
    } catch (error) {
      console.error('❌ DEMO: Erro nos testes:', error);
      toast({
        title: "Erro nos testes",
        description: "Alguns alertas falharam no teste",
        variant: "destructive",
      });
    } finally {
      setIsTestingAlerts(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5 text-purple-600" />
          Demo do Sistema de Alertas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Botão para testar todos */}
        <div className="flex justify-center">
          <Button 
            onClick={runAllTests} 
            disabled={isTestingAlerts}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Play className="h-4 w-4 mr-2" />
            {isTestingAlerts ? "Testando..." : "Testar Todos os Alertas"}
          </Button>
        </div>

        {/* Lista de testes individuais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testAlerts.map((alertTest) => {
            const Icon = alertTest.icon;
            return (
              <div 
                key={alertTest.id} 
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${alertTest.color}`} />
                  <div>
                    <h4 className="font-medium">{alertTest.name}</h4>
                    <p className="text-sm text-gray-600">{alertTest.description}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => runSingleTest(alertTest)}
                  disabled={isTestingAlerts}
                >
                  <Bell className="h-4 w-4 mr-1" />
                  Testar
                </Button>
              </div>
            );
          })}
        </div>

        {/* Informações sobre o sistema */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Como funciona:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Alertas são registrados no banco de dados</li>
            <li>• Webhooks são enviados para N8N automaticamente</li>
            <li>• Emails são processados via edge function</li>
            <li>• Logs ficam disponíveis no painel administrativo</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

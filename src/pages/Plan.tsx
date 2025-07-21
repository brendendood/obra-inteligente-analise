import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Check, CreditCard, Calendar } from 'lucide-react';
import { useUserData } from '@/hooks/useUserData';

const Plan = () => {
  const { userData } = useUserData();

  const getPlanDisplayName = (plan: string) => {
    switch (plan) {
      case 'basic': return 'Basic';
      case 'pro': return 'Pro';
      case 'enterprise': return 'Enterprise';
      default: return 'Basic';
    }
  };

  const getPlanLimits = (plan: string) => {
    switch (plan) {
      case 'basic': return '10';
      case 'pro': return '50';
      case 'enterprise': return '∞';
      default: return '10';
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Plano e Pagamentos</h1>
          <p className="text-slate-600 mt-2">Gerencie sua assinatura e histórico de pagamentos</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Plano Atual */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-blue-600" />
                Plano Atual
              </CardTitle>
              <CardDescription>
                Seu plano ativo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Plano</span>
                  <Badge 
                    variant={userData.plan === 'basic' ? 'secondary' : 'default'}
                    className={userData.plan === 'enterprise' ? 'bg-gradient-to-r from-purple-500 to-purple-600' : ''}
                  >
                    {getPlanDisplayName(userData.plan)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Projetos</span>
                  <span className="text-sm font-medium">
                    {userData.projectCount} / {getPlanLimits(userData.plan)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Renovação</span>
                  <span className="text-sm font-medium">
                    {userData.subscription?.current_period_end 
                      ? new Date(userData.subscription.current_period_end).toLocaleDateString('pt-BR')
                      : '--'
                    }
                  </span>
                </div>
                {userData.plan !== 'enterprise' && (
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                    <Crown className="h-4 w-4 mr-2" />
                    {userData.plan === 'basic' ? 'Upgrade para Pro' : 'Upgrade para Enterprise'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Plano Pro */}
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-blue-600" />
                Plano Pro
                <Badge className="bg-blue-600">Recomendado</Badge>
              </CardTitle>
              <CardDescription>
                Para profissionais e empresas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-3xl font-bold text-blue-600">
                  R$ 49<span className="text-lg text-slate-600">/mês</span>
                </div>
                <ul className="space-y-2">
                  {[
                    'Projetos ilimitados',
                    'IA avançada',
                    'Relatórios completos',
                    'Suporte prioritário',
                    'Exportação avançada'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                  Assinar Pro
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Histórico de Pagamentos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Pagamentos
              </CardTitle>
              <CardDescription>
                Histórico de transações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Calendar className="h-4 w-4 text-slate-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Nenhum pagamento</p>
                      <p className="text-xs text-slate-600">
                        Você está no plano {getPlanDisplayName(userData.plan)}
                      </p>
                    </div>
                  </div>
                <Button variant="outline" className="w-full">
                  Ver Histórico Completo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Plan;
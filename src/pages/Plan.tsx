import { useState, useEffect } from 'react';
import { UserPageLayout } from '@/components/layout/UserPageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Crown, Check, CreditCard, Calendar, Star, Zap, Shield, Users, AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { useUserData } from '@/hooks/useUserData';
import { useToast } from '@/hooks/use-toast';
import { useStripeSubscription } from '@/hooks/useStripeSubscription';
import { getPlanDisplayName, getPlanLimit, getPlanPrice, getPlanFeatures, getPlanUsagePercentage, shouldShowUpgradeWarning, canUpgrade, formatPlanPrice, isMaxPlan } from '@/lib/domain/plans';
import { PlanBadge } from '@/components/admin/PlanBadge';
import { renderProjectQuota, canShowUpgradeButton } from '@/utils/planQuota';
const Plan = () => {
  const {
    userData,
    loading,
    refetch
  } = useUserData();
  const {
    toast
  } = useToast();
  const { status, currentPlan, checkSubscription, createCheckout, openCustomerPortal } = useStripeSubscription();
  const [upgrading, setUpgrading] = useState(false);
  const [isYearly, setIsYearly] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      toast({
        title: "✅ Pagamento confirmado!",
        description: "Sua assinatura foi ativada com sucesso.",
      });
      checkSubscription();
      window.history.replaceState({}, '', '/plano');
    } else if (urlParams.get('canceled') === 'true') {
      toast({
        title: "❌ Pagamento cancelado",
        description: "Você pode tentar novamente quando quiser.",
        variant: "destructive",
      });
      window.history.replaceState({}, '', '/plano');
    }
  }, []);
  const handleUpgrade = async (targetPlan: 'basic' | 'pro' | 'enterprise') => {
    setUpgrading(true);
    try {
      const billingType = isYearly ? 'anual' : 'mensal';
      toast({
        title: "🚀 Redirecionando para checkout...",
        description: `Preparando upgrade para ${getPlanDisplayName(targetPlan)} (cobrança ${billingType})`
      });

      await createCheckout(targetPlan, isYearly);
    } catch (error) {
      toast({
        title: "❌ Erro no upgrade",
        description: "Tente novamente em alguns minutos.",
        variant: "destructive"
      });
    } finally {
      setUpgrading(false);
    }
  };
  
  const getPlanPriceDisplay = (plan: 'basic' | 'pro' | 'enterprise') => {
    const prices = {
      basic: { monthly: 'R$ 29,90', yearly: 'R$ 287,00' },
      pro: { monthly: 'R$ 79,90', yearly: 'R$ 767,00' },
      enterprise: { monthly: 'R$ 199,90', yearly: 'R$ 1.919,00' }
    };
    return isYearly ? prices[plan].yearly : prices[plan].monthly;
  };
  const handleManageSubscription = async () => {
    try {
      toast({
        title: "🔄 Abrindo portal de gerenciamento...",
        description: "Redirecionando para gerenciar sua assinatura"
      });

      await openCustomerPortal();
    } catch (error) {
      toast({
        title: "❌ Erro ao abrir portal",
        description: "Tente novamente em alguns minutos.",
        variant: "destructive"
      });
    }
  };
  const usagePercentage = getPlanUsagePercentage(userData.projectCount, userData.plan, userData.credits);
  if (loading) {
    return <UserPageLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </UserPageLayout>;
  }
  return <UserPageLayout>
      <div className="space-y-6 px-[22px]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Plano e Pagamentos</h1>
              <p className="text-slate-600">Gerencie sua assinatura e explore recursos premium</p>
            </div>
            <Button
              onClick={checkSubscription}
              disabled={status.loading}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${status.loading ? 'animate-spin' : ''}`} />
              Atualizar Status
            </Button>
          </div>
          
          {/* Toggle Mensal/Anual */}
          <div className="flex justify-center mt-6">
            <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-2 border border-blue-200">
              <span className={`text-sm font-medium ${!isYearly ? 'text-blue-600' : 'text-slate-500'}`}>
                Mensal
              </span>
              <Label>
                <Switch checked={isYearly} onCheckedChange={setIsYearly} />
              </Label>
              <span className={`text-sm font-medium ${isYearly ? 'text-blue-600' : 'text-slate-500'}`}>
                Anual <span className="text-green-600">(Economize 20%)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Status Atual */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-blue-600" />
              Status da Conta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">Plano Atual</span>
                  <PlanBadge plan={currentPlan || userData.plan} />
                </div>
                <p className="text-2xl font-bold text-slate-900">
                  {formatPlanPrice(currentPlan || userData.plan)}
                </p>
                {status.subscribed && (
                  <div className="flex items-center gap-1 text-green-600 text-xs">
                    <Check className="h-3 w-3" />
                    Assinatura ativa via Stripe
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">Uso de Projetos</span>
                  <span className="text-sm text-slate-500">
                    {renderProjectQuota(userData.plan, userData.projectCount)}
                  </span>
                </div>
                <Progress value={usagePercentage} className="h-2" />
                {shouldShowUpgradeWarning(userData.projectCount, userData.plan, userData.credits) && <div className="flex items-center gap-1 text-orange-600 text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    Limite próximo! Considere fazer upgrade.
                  </div>}
              </div>

              <div className="space-y-2">
                <span className="text-sm font-medium text-slate-600">Renovação</span>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-slate-700">
                    {status.subscription_end 
                      ? new Date(status.subscription_end).toLocaleDateString('pt-BR')
                      : userData.subscription?.current_period_end 
                      ? new Date(userData.subscription.current_period_end).toLocaleDateString('pt-BR')
                      : 'Sem renovação automática'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Planos Disponíveis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Plano Basic */}
          <Card className={`${currentPlan === 'basic' || userData.plan === 'basic' ? 'border-green-500 bg-green-50/50' : 'border-green-200 bg-green-50/20'}`}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="text-xl">📋</span>
                  Basic
                </span>
                {userData.plan === 'basic' && <Badge className="bg-green-600 text-white">
                    Atual
                  </Badge>}
              </CardTitle>
              <CardDescription>Para começar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-green-600">
                    {getPlanPriceDisplay('basic')}
                  </div>
                  <p className="text-xs text-slate-500">
                    {isYearly ? 'cobrança anual' : 'por mês'}
                  </p>
                </div>
                <ul className="space-y-2">
                  {getPlanFeatures('BASIC').features.map((feature, index) => <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600" />
                      {feature}
                    </li>)}
                </ul>
                {(currentPlan === 'basic' || userData.plan === 'basic') ? <Button onClick={handleManageSubscription} className="w-full bg-green-600 hover:bg-green-700">
                    <Crown className="h-4 w-4 mr-2" />
                    Gerenciar Plano
                  </Button> : <Button onClick={() => handleUpgrade('basic')} disabled={upgrading} className="w-full bg-green-600 hover:bg-green-700">
                    {upgrading ? <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Processando...
                      </> : <>
                        <Crown className="h-4 w-4 mr-2" />
                        Escolher Basic
                      </>}
                  </Button>}
              </div>
            </CardContent>
          </Card>

          {/* Plano Pro */}
          <Card className={`${currentPlan === 'pro' || userData.plan === 'pro' ? 'border-indigo-500 bg-indigo-50/50' : 'border-indigo-200 bg-indigo-50/20'} relative`}>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1">
                Mais Popular
              </Badge>
            </div>
            <CardHeader className="pt-8">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-indigo-600" />
                  Pro
                </span>
                {userData.plan === 'pro' && <Badge variant="default" className="bg-indigo-600">
                    Atual
                  </Badge>}
              </CardTitle>
              <CardDescription>Para profissionais</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-indigo-600">
                    {getPlanPriceDisplay('pro')}
                  </div>
                  <p className="text-xs text-slate-500">
                    {isYearly ? 'cobrança anual' : 'por mês'}
                  </p>
                </div>
                <ul className="space-y-2">
                  {getPlanFeatures('PRO').features.map((feature, index) => <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600" />
                      {feature}
                    </li>)}
                </ul>
                {(currentPlan === 'pro' || userData.plan === 'pro') ? <Button onClick={handleManageSubscription} className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
                    <Crown className="h-4 w-4 mr-2" />
                    Gerenciar Plano
                  </Button> : <Button onClick={() => handleUpgrade('pro')} disabled={upgrading} className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
                    {upgrading ? <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Processando...
                      </> : <>
                        <Crown className="h-4 w-4 mr-2" />
                        Escolher Pro
                      </>}
                  </Button>}
              </div>
            </CardContent>
          </Card>

          {/* Plano Enterprise */}
          <Card className={`${currentPlan === 'enterprise' || userData.plan === 'enterprise' ? 'border-purple-500 bg-purple-50/50' : 'border-purple-200 bg-purple-50/20'}`}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-600" />
                  Enterprise
                </span>
                {userData.plan === 'enterprise' && <Badge className="bg-gradient-to-r from-purple-500 to-purple-600">
                    Atual
                  </Badge>}
              </CardTitle>
              <CardDescription>Para equipes e empresas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-purple-600">
                    {getPlanPriceDisplay('enterprise')}
                  </div>
                  <p className="text-xs text-slate-500">
                    {isYearly ? 'cobrança anual' : 'por mês'}
                  </p>
                </div>
                <ul className="space-y-2">
                  {getPlanFeatures('ENTERPRISE').features.map((feature, index) => <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600" />
                      {feature}
                    </li>)}
                </ul>
                {(currentPlan === 'enterprise' || userData.plan === 'enterprise') ? <Button onClick={handleManageSubscription} className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
                    <Crown className="h-4 w-4 mr-2" />
                    Gerenciar Plano
                  </Button> : <Button onClick={() => handleUpgrade('enterprise')} disabled={upgrading} className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
                    {upgrading ? <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Processando...
                      </> : <>
                        <Crown className="h-4 w-4 mr-2" />
                        Escolher Enterprise
                      </>}
                  </Button>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Histórico de Pagamentos - apenas se userData.plan existir */}
        {userData.plan && <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Histórico de Pagamentos
              </CardTitle>
              <CardDescription>
                Suas transações e faturas recentes (se disponível)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nenhum histórico disponível no momento</p>
                <p className="text-sm text-gray-500 mt-2">
                  O histórico será exibido quando integração com gateway estiver ativa
                </p>
              </div>
            </CardContent>
          </Card>}

        {/* FAQ sobre Planos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Perguntas Frequentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-l-blue-500 pl-4">
                <h4 className="font-medium text-slate-700">Posso cancelar a qualquer momento?</h4>
                <p className="text-sm text-slate-600">Sim, você pode cancelar sua assinatura a qualquer momento sem taxas adicionais.</p>
              </div>
              <div className="border-l-4 border-l-blue-500 pl-4">
                <h4 className="font-medium text-slate-700">O que acontece com meus projetos se eu cancelar?</h4>
                <p className="text-sm text-slate-600">Seus projetos ficam salvos por 30 dias. Você pode exportá-los ou reativar a assinatura.</p>
              </div>
              <div className="border-l-4 border-l-blue-500 pl-4">
                <h4 className="font-medium text-slate-700">Posso fazer downgrade do plano?</h4>
                <p className="text-sm text-slate-600">Sim, você pode alterar seu plano a qualquer momento pelo portal de gerenciamento.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </UserPageLayout>;
};
export default Plan;
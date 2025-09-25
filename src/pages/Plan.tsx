import { useState } from 'react';
import { UserPageLayout } from '@/components/layout/UserPageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Crown, Check, CreditCard, Calendar, Star, Zap, Shield, Users, AlertTriangle, Loader2 } from 'lucide-react';
import { useUserData } from '@/hooks/useUserData';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getPlanDisplayName, getPlanLimit, getPlanPrice, getPlanFeatures, getPlanUsagePercentage, shouldShowUpgradeWarning, canUpgrade, formatPlanPrice, isMaxPlan } from '@/utils/planUtils';
import { PlanBadge } from '@/components/ui/PlanBadge';
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
  const [upgrading, setUpgrading] = useState(false);
  const handleUpgrade = async (targetPlan: 'basic' | 'pro' | 'enterprise') => {
    setUpgrading(true);
    try {
      toast({
        title: "🚀 Redirecionando para checkout...",
        description: `Preparando upgrade para ${getPlanDisplayName(targetPlan)}`
      });

      // Simular redirecionamento para checkout
      setTimeout(() => {
        toast({
          title: "✅ Upgrade realizado com sucesso!",
          description: `Bem-vindo ao plano ${getPlanDisplayName(targetPlan)}!`
        });
        refetch();
      }, 2000);
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
  const handleManageSubscription = async () => {
    try {
      toast({
        title: "🔄 Abrindo portal de gerenciamento...",
        description: "Redirecionando para gerenciar sua assinatura"
      });

      // Simular abertura do portal
      setTimeout(() => {
        toast({
          title: "🎯 Portal aberto!",
          description: "Você pode gerenciar sua assinatura no portal."
        });
      }, 1000);
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
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Plano e Pagamentos</h1>
          <p className="text-slate-600">Gerencie sua assinatura e explore recursos premium</p>
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
                  <PlanBadge planCode={userData.plan} />
                </div>
                <p className="text-2xl font-bold text-slate-900">
                  {formatPlanPrice(userData.plan)}
                </p>
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
                    {userData.subscription?.current_period_end ? new Date(userData.subscription.current_period_end).toLocaleDateString('pt-BR') : 'Sem renovação automática'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Planos Disponíveis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Plano Basic */}
          <Card className={`${userData.plan === 'basic' ? 'border-green-500 bg-green-50/50' : 'border-green-200 bg-green-50/20'}`}>
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
                <div className="text-3xl font-bold text-green-600">
                  {formatPlanPrice('basic')}
                </div>
                <ul className="space-y-2">
                  {getPlanFeatures('basic').map((feature, index) => <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600" />
                      {feature}
                    </li>)}
                </ul>
                {userData.plan === 'basic' ? <Button onClick={handleManageSubscription} className="w-full bg-green-600 hover:bg-green-700">
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
          <Card className={`${userData.plan === 'pro' ? 'border-indigo-500 bg-indigo-50/50' : 'border-indigo-200 bg-indigo-50/20'} relative`}>
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
                <div className="text-3xl font-bold text-indigo-600">
                  {formatPlanPrice('pro')}
                </div>
                <ul className="space-y-2">
                  {getPlanFeatures('pro').map((feature, index) => <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600" />
                      {feature}
                    </li>)}
                </ul>
                {userData.plan === 'pro' ? <Button onClick={handleManageSubscription} className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
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
          <Card className={`${userData.plan === 'enterprise' ? 'border-purple-500 bg-purple-50/50' : 'border-purple-200 bg-purple-50/20'}`}>
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
                <div className="text-3xl font-bold text-purple-600">
                  {formatPlanPrice('enterprise')}
                </div>
                <ul className="space-y-2">
                  {getPlanFeatures('enterprise').map((feature, index) => <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600" />
                      {feature}
                    </li>)}
                </ul>
                {userData.plan === 'enterprise' ? <Button onClick={handleManageSubscription} className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
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
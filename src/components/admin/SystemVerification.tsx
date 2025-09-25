import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface VerificationResult {
  name: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: string;
}

export const SystemVerification = () => {
  const [results, setResults] = useState<VerificationResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  const runVerification = async () => {
    setIsRunning(true);
    setResults([]);
    
    const newResults: VerificationResult[] = [];

    try {
      // 1. Verificar funções RPC administrativas
      console.log('🔍 VERIFICATION: Verificando funções administrativas...');
      
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        newResults.push({
          name: 'Autenticação Admin',
          status: 'error',
          message: 'Admin não autenticado',
          details: 'Faça login como administrador'
        });
        setResults([...newResults]);
        return;
      }

      // 2. Testar admin_update_user_profile
      try {
        const { data: updateResult, error: updateError } = await supabase.rpc('admin_update_user_profile', {
          target_user_id: currentUser.id,
          admin_user_id: currentUser.id,
          user_data: { name: 'Test Update' }
        });

        if (updateError) throw updateError;
        
        newResults.push({
          name: 'admin_update_user_profile',
          status: 'success',
          message: 'Função funcionando corretamente',
          details: 'RPC responde adequadamente'
        });
      } catch (error) {
        newResults.push({
          name: 'admin_update_user_profile',
          status: 'error',
          message: 'Erro na função',
          details: error instanceof Error ? error.message : 'Erro desconhecido'
        });
      }

      // 3. Testar admin_change_user_plan
      try {
        const { data: planResult, error: planError } = await supabase.rpc('admin_change_user_plan', {
          target_user_id: currentUser.id,
          admin_user_id: currentUser.id,
          new_plan: 'basic',
          reset_monthly_messages: false
        });

        if (planError) throw planError;
        
        newResults.push({
          name: 'admin_change_user_plan',
          status: 'success',
          message: 'Função funcionando corretamente',
          details: 'RPC responde adequadamente'
        });
      } catch (error) {
        newResults.push({
          name: 'admin_change_user_plan',
          status: 'error',
          message: 'Erro na função',
          details: error instanceof Error ? error.message : 'Erro desconhecido'
        });
      }

      // 4. Testar admin_reset_user_messages  
      try {
        const { data: resetResult, error: resetError } = await supabase.rpc('admin_reset_user_messages', {
          target_user_id: currentUser.id,
          admin_user_id: currentUser.id
        });

        if (resetError) throw resetError;
        
        newResults.push({
          name: 'admin_reset_user_messages',
          status: 'success',
          message: 'Função funcionando corretamente',
          details: 'RPC responde adequadamente'
        });
      } catch (error) {
        newResults.push({
          name: 'admin_reset_user_messages',
          status: 'error',
          message: 'Erro na função',
          details: error instanceof Error ? error.message : 'Erro desconhecido'
        });
      }

      // 5. Testar admin_add_project_credit
      try {
        const { data: creditResult, error: creditError } = await supabase.rpc('admin_add_project_credit', {
          target_user_id: currentUser.id,
          admin_user_id: currentUser.id,
          credits_to_add: 1
        });

        if (creditError) throw creditError;
        
        newResults.push({
          name: 'admin_add_project_credit',
          status: 'success',
          message: 'Função funcionando corretamente',
          details: 'RPC responde adequadamente'
        });
      } catch (error) {
        newResults.push({
          name: 'admin_add_project_credit',
          status: 'error',
          message: 'Erro na função',
          details: error instanceof Error ? error.message : 'Erro desconhecido'
        });
      }

      // 6. Verificar distribuição de planos
      try {
        const { data: plansData } = await supabase
          .from('user_plans')
          .select('plan_tier');

        const { data: allUsers } = await supabase
          .from('user_profiles')
          .select('user_id');

        const distribution = plansData?.reduce((acc: any, plan: any) => {
          const planKey = plan.plan_tier?.toLowerCase() || 'free';
          acc[planKey] = (acc[planKey] || 0) + 1;
          return acc;
        }, {}) || {};

        const totalUsersWithPlans = plansData?.length || 0;
        const totalUsers = allUsers?.length || 0;
        const usersWithoutPlan = Math.max(0, totalUsers - totalUsersWithPlans);

        newResults.push({
          name: 'Distribuição de Planos',
          status: 'success',
          message: 'Dados carregados corretamente',
          details: `Basic: ${distribution.basic || 0}, Pro: ${distribution.pro || 0}, Enterprise: ${distribution.enterprise || 0}, Sem plano: ${usersWithoutPlan}`
        });
      } catch (error) {
        newResults.push({
          name: 'Distribuição de Planos',
          status: 'error',
          message: 'Erro ao carregar distribuição',
          details: error instanceof Error ? error.message : 'Erro desconhecido'
        });
      }

      // 7. Verificar dashboard stats
      try {
        const { data: dashboardData, error: dashboardError } = await supabase.rpc('get_admin_dashboard_stats');
        
        if (dashboardError) throw dashboardError;
        
        newResults.push({
          name: 'Dashboard Statistics',
          status: 'success',
          message: 'Estatísticas carregadas com sucesso',
          details: `${dashboardData?.[0]?.total_users || 0} usuários, ${dashboardData?.[0]?.total_projects || 0} projetos`
        });
      } catch (error) {
        newResults.push({
          name: 'Dashboard Statistics',
          status: 'error',
          message: 'Erro ao carregar estatísticas',
          details: error instanceof Error ? error.message : 'Erro desconhecido'
        });
      }

    } catch (error) {
      console.error('❌ VERIFICATION: Erro geral:', error);
      newResults.push({
        name: 'Sistema Geral',
        status: 'error',
        message: 'Erro geral no sistema',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }

    setResults(newResults);
    setIsRunning(false);

    // Mostrar toast com resumo
    const successCount = newResults.filter(r => r.status === 'success').length;
    const errorCount = newResults.filter(r => r.status === 'error').length;
    
    toast({
      title: "Verificação concluída",
      description: `✅ ${successCount} sucessos, ❌ ${errorCount} erros`,
      variant: errorCount > 0 ? "destructive" : "default",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'error':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'warning':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Verificação do Sistema Administrativo
          <Button
            onClick={runVerification}
            disabled={isRunning}
            variant="outline"
            size="sm"
          >
            {isRunning ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Executar Verificação
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {results.length === 0 && !isRunning && (
          <p className="text-gray-500 text-center py-8">
            Clique no botão acima para executar a verificação completa do sistema administrativo.
          </p>
        )}

        {isRunning && (
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-gray-500">Executando verificações...</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-3">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}
              >
                <div className="flex items-start gap-3">
                  {getStatusIcon(result.status)}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium">{result.name}</h4>
                    <p className="text-sm opacity-90">{result.message}</p>
                    {result.details && (
                      <p className="text-xs opacity-75 mt-1 font-mono">
                        {result.details}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-500" />
                <span className="font-medium text-blue-700">
                  Resumo: {results.filter(r => r.status === 'success').length} sucessos, {' '}
                  {results.filter(r => r.status === 'error').length} erros, {' '}
                  {results.filter(r => r.status === 'warning').length} avisos
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
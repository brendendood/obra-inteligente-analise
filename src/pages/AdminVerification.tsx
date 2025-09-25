import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Play, ExternalLink, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Check {
  key: string;
  status: 'pass' | 'fail';
  details: string;
}

interface SelftestResult {
  passed: boolean;
  checks: Check[];
  summary: {
    total: number;
    passed: number;
    failed: number;
  };
}

const AdminVerification: React.FC = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SelftestResult | null>(null);

  // Carregar dados do usuário e verificar se é admin
  React.useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', user.id)
        .single();
      
      setUserProfile(data);
    };
    
    loadUserProfile();
  }, [user]);

  // Verificar se é admin
  if (userProfile && !userProfile.is_admin) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!userProfile) {
    return <div>Carregando...</div>;
  }

  const runSelftest = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-selftest', {
        body: {}
      });

      if (error) {
        throw new Error(error.message);
      }

      setResults(data);
      
      toast({
        title: data.passed ? "Verificação Aprovada ✅" : "Verificação Reprovada ❌",
        description: `${data.summary.passed}/${data.summary.total} checks passaram`,
        variant: data.passed ? "default" : "destructive"
      });

    } catch (error: any) {
      console.error('Selftest error:', error);
      toast({
        title: "Erro na Verificação",
        description: error.message || "Falha ao executar verificação",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: 'pass' | 'fail') => {
    return status === 'pass' ? 
      <CheckCircle2 className="w-5 h-5 text-green-600" /> : 
      <XCircle className="w-5 h-5 text-red-600" />;
  };

  const getStatusBadge = (status: 'pass' | 'fail') => {
    return (
      <Badge 
        variant={status === 'pass' ? 'default' : 'destructive'}
        className={status === 'pass' ? 'bg-green-100 text-green-800 border-green-200' : ''}
      >
        {status === 'pass' ? 'PASS' : 'FAIL'}
      </Badge>
    );
  };

  const getRecommendedAction = (check: Check) => {
    if (check.status === 'pass') return null;

    const actions: Record<string, string> = {
      'schema_table_': 'Verificar se as migrações foram executadas corretamente',
      'no_free_plans': 'Executar migração para converter usuários FREE para BASIC',
      'quiz_recent_responses': 'Verificar se o fluxo de quiz está funcionando no signup',
      'enterprise_user_fixed': 'Corrigir plan_code do usuário enterprise para ENTERPRISE',
      'monthly_usage_tracking': 'Verificar se tabela monthly_usage foi criada corretamente',
      'function_': 'Executar migrações para criar funções de banco de dados'
    };

    for (const [key, action] of Object.entries(actions)) {
      if (check.key.includes(key)) {
        return action;
      }
    }

    return 'Verificar logs do sistema e corrigir configuração';
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Sistema de Verificação</h1>
            <p className="text-muted-foreground">
              Verificação automatizada de funcionalidades e limites por plano
            </p>
          </div>
          <Button 
            onClick={runSelftest} 
            disabled={loading}
            size="lg"
            className="gap-2"
          >
            <Play className="w-4 h-4" />
            {loading ? 'Executando...' : 'Executar Verificação'}
          </Button>
        </div>

        {/* Links Rápidos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="w-5 h-5" />
              Links Úteis
            </CardTitle>
            <CardDescription>
              Acesso rápido às principais rotas do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" asChild>
                <a href="/pricing-blocked" target="_blank" rel="noopener noreferrer">
                  Tela de Planos
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/admin/users" target="_blank" rel="noopener noreferrer">
                  Painel de Usuários
                </a>
              </Button>
              <Button variant="outline" disabled>
                Webhook Cacto (POST apenas)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resultados */}
        {results && (
          <>
            {/* Resumo */}
            <Card className={`border-2 ${results.passed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  {results.passed ? 
                    <CheckCircle2 className="w-6 h-6 text-green-600" /> : 
                    <XCircle className="w-6 h-6 text-red-600" />
                  }
                  Status Geral: {results.passed ? 'APROVADO' : 'REPROVADO'}
                </CardTitle>
                <CardDescription>
                  {results.summary.passed} de {results.summary.total} verificações passaram
                  {!results.passed && ` • ${results.summary.failed} falharam`}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Lista de Checks */}
            <Card>
              <CardHeader>
                <CardTitle>Detalhes da Verificação</CardTitle>
                <CardDescription>
                  Resultado detalhado de cada verificação executada
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.checks.map((check, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(check.status)}
                          <span className="font-medium">{check.key}</span>
                          {getStatusBadge(check.status)}
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {check.details}
                      </p>

                      {/* Ação Recomendada */}
                      {check.status === 'fail' && (
                        <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-md">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-orange-800">Ação Recomendada:</p>
                              <p className="text-sm text-orange-700">
                                {getRecommendedAction(check)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Estado Inicial */}
        {!results && !loading && (
          <Card>
            <CardContent className="py-12 text-center">
              <Play className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Pronto para Verificação</h3>
              <p className="text-muted-foreground mb-4">
                Clique em "Executar Verificação" para iniciar a análise completa do sistema
              </p>
              <p className="text-sm text-muted-foreground">
                Esta verificação irá testar todos os limites de plano, contadores, 
                migrações e funcionalidades críticas da plataforma.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminVerification;
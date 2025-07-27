import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, ExternalLink, Users, Gift } from 'lucide-react';

export function ReferralSystemTest() {
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const { toast } = useToast();

  const runReferralTest = async () => {
    setLoading(true);
    const results: any = {};
    
    try {
      // 1. Testar validação de código
      const { data: validationData, error: validationError } = await supabase.rpc('validate_referral_code', {
        p_ref_code: 'REF_fae0ee4b'
      });
      
      results.validation = {
        success: !validationError,
        data: validationData,
        error: validationError?.message
      };

      // 2. Testar se a função existe executando ela diretamente
      try {
        const testResult = await supabase.rpc('validate_referral_code', { p_ref_code: 'TEST' });
        results.function_exists = {
          success: true,
          exists: true
        };
      } catch (error) {
        results.function_exists = {
          success: false,
          exists: false,
          error: 'Função validate_referral_code não encontrada'
        };
      }

      // 3. Testar fix de referrals existentes
      const { data: fixData, error: fixError } = await supabase.rpc('fix_existing_referrals');
      
      results.fix_existing = {
        success: !fixError,
        message: fixData,
        error: fixError?.message
      };

      // 4. Verificar usuários com créditos
      const { data: usersData, error: usersError } = await supabase
        .from('user_profiles')
        .select('user_id, full_name, credits, ref_code, referred_by')
        .gt('credits', 0)
        .limit(5);
      
      results.users_with_credits = {
        success: !usersError,
        count: usersData?.length || 0,
        users: usersData || []
      };

      // 5. Verificar referrals registrados
      const { data: referralsData, error: referralsError } = await supabase
        .from('user_referrals')
        .select('*')
        .limit(5);
      
      results.referrals = {
        success: !referralsError,
        count: referralsData?.length || 0,
        referrals: referralsData || []
      };

      setTestResults(results);
      
      toast({
        title: "✅ Teste concluído",
        description: "Todos os testes do sistema de referral foram executados.",
      });

    } catch (error) {
      console.error('Erro no teste:', error);
      toast({
        title: "❌ Erro no teste",
        description: "Ocorreu um erro durante os testes.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const openSignupWithReferral = () => {
    window.open('https://arqcloud.com.br/cadastro?ref=REF_fae0ee4b', '_blank');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Teste do Sistema de Referral
          </CardTitle>
          <CardDescription>
            Execute testes para validar o funcionamento completo do sistema de indicações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Button 
              onClick={runReferralTest} 
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Testando...
                </>
              ) : (
                'Executar Testes'
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={openSignupWithReferral}
              className="flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Testar Cadastro
            </Button>
          </div>

          {testResults && (
            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-semibold">Resultados dos Testes:</h3>
              
              {/* Validação de código */}
              <Card className={testResults.validation.success ? 'border-green-200' : 'border-red-200'}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">1. Validação de Código de Referral</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-sm">
                    <p className={`font-medium ${testResults.validation.success ? 'text-green-600' : 'text-red-600'}`}>
                      {testResults.validation.success ? '✅ Sucesso' : '❌ Falha'}
                    </p>
                    {testResults.validation.data && (
                      <pre className="mt-2 p-2 bg-muted rounded text-xs">
                        {JSON.stringify(testResults.validation.data, null, 2)}
                      </pre>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Função existe */}
              <Card className={testResults.function_exists.success ? 'border-green-200' : 'border-red-200'}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">2. Funções do Sistema</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className={`text-sm font-medium ${testResults.function_exists.exists ? 'text-green-600' : 'text-red-600'}`}>
                    {testResults.function_exists.exists ? '✅ Funções funcionando' : '❌ Erro nas funções'}
                  </p>
                  {testResults.function_exists.error && (
                    <p className="text-xs text-red-600 mt-1">{testResults.function_exists.error}</p>
                  )}
                </CardContent>
              </Card>

              {/* Fix de referrals */}
              <Card className={testResults.fix_existing.success ? 'border-green-200' : 'border-red-200'}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">3. Correção de Referrals Existentes</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className={`text-sm font-medium ${testResults.fix_existing.success ? 'text-green-600' : 'text-red-600'}`}>
                    {testResults.fix_existing.success ? '✅ Sucesso' : '❌ Falha'}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {testResults.fix_existing.message || testResults.fix_existing.error}
                  </p>
                </CardContent>
              </Card>

              {/* Usuários com créditos */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Gift className="w-4 h-4" />
                    4. Usuários com Créditos ({testResults.users_with_credits.count})
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {testResults.users_with_credits.users.length > 0 ? (
                    <div className="space-y-2">
                      {testResults.users_with_credits.users.map((user: any, index: number) => (
                        <div key={index} className="text-sm p-2 bg-muted rounded">
                          <p><strong>{user.full_name}</strong> - {user.credits} créditos</p>
                          <p className="text-xs text-muted-foreground">
                            Ref: {user.ref_code} {user.referred_by && `| Indicado por: ${user.referred_by}`}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhum usuário com créditos encontrado</p>
                  )}
                </CardContent>
              </Card>

              {/* Referrals registrados */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">5. Referrals Registrados ({testResults.referrals.count})</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {testResults.referrals.referrals.length > 0 ? (
                    <div className="space-y-2">
                      {testResults.referrals.referrals.map((referral: any, index: number) => (
                        <div key={index} className="text-sm p-2 bg-muted rounded">
                          <p>Código: {referral.referral_code}</p>
                          <p className="text-xs text-muted-foreground">
                            Créditos: {referral.credits_awarded ? '✅' : '❌'} | 
                            Primeiro projeto: {referral.referred_user_first_project ? '✅' : '❌'}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhum referral encontrado</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
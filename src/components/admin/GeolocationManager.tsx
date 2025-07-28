import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Globe, MapPin, RefreshCw, Settings, AlertCircle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface GeolocationTest {
  ip: string;
  result: any;
  loading: boolean;
  timestamp?: string;
}

interface QualityMetric {
  metric: string;
  count: number;
  percentage: number;
}

interface ProviderStatus {
  name: string;
  status: 'active' | 'error' | 'rate_limited';
  last_used: string;
  success_rate: number;
  response_time: number;
}

export const GeolocationManager = () => {
  const [testIP, setTestIP] = useState('');
  const [currentTest, setCurrentTest] = useState<GeolocationTest | null>(null);
  const [isUpdatingAll, setIsUpdatingAll] = useState(false);
  const [qualityMetrics, setQualityMetrics] = useState<QualityMetric[]>([]);
  const [providerStatus] = useState<ProviderStatus[]>([
    { name: 'BigDataCloud', status: 'active', last_used: '2025-01-28 10:30', success_rate: 95, response_time: 450 },
    { name: 'IP-API', status: 'active', last_used: '2025-01-28 10:25', success_rate: 92, response_time: 320 },
    { name: 'IPInfo', status: 'active', last_used: '2025-01-28 10:20', success_rate: 88, response_time: 600 },
    { name: 'IPAPI', status: 'rate_limited', last_used: '2025-01-28 09:15', success_rate: 85, response_time: 780 }
  ]);
  const { toast } = useToast();

  // Carregar métricas de qualidade
  const loadQualityMetrics = async () => {
    try {
      const { data, error } = await supabase.rpc('get_geolocation_quality_report');
      if (error) throw error;
      setQualityMetrics(data || []);
    } catch (error) {
      console.error('Erro ao carregar métricas:', error);
    }
  };

  useEffect(() => {
    loadQualityMetrics();
  }, []);

  // Testar IP específico
  const testSpecificIP = async () => {
    if (!testIP) {
      toast({
        title: "IP obrigatório",
        description: "Digite um IP para testar",
        variant: "destructive",
      });
      return;
    }

    setCurrentTest({ ip: testIP, result: null, loading: true });

    try {
      const { data, error } = await supabase.functions.invoke('ip-geolocation-enhanced', {
        body: { ip_address: testIP }
      });

      if (error) throw error;

      setCurrentTest({
        ip: testIP,
        result: data,
        loading: false,
        timestamp: new Date().toLocaleString('pt-BR')
      });

      if (data.success) {
        toast({
          title: "Teste concluído",
          description: `Localização obtida de ${data.source}`,
        });
      } else {
        toast({
          title: "Teste falhou",
          description: data.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro no teste:', error);
      setCurrentTest({
        ip: testIP,
        result: { success: false, error: error.message },
        loading: false,
        timestamp: new Date().toLocaleString('pt-BR')
      });
      toast({
        title: "Erro no teste",
        description: "Falha ao testar IP",
        variant: "destructive",
      });
    }
  };

  // Testar IP atual do usuário
  const testCurrentUserIP = async () => {
    setCurrentTest({ ip: 'Detectando...', result: null, loading: true });

    try {
      // Obter IP atual
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const { ip } = await ipResponse.json();
      
      setTestIP(ip);
      setCurrentTest({ ip, result: null, loading: true });

      const { data, error } = await supabase.functions.invoke('ip-geolocation-enhanced', {
        body: { ip_address: ip }
      });

      if (error) throw error;

      setCurrentTest({
        ip,
        result: data,
        loading: false,
        timestamp: new Date().toLocaleString('pt-BR')
      });

      toast({
        title: "Teste do IP atual concluído",
        description: data.success ? `Localização: ${data.location.city}, ${data.location.region}` : data.error,
        variant: data.success ? "default" : "destructive",
      });
    } catch (error) {
      console.error('Erro no teste:', error);
      setCurrentTest({
        ip: 'Erro',
        result: { success: false, error: error.message },
        loading: false,
        timestamp: new Date().toLocaleString('pt-BR')
      });
    }
  };

  // Atualizar todas as geolocalizações
  const updateAllGeolocations = async () => {
    setIsUpdatingAll(true);
    try {
      // Buscar usuários com logins sem geolocalização
      const { data: logins, error } = await supabase
        .from('user_login_history')
        .select('id, ip_address, user_id')
        .is('city', null)
        .not('ip_address', 'is', null)
        .order('login_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      if (!logins || logins.length === 0) {
        toast({
          title: "Nada para atualizar",
          description: "Todos os logins já possuem geolocalização",
        });
        setIsUpdatingAll(false);
        return;
      }

      let processed = 0;
      let successful = 0;

      for (const login of logins) {
        try {
          const { data } = await supabase.functions.invoke('ip-geolocation-enhanced', {
            body: {
              ip_address: login.ip_address?.toString(),
              login_id: login.id,
              user_id: login.user_id
            }
          });

          if (data?.success) {
            successful++;
          }
          processed++;
        } catch (error) {
          console.error(`Erro ao processar login ${login.id}:`, error);
          processed++;
        }

        // Delay entre requests para evitar rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      toast({
        title: "Atualização concluída",
        description: `${successful} de ${processed} logins atualizados com sucesso`,
      });

      // Recarregar métricas
      await loadQualityMetrics();
    } catch (error) {
      console.error('Erro na atualização em lote:', error);
      toast({
        title: "Erro na atualização",
        description: "Falha ao atualizar geolocalizações",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingAll(false);
    }
  };

  // Reset completo
  const resetAllData = async () => {
    if (!confirm('Tem certeza que deseja resetar TODOS os dados de geolocalização?')) {
      return;
    }

    try {
      const { data, error } = await supabase.rpc('reset_all_geolocation_data');
      if (error) throw error;

      toast({
        title: "Reset concluído",
        description: data || "Dados de geolocalização resetados",
      });

      await loadQualityMetrics();
    } catch (error) {
      console.error('Erro no reset:', error);
      toast({
        title: "Erro no reset",
        description: "Falha ao resetar dados",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Globe className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Gerenciador de Geolocalização</h2>
      </div>

      <Tabs defaultValue="testing" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="testing">Testes</TabsTrigger>
          <TabsTrigger value="quality">Qualidade</TabsTrigger>
          <TabsTrigger value="providers">Provedores</TabsTrigger>
          <TabsTrigger value="management">Gestão</TabsTrigger>
        </TabsList>

        <TabsContent value="testing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Teste de Geolocalização
              </CardTitle>
              <CardDescription>
                Teste a geolocalização de IPs específicos usando o sistema aprimorado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Digite um IP para testar (ex: 8.8.8.8)"
                  value={testIP}
                  onChange={(e) => setTestIP(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={testSpecificIP} 
                  disabled={currentTest?.loading}
                  variant="outline"
                >
                  {currentTest?.loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Testar IP'}
                </Button>
              </div>

              <Button 
                onClick={testCurrentUserIP} 
                disabled={currentTest?.loading}
                className="w-full"
              >
                {currentTest?.loading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Globe className="h-4 w-4 mr-2" />}
                Testar Meu IP Atual
              </Button>

              {currentTest && (
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Resultado do Teste</CardTitle>
                    {currentTest.timestamp && (
                      <CardDescription>IP: {currentTest.ip} • {currentTest.timestamp}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    {currentTest.loading ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Testando geolocalização...</span>
                      </div>
                    ) : currentTest.result ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          {currentTest.result.success ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          )}
                          <Badge variant={currentTest.result.success ? "default" : "destructive"}>
                            {currentTest.result.success ? 'Sucesso' : 'Falha'}
                          </Badge>
                          {currentTest.result.source && (
                            <Badge variant="outline">Fonte: {currentTest.result.source}</Badge>
                          )}
                        </div>

                        {currentTest.result.success && currentTest.result.location && (
                          <div className="grid grid-cols-2 gap-4 p-4 bg-background rounded-lg border">
                            <div>
                              <p className="font-medium">Localização</p>
                              <p className="text-sm text-muted-foreground">
                                {currentTest.result.location.city}, {currentTest.result.location.region}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {currentTest.result.location.country}
                              </p>
                            </div>
                            <div>
                              <p className="font-medium">Coordenadas</p>
                              <p className="text-sm text-muted-foreground">
                                {currentTest.result.location.latitude}, {currentTest.result.location.longitude}
                              </p>
                              {currentTest.result.location.isp && (
                                <p className="text-sm text-muted-foreground">
                                  ISP: {currentTest.result.location.isp}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {!currentTest.result.success && (
                          <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                            <p className="text-sm text-destructive">{currentTest.result.error}</p>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Métricas de Qualidade
              </CardTitle>
              <CardDescription>
                Monitoramento da qualidade dos dados de geolocalização (últimos 30 dias)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {qualityMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{metric.metric}</p>
                      <p className="text-sm text-muted-foreground">{metric.count} registros</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{metric.percentage}%</p>
                      <Badge variant={metric.percentage > 80 ? "default" : metric.percentage > 50 ? "secondary" : "destructive"}>
                        {metric.percentage > 80 ? 'Excelente' : metric.percentage > 50 ? 'Bom' : 'Precisa melhorar'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Button onClick={loadQualityMetrics} variant="outline" className="w-full mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar Métricas
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="providers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Status dos Provedores
              </CardTitle>
              <CardDescription>
                Monitoramento dos provedores de geolocalização externos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {providerStatus.map((provider, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        provider.status === 'active' ? 'bg-green-500' :
                        provider.status === 'rate_limited' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <p className="font-medium">{provider.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Último uso: {provider.last_used}
                        </p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge variant={
                        provider.status === 'active' ? "default" :
                        provider.status === 'rate_limited' ? "secondary" : "destructive"
                      }>
                        {provider.status === 'active' ? 'Ativo' :
                         provider.status === 'rate_limited' ? 'Rate Limited' : 'Erro'}
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        <p>Taxa de sucesso: {provider.success_rate}%</p>
                        <p>Tempo de resposta: {provider.response_time}ms</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="management" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Gestão de Dados
              </CardTitle>
              <CardDescription>
                Ferramentas para gerenciar os dados de geolocalização
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Button 
                  onClick={updateAllGeolocations} 
                  disabled={isUpdatingAll}
                  className="w-full"
                >
                  {isUpdatingAll ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Atualizando Geolocalizações...
                    </>
                  ) : (
                    <>
                      <MapPin className="h-4 w-4 mr-2" />
                      Atualizar Todas as Geolocalizações
                    </>
                  )}
                </Button>
                <p className="text-sm text-muted-foreground">
                  Processa logins sem geolocalização usando o sistema aprimorado
                </p>
              </div>

              <div className="space-y-2">
                <Button 
                  onClick={resetAllData} 
                  variant="destructive" 
                  className="w-full"
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Reset Completo dos Dados
                </Button>
                <p className="text-sm text-muted-foreground">
                  Remove todos os dados de geolocalização existentes. Esta ação é irreversível.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
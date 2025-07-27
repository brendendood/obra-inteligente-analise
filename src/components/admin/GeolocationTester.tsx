import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, MapPin, RefreshCw, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface GeolocationTestResult {
  success: boolean;
  location?: {
    city: string;
    region: string;
    country: string;
    latitude: number;
    longitude: number;
    isp?: string;
  };
  source?: string;
  error?: string;
  ip_address?: string;
}

export const GeolocationTester = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testIp, setTestIp] = useState('');
  const [result, setResult] = useState<GeolocationTestResult | null>(null);
  const { toast } = useToast();

  const testGeolocation = async () => {
    if (!testIp.trim()) {
      toast({
        title: "IP obrigatório",
        description: "Digite um IP para testar a geolocalização",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      console.log('🧪 Testando geolocalização para IP:', testIp);

      const { data, error } = await supabase.functions.invoke('ip-geolocation', {
        body: {
          ip_address: testIp.trim(),
          login_id: 'test-id', // ID fictício para teste
          user_id: 'test-user-id',
          force_update: true
        }
      });

      if (error) {
        throw error;
      }

      console.log('✅ Resultado da geolocalização:', data);
      setResult(data);

      if (data.success) {
        toast({
          title: "🌍 Geolocalização capturada!",
          description: `Localização: ${data.location.city}, ${data.location.region}, ${data.location.country}`,
          duration: 5000
        });
      } else {
        toast({
          title: "❌ Falha na geolocalização",
          description: data.error || "Erro desconhecido",
          variant: "destructive"
        });
      }

    } catch (error) {
      console.error('❌ Erro no teste de geolocalização:', error);
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
      
      toast({
        title: "Erro no teste",
        description: "Falha ao testar geolocalização",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentUserLocation = async () => {
    setIsLoading(true);
    
    try {
      // Buscar IP atual do usuário via serviço externo
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      
      setTestIp(ipData.ip);
      
      // Aguardar um pouco e testar automaticamente
      setTimeout(() => {
        testGeolocation();
      }, 500);
      
    } catch (error) {
      console.error('Erro ao obter IP atual:', error);
      toast({
        title: "Erro",
        description: "Não foi possível obter seu IP atual",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Teste de Geolocalização Real
        </CardTitle>
        <CardDescription>
          Teste o sistema de captura de geolocalização precisa via IP
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Input e controles */}
        <div className="flex gap-2">
          <Input
            placeholder="Digite um IP para testar (ex: 8.8.8.8)"
            value={testIp}
            onChange={(e) => setTestIp(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={testGeolocation}
            disabled={isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Testando...
              </>
            ) : (
              'Testar IP'
            )}
          </Button>
        </div>

        <Button
          variant="outline"
          onClick={getCurrentUserLocation}
          disabled={isLoading}
          className="w-full"
        >
          <MapPin className="h-4 w-4 mr-2" />
          Usar Meu IP Atual
        </Button>

        {/* Resultado do teste */}
        {result && (
          <div className="mt-6 p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              {result.success ? (
                <Check className="h-5 w-5 text-green-600" />
              ) : (
                <X className="h-5 w-5 text-red-600" />
              )}
              <Badge variant={result.success ? "default" : "destructive"}>
                {result.success ? "Sucesso" : "Falha"}
              </Badge>
              {result.source && (
                <Badge variant="outline">
                  API: {result.source}
                </Badge>
              )}
            </div>

            {result.success && result.location ? (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Cidade:</strong> {result.location.city}
                  </div>
                  <div>
                    <strong>Região:</strong> {result.location.region}
                  </div>
                  <div>
                    <strong>País:</strong> {result.location.country}
                  </div>
                  <div>
                    <strong>IP:</strong> {result.ip_address}
                  </div>
                </div>
                
                <div className="text-sm">
                  <strong>Coordenadas:</strong> {result.location.latitude}, {result.location.longitude}
                </div>
                
                {result.location.isp && (
                  <div className="text-sm">
                    <strong>ISP:</strong> {result.location.isp}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>{result.error}</span>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <strong>Nota:</strong> Este teste utiliza APIs externas de geolocalização para 
          verificar se o sistema está capturando localizações reais e precisas.
        </div>
      </CardContent>
    </Card>
  );
};
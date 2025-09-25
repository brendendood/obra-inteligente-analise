import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface APIStatus {
  status: 'online' | 'offline' | 'slow';
  latency: number;
  lastChecked: Date;
  lastError?: string;
}

export const AdminStatusPanel = () => {
  const [apiStatus, setApiStatus] = useState<APIStatus>({
    status: 'offline',
    latency: 0,
    lastChecked: new Date(),
  });
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  const checkAPIStatus = async () => {
    setIsChecking(true);
    const startTime = Date.now();
    
    try {
      // Teste básico de conectividade com o Supabase
      const { data, error } = await supabase
        .from('admin_permissions')
        .select('count')
        .limit(1);
      
      const latency = Date.now() - startTime;
      
      if (error) {
        setApiStatus({
          status: 'offline',
          latency,
          lastChecked: new Date(),
          lastError: error.message,
        });
      } else {
        setApiStatus({
          status: latency > 2000 ? 'slow' : 'online',
          latency,
          lastChecked: new Date(),
        });
      }
    } catch (error) {
      const latency = Date.now() - startTime;
      setApiStatus({
        status: 'offline',
        latency,
        lastChecked: new Date(),
        lastError: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleRefresh = async () => {
    await checkAPIStatus();
    toast({
      title: "Status atualizado",
      description: `API está ${apiStatus.status === 'online' ? 'funcionando' : 'com problemas'}`,
    });
  };

  // Verificar status inicial e a cada 30 segundos
  useEffect(() => {
    checkAPIStatus();
    const interval = setInterval(checkAPIStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    switch (apiStatus.status) {
      case 'online':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'slow':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'offline':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = () => {
    const variants = {
      online: 'bg-green-100 text-green-800 border-green-200',
      slow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      offline: 'bg-red-100 text-red-800 border-red-200',
    };

    return (
      <Badge className={variants[apiStatus.status]}>
        {getStatusIcon()}
        <span className="ml-1 capitalize">{apiStatus.status}</span>
      </Badge>
    );
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            Status da API
            {getStatusBadge()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isChecking}
            className="ml-auto"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </CardTitle>
        <CardDescription>
          Monitoramento em tempo real da conectividade com o backend
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Latência</p>
            <p className="text-2xl font-bold">
              {apiStatus.latency}ms
            </p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Última Verificação</p>
            <p className="text-sm">
              {apiStatus.lastChecked.toLocaleTimeString('pt-BR')}
            </p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <p className="text-sm">
              {apiStatus.status === 'online' 
                ? 'Funcionando normalmente'
                : apiStatus.status === 'slow'
                ? 'Lentidão detectada'
                : 'Indisponível'
              }
            </p>
          </div>
        </div>
        
        {apiStatus.lastError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">
              <strong>Último erro:</strong> {apiStatus.lastError}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
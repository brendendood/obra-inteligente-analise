
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Bell, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  Users, 
  DollarSign,
  Settings,
  Webhook,
  Zap
} from 'lucide-react';

interface AlertConfig {
  id: string;
  alert_type: string;
  name: string;
  description: string;
  enabled: boolean;
  conditions: Record<string, any>;
  actions: Record<string, any>;
  created_at: string;
  updated_at: string;
}

interface AlertLog {
  id: string;
  alert_type: string;
  triggered_at: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
  metadata: Record<string, any>;
}

export const AdminAlertsManager = () => {
  const [alertConfigs, setAlertConfigs] = useState<AlertConfig[]>([]);
  const [alertLogs, setAlertLogs] = useState<AlertLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadAlertData();
  }, []);

  const loadAlertData = async () => {
    try {
      setLoading(true);
      console.log('📢 ALERTS: Carregando configurações e logs...');

      // Now that tables exist, we can use them normally
      const { data: configs } = await (supabase as any)
        .from('alert_configurations')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: logs } = await (supabase as any)
        .from('alert_logs')
        .select('*')
        .order('triggered_at', { ascending: false })
        .limit(50);

      setAlertConfigs(configs || []);
      setAlertLogs(logs || []);

      console.log('✅ ALERTS: Dados carregados', { configs: configs?.length, logs: logs?.length });
    } catch (error) {
      console.error('❌ ALERTS: Erro ao carregar dados:', error);
      toast({
        title: "Erro ao carregar alertas",
        description: "Não foi possível carregar os dados dos alertas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleAlert = async (alertId: string, enabled: boolean) => {
    try {
      const { error } = await (supabase as any)
        .from('alert_configurations')
        .update({ enabled, updated_at: new Date().toISOString() })
        .eq('id', alertId);

      if (error) throw error;

      setAlertConfigs(prev => 
        prev.map(config => 
          config.id === alertId ? { ...config, enabled } : config
        )
      );

      toast({
        title: enabled ? "Alerta ativado" : "Alerta desativado",
        description: "Configuração salva com sucesso",
      });
    } catch (error) {
      console.error('❌ ALERTS: Erro ao alternar alerta:', error);
      toast({
        title: "Erro ao alterar alerta",
        description: "Não foi possível salvar a configuração",
        variant: "destructive",
      });
    }
  };

  const testWebhook = async () => {
    if (!webhookUrl) {
      toast({
        title: "URL necessária",
        description: "Por favor, insira a URL do webhook N8N",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('🧪 WEBHOOK: Testando webhook N8N...');
      
      const response = await supabase.functions.invoke('webhook-automation', {
        body: {
          event_type: 'test_webhook',
          user_data: {
            id: 'test-user',
            email: 'test@madenai.com',
            name: 'Teste Admin'
          },
          event_data: {
            message: 'Teste de webhook do painel administrativo',
            timestamp: new Date().toISOString()
          },
          webhook_urls: [webhookUrl]
        }
      });

      if (response.error) throw response.error;

      toast({
        title: "✅ Webhook testado",
        description: "Requisição enviada com sucesso para o N8N",
      });
    } catch (error) {
      console.error('❌ WEBHOOK: Erro no teste:', error);
      toast({
        title: "Erro no teste",
        description: "Não foi possível testar o webhook",
        variant: "destructive",
      });
    }
  };

  const createDefaultAlerts = async () => {
    try {
      console.log('🔧 ALERTS: Criando alertas padrão...');

      const defaultAlerts = [
        {
          alert_type: 'user_inactive',
          name: 'Usuário Inativo',
          description: 'Alertar quando usuário não acessa por 7 dias',
          enabled: true,
          conditions: { days_inactive: 7 },
          actions: { webhook: true, email: true }
        },
        {
          alert_type: 'project_stalled',
          name: 'Projeto Parado',
          description: 'Projeto sem cronograma após 3 dias',
          enabled: true,
          conditions: { days_without_schedule: 3 },
          actions: { webhook: true }
        },
        {
          alert_type: 'ai_cost_spike',
          name: 'Pico de Custo IA',
          description: 'Custo de IA acima do limite diário',
          enabled: true,
          conditions: { daily_cost_limit: 50 },
          actions: { webhook: true, email: true }
        },
        {
          alert_type: 'subscription_expiring',
          name: 'Assinatura Vencendo',  
          description: 'Plano expira em 3 dias',
          enabled: true,
          conditions: { days_until_expire: 3 },
          actions: { webhook: true, email: true }
        }
      ];

      const { error } = await (supabase as any)
        .from('alert_configurations')
        .upsert(defaultAlerts, { onConflict: 'alert_type' });

      if (error) throw error;

      await loadAlertData();

      toast({
        title: "✅ Alertas criados",
        description: "Configurações padrão foram criadas com sucesso",
      });
    } catch (error) {
      console.error('❌ ALERTS: Erro ao criar alertas padrão:', error);
      toast({
        title: "Erro ao criar alertas",
        description: "Não foi possível criar as configurações padrão",
        variant: "destructive",
      });
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      const { error } = await (supabase as any)
        .from('alert_logs')
        .update({ resolved: true })
        .eq('id', alertId);

      if (error) throw error;

      setAlertLogs(prev => 
        prev.map(log => 
          log.id === alertId ? { ...log, resolved: true } : log
        )
      );

      toast({
        title: "Alerta resolvido",
        description: "Alerta marcado como resolvido",
      });
    } catch (error) {
      console.error('❌ ALERTS: Erro ao resolver alerta:', error);
      toast({
        title: "Erro ao resolver alerta",
        description: "Não foi possível marcar como resolvido",
        variant: "destructive",
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertIcon = (alertType: string) => {
    switch (alertType) {
      case 'user_inactive': return Users;
      case 'project_stalled': return Clock;
      case 'ai_cost_spike': return DollarSign;
      case 'subscription_expiring': return AlertTriangle;
      default: return Bell;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sistema de Alertas</h2>
          <p className="text-gray-600">Gerenciar alertas automatizados e notificações</p>
        </div>
        <Button onClick={createDefaultAlerts} className="bg-blue-600 hover:bg-blue-700">
          <Settings className="h-4 w-4 mr-2" />
          Criar Alertas Padrão
        </Button>
      </div>

      {/* Configurações de Webhook/N8N */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-600" />
            Integração N8N
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="webhook-url">URL do Webhook N8N</Label>
              <Input 
                id="webhook-url"
                value={webhookUrl} 
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://n8n.your-domain.com/webhook/..."
              />
            </div>
            <div className="flex items-end">
              <Button onClick={testWebhook} variant="outline" className="w-full">
                <Webhook className="h-4 w-4 mr-2" />
                Testar Webhook
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Configurações de Alerta */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Alerta</CardTitle>
        </CardHeader>
        <CardContent>
          {alertConfigs.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhuma configuração de alerta encontrada</p>
              <Button onClick={createDefaultAlerts} className="mt-4">
                Criar Alertas Padrão
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {alertConfigs.map((config) => {
                const Icon = getAlertIcon(config.alert_type);
                return (
                  <div key={config.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium">{config.name}</h4>
                        <p className="text-sm text-gray-600">{config.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={config.enabled ? "default" : "secondary"}>
                        {config.enabled ? "Ativo" : "Inativo"}
                      </Badge>
                      <Switch
                        checked={config.enabled}
                        onCheckedChange={(enabled) => toggleAlert(config.id, enabled)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Logs de Alertas Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Alertas Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {alertLogs.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum alerta registrado ainda</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alertLogs.slice(0, 10).map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge className={getSeverityColor(log.severity)}>
                      {log.severity}
                    </Badge>
                    <div>
                      <p className="font-medium">{log.message}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(log.triggered_at).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  {!log.resolved && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => resolveAlert(log.id)}
                    >
                      Resolver
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

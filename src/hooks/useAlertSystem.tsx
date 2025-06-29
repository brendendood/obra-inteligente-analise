
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AlertData {
  userId?: string;
  projectId?: string;
  eventType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  metadata?: Record<string, any>;
}

export function useAlertSystem() {
  const [alertConfigs, setAlertConfigs] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadAlertConfigs();
  }, []);

  const loadAlertConfigs = async () => {
    try {
      const { data } = await (supabase as any)
        .from('alert_configurations')
        .select('*')
        .eq('enabled', true);

      setAlertConfigs(data || []);
    } catch (error) {
      console.error('❌ ALERTS: Erro ao carregar configurações:', error);
      // Não mostrar erro se as tabelas não existirem ainda
    }
  };

  const triggerAlert = async (alertData: AlertData) => {
    try {
      console.log('🚨 ALERT: Disparando alerta...', alertData);

      // Registrar o alerta no banco
      const { error: logError } = await (supabase as any)
        .from('alert_logs')
        .insert({
          alert_type: alertData.eventType,
          message: alertData.message,
          severity: alertData.severity,
          metadata: alertData.metadata || {},
          user_id: alertData.userId,
          project_id: alertData.projectId
        });

      if (logError) {
        console.error('❌ ALERT: Erro ao registrar log:', logError);
      }

      // Disparar webhook se configurado
      const relevantConfigs = alertConfigs.filter(config => 
        config.alert_type === alertData.eventType && config.enabled
      );

      for (const config of relevantConfigs) {
        if (config.actions?.webhook) {
          await triggerWebhook(alertData, config);
        }
        
        if (config.actions?.email) {
          await sendAlertEmail(alertData, config);
        }
      }

      // Mostrar toast para alertas críticos
      if (alertData.severity === 'critical' || alertData.severity === 'high') {
        toast({
          title: `🚨 Alerta ${alertData.severity}`,
          description: alertData.message,
          variant: alertData.severity === 'critical' ? "destructive" : "default",
        });
      }

      console.log('✅ ALERT: Alerta processado com sucesso');
    } catch (error) {
      console.error('❌ ALERT: Erro ao processar alerta:', error);
    }
  };

  const triggerWebhook = async (alertData: AlertData, config: any) => {
    try {
      console.log('📡 WEBHOOK: Enviando para N8N...', alertData.eventType);

      await supabase.functions.invoke('webhook-automation', {
        body: {
          event_type: alertData.eventType,
          user_data: alertData.userId ? {
            id: alertData.userId,
            project_id: alertData.projectId
          } : null,
          event_data: {
            message: alertData.message,
            severity: alertData.severity,
            metadata: alertData.metadata,
            alert_config: config,
            timestamp: new Date().toISOString()
          },
          webhook_urls: config.webhook_urls || []
        }
      });

      console.log('✅ WEBHOOK: Enviado com sucesso');
    } catch (error) {
      console.error('❌ WEBHOOK: Erro ao enviar:', error);
    }
  };

  const sendAlertEmail = async (alertData: AlertData, config: any) => {
    try {
      console.log('📧 EMAIL: Enviando alerta por email...', alertData.eventType);

      // Implementar envio de email via edge function
      await supabase.functions.invoke('send-alert-email', {
        body: {
          alert_type: alertData.eventType,
          message: alertData.message,
          severity: alertData.severity,
          user_id: alertData.userId,
          project_id: alertData.projectId,
          metadata: alertData.metadata
        }
      });

      console.log('✅ EMAIL: Alerta enviado');
    } catch (error) {
      console.error('❌ EMAIL: Erro ao enviar:', error);
    }
  };

  // Alertas específicos pré-configurados
  const alertUserInactive = (userId: string, daysInactive: number) => {
    triggerAlert({
      userId,
      eventType: 'user_inactive',
      severity: daysInactive > 14 ? 'high' : 'medium',
      message: `Usuário inativo há ${daysInactive} dias`,
      metadata: { days_inactive: daysInactive }
    });
  };

  const alertProjectStalled = (userId: string, projectId: string, projectName: string) => {
    triggerAlert({
      userId,
      projectId,
      eventType: 'project_stalled',
      severity: 'medium',
      message: `Projeto "${projectName}" sem cronograma há mais de 3 dias`,
      metadata: { project_name: projectName }
    });
  };

  const alertAICostSpike = (dailyCost: number, limit: number) => {
    triggerAlert({
      eventType: 'ai_cost_spike',
      severity: dailyCost > limit * 2 ? 'critical' : 'high',
      message: `Custo de IA hoje: $${dailyCost.toFixed(2)} (limite: $${limit})`,
      metadata: { daily_cost: dailyCost, limit }
    });
  };

  const alertSubscriptionExpiring = (userId: string, daysUntilExpire: number, planName: string) => {
    triggerAlert({
      userId,
      eventType: 'subscription_expiring',
      severity: daysUntilExpire <= 1 ? 'high' : 'medium',
      message: `Plano "${planName}" expira em ${daysUntilExpire} dia(s)`,
      metadata: { days_until_expire: daysUntilExpire, plan_name: planName }
    });
  };

  return {
    triggerAlert,
    alertUserInactive,
    alertProjectStalled,
    alertAICostSpike,
    alertSubscriptionExpiring,
    loadAlertConfigs
  };
}

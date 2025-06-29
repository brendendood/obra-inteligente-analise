
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

type AnalyticsEvent = 
  | 'signup' 
  | 'login' 
  | 'logout' 
  | 'project_created' 
  | 'file_uploaded' 
  | 'ai_used' 
  | 'plan_upgraded' 
  | 'plan_downgraded' 
  | 'payment_success' 
  | 'payment_failed';

export function useAnalyticsTracker() {
  const { user } = useAuth();
  const sessionStartTime = useRef<number>(Date.now());
  const sessionId = useRef<string>(Math.random().toString(36).substring(7));

  useEffect(() => {
    // Atualizar last_active a cada 30 segundos se o usuário estiver ativo
    const interval = setInterval(() => {
      if (user && document.visibilityState === 'visible') {
        updateLastActive();
      }
    }, 30000);

    // Capturar saída da página para calcular duração da sessão
    const handleBeforeUnload = () => {
      if (user) {
        const sessionDuration = Math.floor((Date.now() - sessionStartTime.current) / 1000);
        trackEvent('logout', { session_duration: sessionDuration });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user]);

  const updateLastActive = async () => {
    if (!user) return;

    try {
      await supabase
        .from('user_analytics')
        .upsert({
          user_id: user.id,
          session_id: sessionId.current,
          event_type: 'login',
          last_active: new Date().toISOString(),
          page_url: window.location.pathname,
          event_data: { page: window.location.pathname }
        }, {
          onConflict: 'user_id,session_id,event_type'
        });
    } catch (error) {
      console.error('❌ ANALYTICS: Erro ao atualizar last_active:', error);
    }
  };

  const trackEvent = async (
    eventType: AnalyticsEvent, 
    eventData?: Record<string, any>
  ) => {
    if (!user) return;

    try {
      const sessionDuration = Math.floor((Date.now() - sessionStartTime.current) / 1000);
      
      await supabase
        .from('user_analytics')
        .insert({
          user_id: user.id,
          session_id: sessionId.current,
          event_type: eventType,
          event_data: {
            ...eventData,
            page_url: window.location.pathname,
            user_agent: navigator.userAgent,
            timestamp: new Date().toISOString()
          },
          session_duration: sessionDuration,
          last_active: new Date().toISOString(),
          page_url: window.location.pathname
        });

      console.log(`📊 ANALYTICS: Evento ${eventType} registrado`);
    } catch (error) {
      console.error('❌ ANALYTICS: Erro ao registrar evento:', error);
    }
  };

  const trackAIUsage = async (
    featureType: string,
    tokensUsed?: number,
    costUsd?: number,
    projectId?: string
  ) => {
    if (!user) return;

    try {
      // Registrar no analytics geral
      await trackEvent('ai_used', {
        feature_type: featureType,
        tokens_used: tokensUsed,
        cost_usd: costUsd,
        project_id: projectId
      });

      // Registrar nas métricas específicas de IA
      await supabase
        .from('ai_usage_metrics')
        .insert({
          user_id: user.id,
          project_id: projectId,
          feature_type: featureType,
          tokens_used: tokensUsed || 0,
          cost_usd: costUsd || 0
        });

      console.log(`🤖 AI ANALYTICS: Uso de IA registrado - ${featureType}`);
    } catch (error) {
      console.error('❌ AI ANALYTICS: Erro ao registrar uso de IA:', error);
    }
  };

  return {
    trackEvent,
    trackAIUsage,
    updateLastActive,
  };
}

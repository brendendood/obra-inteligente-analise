
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { gamificationService } from '@/services/gamificationService';
import { useReferralSystem } from '@/hooks/useReferralSystem';

type AnalyticsEvent = 
  | 'signup' 
  | 'login' 
  | 'logout' 
  | 'project_created' 
  | 'file_uploaded' 
  | 'ai_used' 
  | 'budget_generated'
  | 'schedule_created'
  | 'plan_upgraded' 
  | 'plan_downgraded' 
  | 'payment_success' 
  | 'payment_failed';

export function useAnalyticsTracker() {
  const { user } = useAuth();
  const sessionStartTime = useRef<number>(Date.now());
  const sessionId = useRef<string>(Math.random().toString(36).substring(7));
  const { markFirstProjectCreated } = useReferralSystem();

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

      // Track gamification points for specific events
      await trackGamificationEvent(eventType, eventData);

      console.log(`📊 ANALYTICS: Evento ${eventType} registrado`);
    } catch (error) {
      console.error('❌ ANALYTICS: Erro ao registrar evento:', error);
    }
  };

  const trackGamificationEvent = async (eventType: AnalyticsEvent, eventData?: Record<string, any>) => {
    if (!user) return;

    try {
      let result;
      switch (eventType) {
        case 'project_created':
          result = await gamificationService.trackAction(user.id, 'PROJECT_CREATED', eventData);
          // Mark first project as created for referral rewards
          markFirstProjectCreated();
          break;
        case 'file_uploaded':
          result = await gamificationService.trackAction(user.id, 'FILE_UPLOADED', eventData);
          break;
        case 'ai_used':
          result = await gamificationService.trackAction(user.id, 'AI_USED', eventData);
          break;
        case 'budget_generated':
          result = await gamificationService.trackAction(user.id, 'BUDGET_GENERATED', eventData);
          break;
        case 'schedule_created':
          result = await gamificationService.trackAction(user.id, 'SCHEDULE_CREATED', eventData);
          break;
        case 'login':
          await gamificationService.updateDailyStreak(user.id);
          break;
        default:
          break;
      }

      // CORREÇÃO: Log de achievements desbloqueados
      if (result?.newAchievements && result.newAchievements.length > 0) {
        console.log('🏆 NEW ACHIEVEMENTS UNLOCKED:', result.newAchievements);
        // TODO: Implementar notificação visual de achievement
      }
    } catch (error) {
      console.error('❌ GAMIFICATION: Erro ao rastrear evento:', error);
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

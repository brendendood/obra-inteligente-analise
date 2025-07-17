
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TopFeature {
  feature: string;
  count: number;
}

interface AdvancedAnalytics {
  total_users: number;
  active_users_week: number;
  active_users_month: number;
  avg_session_duration: number;
  total_ai_calls: number;
  ai_cost_month: number;
  conversion_rate: number;
  top_features: TopFeature[];
}

interface UserEngagement {
  user_id: string;
  total_sessions: number;
  avg_session_duration: number;
  total_events: number;
  last_activity: string;
  engagement_score: number;
}

export function useAdvancedAnalytics() {
  const [analytics, setAnalytics] = useState<AdvancedAnalytics | null>(null);
  const [userEngagement, setUserEngagement] = useState<UserEngagement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadAdvancedAnalytics();
    loadUserEngagement();
  }, []);

  const parseTopFeatures = (rawData: any): TopFeature[] => {
    try {
      if (!rawData) return [];
      
      // Se for string, tentar fazer parse
      if (typeof rawData === 'string') {
        const parsed = JSON.parse(rawData);
        return Array.isArray(parsed) ? parsed : [];
      }
      
      // Se for array, retornar diretamente
      if (Array.isArray(rawData)) {
        return rawData.map(item => ({
          feature: String(item.feature || 'unknown'),
          count: Number(item.count || 0)
        }));
      }
      
      return [];
    } catch (error) {
      console.error('❌ ANALYTICS: Erro ao processar top_features:', error);
      return [];
    }
  };

  const loadAdvancedAnalytics = async () => {
    try {
      setError(null);
      console.log('🔄 ADVANCED ANALYTICS: Carregando analytics avançado...');

      // Verificar se a função RPC existe
      const { data: functions, error: funcError } = await supabase
        .rpc('get_advanced_admin_analytics')
        .limit(1);

      if (funcError) {
        console.error('❌ ADVANCED ANALYTICS: Função RPC não encontrada:', funcError);
        
        // Carregar dados básicos como fallback
        const { data: users } = await supabase.from('user_profiles').select('id', { count: 'exact' });
        const userCount = users?.length || 0;

        setAnalytics({
          total_users: userCount,
          active_users_week: 0,
          active_users_month: 0,
          avg_session_duration: 0,
          total_ai_calls: 0,
          ai_cost_month: 0,
          conversion_rate: 0,
          top_features: [],
        });

        toast({
          title: "Analytics básico carregado",
          description: "Algumas métricas avançadas não estão disponíveis",
          variant: "default",
        });
        return;
      }

      if (functions && functions.length > 0) {
        const result = functions[0];
        
        setAnalytics({
          total_users: Number(result.total_users) || 0,
          active_users_week: Number(result.active_users_week) || 0,
          active_users_month: Number(result.active_users_month) || 0,
          avg_session_duration: Number(result.avg_session_duration) || 0,
          total_ai_calls: Number(result.total_ai_calls) || 0,
          ai_cost_month: Number(result.ai_cost_month) || 0,
          conversion_rate: Number(result.conversion_rate) || 0,
          top_features: parseTopFeatures(result.top_features),
        });
      } else {
        // Fallback com dados zerados
        setAnalytics({
          total_users: 0,
          active_users_week: 0,
          active_users_month: 0,
          avg_session_duration: 0,
          total_ai_calls: 0,
          ai_cost_month: 0,
          conversion_rate: 0,
          top_features: [],
        });
      }

      console.log('✅ ADVANCED ANALYTICS: Carregado com sucesso');
    } catch (error) {
      console.error('💥 ADVANCED ANALYTICS: Erro crítico:', error);
      setError('Erro ao carregar analytics avançado');
      
      // Fallback em caso de erro
      setAnalytics({
        total_users: 0,
        active_users_week: 0,
        active_users_month: 0,
        avg_session_duration: 0,
        total_ai_calls: 0,
        ai_cost_month: 0,
        conversion_rate: 0,
        top_features: [],
      });
    }
  };

  const loadUserEngagement = async () => {
    try {
      console.log('🔄 USER ENGAGEMENT: Carregando engajamento...');

      const { data, error } = await supabase.rpc('calculate_user_engagement');

      if (error) {
        console.error('❌ USER ENGAGEMENT: Erro ao carregar:', error);
        setUserEngagement([]);
        return;
      }

      const engagementData = (Array.isArray(data) ? data : []).map((item: any) => ({
        user_id: String(item.user_id || ''),
        total_sessions: Number(item.total_sessions) || 0,
        avg_session_duration: Number(item.avg_session_duration) || 0,
        total_events: Number(item.total_events) || 0,
        last_activity: String(item.last_activity || new Date().toISOString()),
        engagement_score: Number(item.engagement_score) || 0,
      }));

      setUserEngagement(engagementData);
      console.log('✅ USER ENGAGEMENT: Carregado com sucesso:', engagementData.length);
    } catch (error) {
      console.error('💥 USER ENGAGEMENT: Erro crítico:', error);
      setUserEngagement([]);
    } finally {
      setLoading(false);
    }
  };

  const triggerSegmentUpdate = async () => {
    try {
      console.log('🔄 SEGMENT UPDATE: Atualizando segmentos...');
      
      const { error } = await supabase.rpc('update_user_segments');
      
      if (error) {
        console.error('❌ SEGMENT UPDATE: Erro:', error);
        throw error;
      }

      toast({
        title: "Segmentos atualizados",
        description: "Tags automáticas foram recalculadas com sucesso",
      });
      
      console.log('✅ SEGMENT UPDATE: Concluído');
    } catch (error) {
      console.error('💥 SEGMENT UPDATE: Erro crítico:', error);
      toast({
        title: "Erro ao atualizar segmentos",
        description: "Não foi possível recalcular as tags automáticas",
        variant: "destructive",
      });
    }
  };

  return {
    analytics,
    userEngagement,
    loading,
    error,
    refreshAnalytics: loadAdvancedAnalytics,
    refreshEngagement: loadUserEngagement,
    triggerSegmentUpdate,
  };
}

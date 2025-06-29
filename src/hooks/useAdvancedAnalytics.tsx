
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdvancedAnalytics {
  total_users: number;
  active_users_week: number;
  active_users_month: number;
  avg_session_duration: number;
  total_ai_calls: number;
  ai_cost_month: number;
  conversion_rate: number;
  top_features: Array<{ feature: string; count: number }>;
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
  const { toast } = useToast();

  useEffect(() => {
    loadAdvancedAnalytics();
    loadUserEngagement();
  }, []);

  const loadAdvancedAnalytics = async () => {
    try {
      console.log('🔄 ADVANCED ANALYTICS: Carregando analytics avançado...');

      const { data, error } = await supabase.rpc('get_advanced_admin_analytics');

      if (error) {
        console.error('❌ ADVANCED ANALYTICS: Erro ao carregar:', error);
        toast({
          title: "Erro ao carregar analytics",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data && data.length > 0) {
        const result = data[0];
        setAnalytics({
          total_users: Number(result.total_users) || 0,
          active_users_week: Number(result.active_users_week) || 0,
          active_users_month: Number(result.active_users_month) || 0,
          avg_session_duration: Number(result.avg_session_duration) || 0,
          total_ai_calls: Number(result.total_ai_calls) || 0,
          ai_cost_month: Number(result.ai_cost_month) || 0,
          conversion_rate: Number(result.conversion_rate) || 0,
          top_features: result.top_features || [],
        });
      }

      console.log('✅ ADVANCED ANALYTICS: Carregado com sucesso');
    } catch (error) {
      console.error('💥 ADVANCED ANALYTICS: Erro crítico:', error);
    }
  };

  const loadUserEngagement = async () => {
    try {
      const { data, error } = await supabase.rpc('calculate_user_engagement');

      if (error) {
        console.error('❌ USER ENGAGEMENT: Erro ao carregar:', error);
        return;
      }

      setUserEngagement(data || []);
    } catch (error) {
      console.error('💥 USER ENGAGEMENT: Erro crítico:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerSegmentUpdate = async () => {
    try {
      const { error } = await supabase.rpc('update_user_segments');
      
      if (error) throw error;

      toast({
        title: "Segmentos atualizados",
        description: "Tags automáticas foram recalculadas com sucesso",
      });
    } catch (error) {
      console.error('❌ SEGMENT UPDATE: Erro:', error);
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
    refreshAnalytics: loadAdvancedAnalytics,
    refreshEngagement: loadUserEngagement,
    triggerSegmentUpdate,
  };
}

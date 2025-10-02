"use client";

import { useMemo } from "react";
import { useUserPlan } from "@/hooks/use-user-plan";
import { canAccessFeature, FEATURE_REQUIREMENTS, PLAN_FEATURES, type PlanTier } from "@/lib/domain/plans";
import { supabase } from "@/lib/supabase/client";

function currentPeriodYM(date = new Date()) {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  return `${y}-${m}`;
}

// Mapeamento de features legadas para o sistema unificado
const LEGACY_FEATURE_MAP: Record<string, string> = {
  "orcamento": "budget",
  "cronograma": "schedule",
  "assistente": "ai_project_assistant",
  "documentos": "technical_analysis",
  "ia": "ai_general",
  "crm": "crm"
};

type Module = 
  | 'orcamento' 
  | 'cronograma' 
  | 'assistente' 
  | 'documentos' 
  | 'ia' 
  | 'crm';

export function useFeatureAccess() {
  const { plan, loading, error, refetch } = useUserPlan();

  const hasAccess = useMemo(() => {
    return (featureId: string) => {
      // Mapear feature legada para sistema novo se necessário
      const mappedFeature = LEGACY_FEATURE_MAP[featureId] || featureId;
      console.log(`[useFeatureAccess] Checking "${featureId}" (mapped: "${mappedFeature}") - Plan:`, plan);
      return canAccessFeature(plan?.plan_tier, mappedFeature);
    };
  }, [plan?.plan_tier, plan]);

  const canAccessModule = useMemo(() => {
    return (module: Module): boolean => {
      if (loading) return false;
      if (!plan) return false;
      const mappedFeature = LEGACY_FEATURE_MAP[module] || module;
      return canAccessFeature(plan.plan_tier, mappedFeature);
    };
  }, [loading, plan]);

  const getAiUsage = async () => {
    const period = currentPeriodYM();
    const { data: sessionData } = await supabase.auth.getSession();
    const uid = sessionData.session?.user?.id;
    if (!uid) return { count: 0, period, limit: 0, remaining: 0, nearLimit: false };

    const { data } = await supabase
      .from("ai_message_usage")
      .select("count, period_ym")
      .eq("user_id", uid)
      .eq("period_ym", period)
      .maybeSingle();

    // CRÍTICO: Não usar fallback para plano, usar o plano real ou FREE
    const tier = plan?.plan_tier ?? "FREE";
    const limit = PLAN_FEATURES[tier].aiMessageLimit;
    const count = data?.count ?? 0;
    const numericLimit = limit === "unlimited" ? Infinity : limit;
    const remaining = Math.max(0, numericLimit - count);
    const nearLimit = numericLimit !== Infinity && count / numericLimit >= 0.8;

    return { count, period, limit, remaining, nearLimit };
  };

  const canUploadProject = async (): Promise<boolean> => {
    if (!plan) return false;

    const tier = plan.plan_tier;

    // PRO e ENTERPRISE têm uploads ilimitados
    if (tier === "PRO" || tier === "ENTERPRISE") {
      return true;
    }

    // FREE (trial) só pode ter 1 projeto
    if (tier === "FREE") {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return false;
      
      const { count, error } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Error checking project count:', error);
        return false;
      }

      return (count || 0) < 1;
    }

    // BASIC tem limite maior
    return true;
  };

  return {
    loading,
    error,
    plan,
    hasAccess,
    canAccessModule,
    canUploadProject,
    getAiUsage,
    canSendAiMessage: async () => {
      const { trackAIMessage } = await import("@/lib/api/ai-tracking");
      return trackAIMessage();
    },
    refetchPlan: refetch,
  };
}
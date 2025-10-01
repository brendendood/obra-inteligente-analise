"use client";

import { useMemo } from "react";
import { useUserPlan } from "@/hooks/use-user-plan";
import { canAccessFeature, AI_LIMITS } from "@/lib/permissions/feature-access";
import { supabase } from "@/lib/supabase/client";

function currentPeriodYM(date = new Date()) {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  return `${y}-${m}`;
}

export function useFeatureAccess() {
  const { plan, loading, error, refetch } = useUserPlan();

  const hasAccess = useMemo(() => {
    return (featureId: string) => {
      // Debug log para rastrear acesso
      console.log(`[useFeatureAccess] Checking "${featureId}" - Plan:`, plan);
      return canAccessFeature(plan?.plan_tier, featureId);
    };
  }, [plan?.plan_tier, plan]);

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
    const limit = AI_LIMITS[tier] ?? 50; // Limite mínimo se não definido
    const count = data?.count ?? 0;
    const numericLimit = limit === "unlimited" ? Infinity : limit;
    const remaining = Math.max(0, numericLimit - count);
    const nearLimit = numericLimit !== Infinity && count / numericLimit >= 0.8;

    return { count, period, limit, remaining, nearLimit };
  };

  return {
    loading,
    error,
    plan,
    hasAccess,
    getAiUsage,
    canSendAiMessage: async () => {
      const { trackAIMessage } = await import("@/lib/api/ai-tracking");
      return trackAIMessage();
    },
    refetchPlan: refetch,
  };
}
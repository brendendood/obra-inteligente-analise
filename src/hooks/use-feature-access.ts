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
    return (featureId: string) => canAccessFeature(plan?.plan_tier, featureId);
  }, [plan?.plan_tier]);

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

    const tier = plan?.plan_tier ?? "FREE";
    const limit = AI_LIMITS[tier];
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
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

// Retorna o plano atual do usuário e utilidades de acesso por feature.
// Ajuste o mapeamento feature → plano mínimo conforme seu produto.

export type PlanTier = "trial" | "basic" | "pro" | "enterprise";

type FeatureKey =
  | "orcamento"
  | "cronograma"
  | "assistente"
  | "documentos"
  | "crm"
  | "ia";

const requiredPlanByFeature: Record<FeatureKey, PlanTier> = {
  orcamento: "trial",       // liberado no trial
  cronograma: "pro",
  assistente: "pro",
  documentos: "basic",
  crm: "pro",
  ia: "pro",
};

export function useFeatureAccess() {
  const [loading, setLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState<PlanTier>("trial");

  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) {
          setCurrentPlan("trial");
          setLoading(false);
          return;
        }

        const { data } = await supabase
          .from("user_plans")
          .select("plan_tier")
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (data?.plan_tier) {
          // Mapear planos do DB para os tipos esperados
          const tierMap: Record<string, PlanTier> = {
            FREE: "trial",
            BASIC: "basic",
            PRO: "pro",
            ENTERPRISE: "enterprise",
          };
          setCurrentPlan(tierMap[data.plan_tier] || "trial");
        }
      } catch (error) {
        console.error("Error fetching user plan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPlan();
  }, []);

  const rank: Record<PlanTier, number> = {
    trial: 0,
    basic: 1,
    pro: 2,
    enterprise: 3,
  };

  function hasAccess(feature: FeatureKey) {
    const min = requiredPlanByFeature[feature];
    return rank[currentPlan] >= rank[min];
  }

  function canAccessModule(module: FeatureKey) {
    return hasAccess(module);
  }

  async function canUploadProject(): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return false;

      // Trial pode ter apenas 1 projeto
      if (currentPlan === "trial") {
        const { count } = await supabase
          .from("projects")
          .select("*", { count: "exact", head: true })
          .eq("user_id", session.user.id);
        
        return (count || 0) < 1;
      }

      // Outros planos têm limite maior ou ilimitado
      return true;
    } catch (error) {
      console.error("Error checking upload permission:", error);
      return false;
    }
  }

  function nextRequiredPlan(feature: FeatureKey): PlanTier {
    return requiredPlanByFeature[feature];
  }

  return { 
    currentPlan, 
    loading,
    hasAccess, 
    canAccessModule,
    canUploadProject,
    nextRequiredPlan 
  };
}

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
  // Pegue do seu estado real (Supabase / context / /api/me):
  // Aqui lemos de window.__APP__ como exemplo, substitua pela sua fonte.
  const currentPlan: PlanTier =
    (globalThis as any).__APP__?.account?.planTier ?? "trial";

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

  function nextRequiredPlan(feature: FeatureKey): PlanTier {
    return requiredPlanByFeature[feature];
  }

  return { currentPlan, hasAccess, nextRequiredPlan };
}

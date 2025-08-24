import type { PlanTier } from "@/lib/supabase/client";

/** Ordem de poder do plano */
const POWER: PlanTier[] = ["FREE", "BASIC", "PRO", "ENTERPRISE"];
const indexOf = (t?: PlanTier) => (t ? POWER.indexOf(t) : -1);
const atLeast = (cur?: PlanTier, req?: PlanTier) => indexOf(cur) >= indexOf(req);

/** Mapeamento de features -> menor plano necessário */
export const FEATURE_MIN_TIER: Record<string, PlanTier> = {
  budget: "BASIC",    // Budget bloqueado para FREE
  schedule: "BASIC",  // Schedule bloqueado para FREE
  export: "BASIC",    // Export bloqueado para FREE
  ai_assistant: "FREE", // AI acessível a todos, porém com limites por plano
};

export function canAccessFeature(plan: PlanTier | undefined, featureId: string): boolean {
  const req = FEATURE_MIN_TIER[featureId] ?? "FREE";
  return atLeast(plan, req);
}

/** Limites de mensagens de IA por plano */
export const AI_LIMITS: Record<PlanTier, number | "unlimited"> = {
  FREE: 50,
  BASIC: 500,
  PRO: 2000,
  ENTERPRISE: "unlimited",
};
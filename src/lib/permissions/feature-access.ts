import type { PlanTier } from "@/lib/supabase/client";

/** Ordem de poder do plano */
const POWER: PlanTier[] = ["BASIC", "PRO", "ENTERPRISE"];
const indexOf = (t?: PlanTier) => (t ? POWER.indexOf(t) : -1);
const atLeast = (cur?: PlanTier, req?: PlanTier) => indexOf(cur) >= indexOf(req);

/** Mapeamento de features -> menor plano necessário */
export const FEATURE_MIN_TIER: Record<string, PlanTier> = {
  budget: "BASIC",    // Budget disponível a partir do Basic
  schedule: "BASIC",  // Schedule disponível a partir do Basic
  export: "PRO",      // Export disponível apenas a partir do PRO
  ai_assistant: "BASIC", // AI acessível a partir do Basic
};

export function canAccessFeature(plan: PlanTier | undefined, featureId: string): boolean {
  const req = FEATURE_MIN_TIER[featureId] ?? "BASIC";
  return atLeast(plan, req);
}

/** Limites de mensagens de IA por plano */
export const AI_LIMITS: Partial<Record<PlanTier, number | "unlimited">> = {
  BASIC: 150,
  PRO: 400,
  ENTERPRISE: 1000,
};
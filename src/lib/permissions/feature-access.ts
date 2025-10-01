import type { PlanTier } from "@/lib/supabase/client";

/** Ordem de poder do plano */
const POWER: PlanTier[] = ["BASIC", "PRO", "ENTERPRISE"];
const indexOf = (t?: PlanTier) => (t ? POWER.indexOf(t) : -1);
const atLeast = (cur?: PlanTier, req?: PlanTier) => indexOf(cur) >= indexOf(req);

/** Mapeamento de features -> menor plano necessário */
export const FEATURE_MIN_TIER: Record<string, PlanTier> = {
  budget: "BASIC",           // Budget disponível a partir do Basic
  schedule: "BASIC",         // Schedule disponível a partir do Basic
  export_budget: "PRO",      // Export de orçamento apenas a partir do PRO
  export_schedule: "PRO",    // Export de cronograma apenas a partir do PRO
  export_documents: "PRO",   // Export de documentos apenas a partir do PRO
  ai_assistant: "BASIC",     // IA geral acessível a partir do Basic
  ai_project_assistant: "PRO", // Assistente IA específica do projeto apenas a partir do PRO
  technical_analysis: "PRO", // Análise técnica apenas a partir do PRO
  crm: "ENTERPRISE",         // CRM apenas no Enterprise
  api_integrations: "ENTERPRISE", // Integrações via API apenas no Enterprise
};

export function canAccessFeature(plan: PlanTier | undefined, featureId: string): boolean {
  const req = FEATURE_MIN_TIER[featureId] ?? "BASIC";
  return atLeast(plan, req);
}

/** Limites de mensagens de IA por plano */
export const AI_LIMITS: Partial<Record<PlanTier, number | "unlimited">> = {
  BASIC: 300,
  PRO: 800,
  ENTERPRISE: 1500,
};
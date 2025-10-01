import type { PlanTier } from "@/lib/supabase/client";

/** Ordem de poder do plano */
const POWER: PlanTier[] = ["BASIC", "PRO", "ENTERPRISE"];
const indexOf = (t?: PlanTier) => (t ? POWER.indexOf(t) : -1);
const atLeast = (cur?: PlanTier, req?: PlanTier) => indexOf(cur) >= indexOf(req);

/** Mapeamento de features -> menor plano necessário */
export const FEATURE_MIN_TIER: Record<string, PlanTier> = {
  budget: "BASIC",                    // Orçamento disponível a partir do Basic
  schedule: "BASIC",                  // Cronograma disponível a partir do Basic
  ai_general: "BASIC",                // IA geral (/ia) disponível a partir do Basic
  export_budget: "PRO",               // Exportação de orçamento apenas PRO+
  export_schedule: "PRO",             // Exportação de cronograma apenas PRO+
  ai_project_assistant: "PRO",        // Assistente IA específica do projeto apenas PRO+
  technical_analysis: "PRO",          // Documentos de análise técnica apenas PRO+
  export_technical_analysis: "PRO",   // Exportação de análise técnica apenas PRO+
  crm: "ENTERPRISE",                  // CRM apenas ENTERPRISE
  export_crm: "ENTERPRISE",           // Exportação CRM apenas ENTERPRISE
  api_integrations: "ENTERPRISE",     // Integrações externas via API apenas ENTERPRISE
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
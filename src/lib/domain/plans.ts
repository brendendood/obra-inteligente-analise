/**
 * Unified Plan System - Single Source of Truth
 * Consolidates all plan-related logic, types, and features
 */

// ============= Core Types =============

export type PlanTier = "FREE" | "BASIC" | "PRO" | "ENTERPRISE";
export type BillingCycle = "mensal" | "anual";

export type FeatureKey =
  | "budget"
  | "schedule"
  | "ai_general"
  | "export_budget"
  | "export_schedule"
  | "ai_project_assistant"
  | "technical_analysis"
  | "export_technical_analysis"
  | "crm"
  | "export_crm"
  | "api_integrations";

// ============= Feature Requirements =============

export const FEATURE_REQUIREMENTS: Record<FeatureKey, PlanTier> = {
  budget: "BASIC",
  schedule: "BASIC",
  ai_general: "BASIC",
  export_budget: "PRO",
  export_schedule: "PRO",
  ai_project_assistant: "PRO",
  technical_analysis: "PRO",
  export_technical_analysis: "PRO",
  crm: "ENTERPRISE",
  export_crm: "ENTERPRISE",
  api_integrations: "ENTERPRISE",
};

// ============= Plan Features & Limits =============

export interface PlanFeatures {
  name: string;
  displayName: string;
  price: { monthly: number; annual: number };
  projectLimit: number | null; // null = unlimited
  aiMessageLimit: number | "unlimited";
  features: string[];
  icon: string;
  color: string;
  badgeStyle: string;
}

export const PLAN_FEATURES: Record<PlanTier, PlanFeatures> = {
  FREE: {
    name: "FREE",
    displayName: "Teste Grátis",
    price: { monthly: 0, annual: 0 },
    projectLimit: 1,
    aiMessageLimit: 50,
    features: [
      "1 projeto",
      "50 mensagens IA/mês",
      "Upload de documentos",
      "Análise básica",
    ],
    icon: "🎁",
    color: "slate",
    badgeStyle: "bg-slate-100 text-slate-800 border-slate-200",
  },
  BASIC: {
    name: "BASIC",
    displayName: "Basic",
    price: { monthly: 49, annual: 490 },
    projectLimit: 5,
    aiMessageLimit: 500,
    features: [
      "5 projetos",
      "500 mensagens IA/mês",
      "Orçamento detalhado",
      "Cronograma completo",
      "IA geral",
      "Suporte por email",
    ],
    icon: "📦",
    color: "blue",
    badgeStyle: "bg-blue-100 text-blue-800 border-blue-200",
  },
  PRO: {
    name: "PRO",
    displayName: "Pro",
    price: { monthly: 149, annual: 1490 },
    projectLimit: 20,
    aiMessageLimit: 2000,
    features: [
      "20 projetos",
      "2000 mensagens IA/mês",
      "Exportação de orçamentos",
      "Exportação de cronogramas",
      "Assistente IA de projeto",
      "Análise técnica avançada",
      "Suporte prioritário",
    ],
    icon: "🚀",
    color: "indigo",
    badgeStyle: "bg-indigo-100 text-indigo-800 border-indigo-200",
  },
  ENTERPRISE: {
    name: "ENTERPRISE",
    displayName: "Enterprise",
    price: { monthly: 499, annual: 4990 },
    projectLimit: null, // unlimited
    aiMessageLimit: "unlimited",
    features: [
      "Projetos ilimitados",
      "Mensagens IA ilimitadas",
      "CRM completo",
      "Integrações via API",
      "Gerente de conta dedicado",
      "Suporte 24/7",
      "Treinamento personalizado",
    ],
    icon: "👑",
    color: "emerald",
    badgeStyle: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
};

// ============= Plan Hierarchy =============

const PLAN_HIERARCHY: PlanTier[] = ["FREE", "BASIC", "PRO", "ENTERPRISE"];

function getPlanIndex(tier: PlanTier): number {
  return PLAN_HIERARCHY.indexOf(tier);
}

export function isPlanAtLeast(current: PlanTier, required: PlanTier): boolean {
  return getPlanIndex(current) >= getPlanIndex(required);
}

// ============= Feature Access =============

export function canAccessFeature(
  planTier: PlanTier | undefined,
  feature: string
): boolean {
  if (!planTier) {
    console.warn(`[ACCESS DENIED] Feature "${feature}" blocked - No plan defined`);
    return false;
  }

  const required = FEATURE_REQUIREMENTS[feature as FeatureKey] ?? "BASIC";
  const hasAccess = isPlanAtLeast(planTier, required);

  console.log(
    `[ACCESS CHECK] Feature "${feature}" - Plan: ${planTier}, Required: ${required}, Access: ${hasAccess}`
  );
  return hasAccess;
}

// ============= Plan Utilities =============

export function getPlanFeatures(tier: PlanTier): PlanFeatures {
  return PLAN_FEATURES[tier];
}

export function getPlanDisplayName(tier: PlanTier | string): string {
  const normalized = normalizePlanTier(tier);
  return PLAN_FEATURES[normalized].displayName;
}

export function getPlanIcon(tier: PlanTier | string): string {
  const normalized = normalizePlanTier(tier);
  return PLAN_FEATURES[normalized].icon;
}

export function getPlanColor(tier: PlanTier | string): string {
  const normalized = normalizePlanTier(tier);
  return PLAN_FEATURES[normalized].color;
}

export function getPlanBadgeStyle(tier: PlanTier | string): string {
  const normalized = normalizePlanTier(tier);
  return PLAN_FEATURES[normalized].badgeStyle;
}

export function getPlanPrice(tier: PlanTier | string, cycle: BillingCycle = "mensal"): number {
  const normalized = normalizePlanTier(tier);
  return cycle === "mensal" 
    ? PLAN_FEATURES[normalized].price.monthly 
    : PLAN_FEATURES[normalized].price.annual;
}

export function formatPlanPrice(tier: PlanTier | string, cycle: BillingCycle = "mensal"): string {
  const price = getPlanPrice(tier, cycle);
  if (price === 0) return "Grátis";
  return `R$ ${price}/${cycle === "mensal" ? "mês" : "ano"}`;
}

export function getPlanLimit(tier: PlanTier | string, extraCredits: number = 0): number {
  const normalized = normalizePlanTier(tier);
  const baseLimit = PLAN_FEATURES[normalized].projectLimit;
  
  if (baseLimit === null) return Infinity; // unlimited
  return baseLimit + extraCredits;
}

export function getPlanUsagePercentage(
  projectCount: number,
  tier: PlanTier | string,
  extraCredits: number = 0
): number {
  const limit = getPlanLimit(tier, extraCredits);
  if (limit === Infinity) return 0;
  return Math.min(100, (projectCount / limit) * 100);
}

export function shouldShowUpgradeWarning(
  projectCount: number,
  tier: PlanTier | string,
  extraCredits: number = 0
): boolean {
  const percentage = getPlanUsagePercentage(projectCount, tier, extraCredits);
  return percentage >= 80;
}

// ============= Plan Upgrades =============

export function getNextPlan(current: PlanTier | string): PlanTier | null {
  const normalized = normalizePlanTier(current);
  const currentIndex = getPlanIndex(normalized);
  
  if (currentIndex === -1 || currentIndex >= PLAN_HIERARCHY.length - 1) {
    return null; // Already at max or invalid
  }
  
  return PLAN_HIERARCHY[currentIndex + 1];
}

export function canUpgrade(tier: PlanTier | string): boolean {
  return getNextPlan(tier) !== null;
}

export function isMaxPlan(tier: PlanTier | string): boolean {
  const normalized = normalizePlanTier(tier);
  return normalized === "ENTERPRISE";
}

export function getUpgradeMessage(current: PlanTier | string): string {
  const next = getNextPlan(current);
  if (!next) return "Você já está no plano máximo!";
  
  const nextFeatures = PLAN_FEATURES[next];
  return `Faça upgrade para ${nextFeatures.displayName} e desbloqueie ${nextFeatures.features[0]}`;
}

// ============= Plan Normalization =============

export function normalizePlanTier(input?: string | null): PlanTier {
  if (!input) return "FREE";
  
  const s = input.toString().trim().toUpperCase();

  if (s.includes("ENTERPRISE")) return "ENTERPRISE";
  if (s.includes("PRO")) return "PRO";
  if (s.includes("BASIC")) return "BASIC";
  if (s.includes("FREE") || s.includes("TRIAL")) return "FREE";

  // Default fallback
  return "FREE";
}

// Legacy compatibility
export function planLabel(tier: PlanTier): string {
  return getPlanDisplayName(tier);
}

// Legacy type alias for compatibility
export type Plan = Exclude<PlanTier, "FREE">;

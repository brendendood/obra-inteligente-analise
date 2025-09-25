export type PlanCode = 'basic' | 'pro' | 'enterprise';

/**
 * Renderiza a quota de projetos baseada no plano e uso atual
 */
export function renderProjectQuota(planCode: PlanCode | string | null, used: number): string {
  if (!planCode) return `${used}/0`;
  
  const normalizedPlan = planCode.toLowerCase() as PlanCode;
  
  if (normalizedPlan === 'enterprise') {
    return 'Ilimitado';
  }
  
  const limit = normalizedPlan === 'basic' ? 5 : normalizedPlan === 'pro' ? 20 : 5;
  return `${used}/${limit}`;
}

/**
 * Verifica se o usuário pode fazer upgrade baseado no plano atual
 */
export function canShowUpgradeButton(planCode: PlanCode | string | null): boolean {
  if (!planCode) return false;
  
  const normalizedPlan = planCode.toLowerCase() as PlanCode;
  return normalizedPlan === 'basic' || normalizedPlan === 'pro';
}

/**
 * Obtém o limite de projetos para um plano específico
 */
export function getProjectLimit(planCode: PlanCode | string | null): number | null {
  if (!planCode) return 0;
  
  const normalizedPlan = planCode.toLowerCase() as PlanCode;
  
  switch (normalizedPlan) {
    case 'basic':
      return 5;
    case 'pro':
      return 20;
    case 'enterprise':
      return null; // Ilimitado
    default:
      return 5;
  }
}
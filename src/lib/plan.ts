export type Plan = 'BASIC' | 'PRO' | 'ENTERPRISE';

export function normalizePlan(input?: string | null): Plan {
  const s = (input ?? '').toString().trim().toUpperCase();

  if (s.includes('ENTERPRISE')) return 'ENTERPRISE';
  if (s.includes('PRO')) return 'PRO';
  // Qualquer coisa fora do esperado cai para BASIC automaticamente (sem FREE)
  return 'BASIC';
}

export function planLabel(plan: Plan): string {
  switch (plan) {
    case 'ENTERPRISE':
      return 'Enterprise';
    case 'PRO':
      return 'Pro';
    default:
      return 'Basic';
  }
}
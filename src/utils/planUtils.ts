
// Utilitários centralizados para planos de usuário

export type PlanType = 'free' | 'basic' | 'pro' | 'enterprise';

export interface PlanInfo {
  name: string;
  displayName: string;
  price: number;
  projectLimit: number;
  icon: string;
  color: string;
  badgeStyle: string;
  features: string[];
  limitations?: string[];
}

export const PLANS: Record<PlanType, PlanInfo> = {
  free: {
    name: 'free',
    displayName: 'Free',
    price: 0,
    projectLimit: 2,
    icon: '🆓',
    color: '#6B7280',
    badgeStyle: 'bg-gray-100 text-gray-600 border-gray-300',
    features: [
      'Até 2 projetos',
      'Análise básica de IA',
      'Visualização simples',
      'Suporte por email'
    ],
    limitations: [
      'Orçamentos limitados',
      'Sem cronogramas automáticos',
      'Sem exportação avançada'
    ]
  },
  basic: {
    name: 'basic',
    displayName: 'Basic',
    price: 29,
    projectLimit: 5,
    icon: '📋',
    color: '#059669',
    badgeStyle: 'bg-green-600 text-white border-green-600',
    features: [
      'Até 5 projetos',
      'IA básica com insights',
      'Orçamentos simples',
      'Cronogramas básicos',
      'Suporte por email',
      'Exportação PDF básica'
    ]
  },
  pro: {
    name: 'pro',
    displayName: 'Pro',
    price: 99,
    projectLimit: 25,
    icon: '⭐',
    color: '#2563EB',
    badgeStyle: 'bg-blue-600 text-white border-blue-600',
    features: [
      'Até 25 projetos',
      'IA avançada com insights',
      'Orçamentos detalhados',
      'Cronogramas automatizados',
      'Relatórios profissionais',
      'Suporte prioritário',
      'Exportação avançada (PDF/Excel)',
      'API básica'
    ]
  },
  enterprise: {
    name: 'enterprise',
    displayName: 'Enterprise',
    price: 199,
    projectLimit: 999,
    icon: '👑',
    color: '#8B5CF6',
    badgeStyle: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-600',
    features: [
      'Projetos ilimitados',
      'IA personalizada para sua empresa',
      'Dashboard avançado',
      'Relatórios personalizados',
      'Suporte dedicado 24/7',
      'Integrações customizadas',
      'Treinamento da equipe',
      'SLA garantido'
    ]
  }
};

export const getPlanInfo = (plan: string | PlanType): PlanInfo => {
  return PLANS[plan as PlanType] || PLANS.free;
};

export const getPlanDisplayName = (plan: string | PlanType): string => {
  return getPlanInfo(plan).displayName;
};

export const getPlanIcon = (plan: string | PlanType): string => {
  return getPlanInfo(plan).icon;
};

export const getPlanColor = (plan: string | PlanType): string => {
  return getPlanInfo(plan).color;
};

export const getPlanBadgeStyle = (plan: string | PlanType): string => {
  return getPlanInfo(plan).badgeStyle;
};

export const getPlanPrice = (plan: string | PlanType): number => {
  return getPlanInfo(plan).price;
};

export const getPlanLimit = (plan: string | PlanType, extraCredits: number = 0): number => {
  return getPlanInfo(plan).projectLimit + extraCredits;
};

export const getPlanFeatures = (plan: string | PlanType): string[] => {
  return getPlanInfo(plan).features;
};

export const getPlanLimitations = (plan: string | PlanType): string[] => {
  return getPlanInfo(plan).limitations || [];
};

export const getNextPlan = (currentPlan: string | PlanType): PlanType | null => {
  switch (currentPlan) {
    case 'free': return 'basic';
    case 'basic': return 'pro';
    case 'pro': return 'enterprise';
    case 'enterprise': return null; // Já é o plano máximo
    default: return 'basic';
  }
};

export const isMaxPlan = (plan: string | PlanType): boolean => {
  return plan === 'enterprise';
};

export const canUpgrade = (plan: string | PlanType): boolean => {
  return !isMaxPlan(plan);
};

export const getUpgradeMessage = (currentPlan: string | PlanType): string => {
  const nextPlan = getNextPlan(currentPlan);
  if (!nextPlan) return 'Você já está no plano máximo!';
  
  return `Upgrade para ${getPlanDisplayName(nextPlan)}`;
};

export const formatPlanPrice = (plan: string | PlanType): string => {
  const price = getPlanPrice(plan);
  return price === 0 ? 'Grátis' : `R$ ${price}/mês`;
};

export const getPlanUsagePercentage = (projectCount: number, plan: string | PlanType, extraCredits: number = 0): number => {
  const limit = getPlanLimit(plan, extraCredits);
  if (limit === 999) return 0; // Enterprise = ilimitado
  return Math.min((projectCount / limit) * 100, 100);
};

export const shouldShowUpgradeWarning = (projectCount: number, plan: string | PlanType, extraCredits: number = 0): boolean => {
  const percentage = getPlanUsagePercentage(projectCount, plan, extraCredits);
  return percentage >= 80 && canUpgrade(plan);
};

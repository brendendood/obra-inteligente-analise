
// Utilitários centralizados para planos de usuário

export type PlanType = 'basic' | 'pro' | 'enterprise';

export interface PlanInfo {
  name: string;
  displayName: string;
  price: number;
  projectLimit: number;
  messageLimit: number;
  userLimit: number;
  icon: string;
  color: string;
  badgeStyle: string;
  features: string[];
}

export const PLANS: Record<PlanType, PlanInfo> = {
  basic: {
    name: 'basic',
    displayName: 'Basic',
    price: 29.90,
    projectLimit: 5,
    messageLimit: 300,
    userLimit: 1,
    icon: '📋',
    color: '#059669',
    badgeStyle: 'bg-green-600 text-white border-green-600',
    features: [
      '300 mensagens de IA/mês',
      '5 projetos ativos',
      'Orçamento (sem exportação)',
      'Cronograma (sem exportação)',
      'IA geral',
      'Suporte em até 48h'
    ]
  },
  pro: {
    name: 'pro',
    displayName: 'Pro',
    price: 79.90,
    projectLimit: 10,
    messageLimit: 800,
    userLimit: 3,
    icon: '⭐',
    color: '#2563EB',
    badgeStyle: 'bg-blue-600 text-white border-blue-600',
    features: [
      'Tudo do Basic +',
      '800 mensagens de IA/mês',
      '10 projetos ativos',
      'Orçamento (com exportação)',
      'Cronograma (com exportação)',
      'IA geral',
      'Assistente IA específica do projeto',
      'Documentos de análise técnica (com exportação)',
      'Suporte prioritário (<24h)'
    ]
  },
  enterprise: {
    name: 'enterprise',
    displayName: 'Enterprise',
    price: 199.90,
    projectLimit: 50,
    messageLimit: 1500,
    userLimit: 10,
    icon: '👑',
    color: '#8B5CF6',
    badgeStyle: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-600',
    features: [
      'Tudo do Pro +',
      '1.500 mensagens de IA/mês',
      '50 projetos ativos',
      'Orçamento (com exportação)',
      'Cronograma (com exportação)',
      'IA geral',
      'Assistente IA específica do projeto',
      'Documentos de análise técnica (com exportação)',
      'CRM (com exportação em Excel)',
      'Integrações externas via API (em desenvolvimento)',
      'Suporte dedicado com gerente de conta'
    ]
  }
};

export const getPlanInfo = (plan: string | PlanType): PlanInfo => {
  return PLANS[plan as PlanType] || PLANS.basic;
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
  const planInfo = getPlanInfo(plan);
  // Retorna o limite total (base + projetos extras)
  return planInfo.projectLimit + extraCredits;
};

export const getPlanFeatures = (plan: string | PlanType): string[] => {
  return getPlanInfo(plan).features;
};

export const getPlanLimitations = (plan: string | PlanType): string[] => {
  return [];
};

export const getNextPlan = (currentPlan: string | PlanType): PlanType | null => {
  switch (currentPlan) {
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
  return `R$ ${price}/mês`;
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

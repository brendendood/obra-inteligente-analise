
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
      '50 mensagens de IA/mês',
      'Análise básica de plantas',
      'Visualização simples',
      'Suporte por email (até 72h)'
    ],
    limitations: [
      'Sem orçamentos automáticos',
      'Sem cronogramas',
      'Sem exportação',
      'Sem documentação técnica'
    ]
  },
  basic: {
    name: 'basic',
    displayName: 'Basic',
    price: 29.90,
    projectLimit: 5,
    icon: '📋',
    color: '#059669',
    badgeStyle: 'bg-green-600 text-white border-green-600',
    features: [
      'Agente Geral (normas brasileiras – ABNT)',
      'Uso individual',
      'Até 5 projetos',
      '500 mensagens de IA/mês',
      'Cronograma, orçamento e documentos básicos',
      'Exportação simples',
      '1 automação via webhook',
      'Suporte em até 48h'
    ]
  },
  pro: {
    name: 'pro',
    displayName: 'Pro',
    price: 79.90,
    projectLimit: 25,
    icon: '⭐',
    color: '#2563EB',
    badgeStyle: 'bg-blue-600 text-white border-blue-600',
    features: [
      'Agente Geral (normas brasileiras – ABNT)',
      'Colaboração com até 3 usuários inclusos',
      'Até 25 projetos',
      '2.000 mensagens de IA/mês',
      'Cronograma, orçamento e documentos avançados',
      'Permissões por papel',
      'Até 5 automações integradas',
      'Exportações avançadas',
      'Suporte prioritário (<24h)'
    ]
  },
  enterprise: {
    name: 'enterprise',
    displayName: 'Enterprise',
    price: 199.90,
    projectLimit: 999,
    icon: '👑',
    color: '#8B5CF6',
    badgeStyle: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-600',
    features: [
      'Agente Geral (normas brasileiras – ABNT)',
      'Até 10 usuários inclusos',
      'Projetos ilimitados',
      'Mensagens de IA ilimitadas',
      '50 GB de anexos',
      'SSO (Single Sign-On)',
      'Auditoria completa',
      'Integrações avançadas',
      'SLA 99,9%',
      'Gerente de conta dedicado',
      'Contrato customizado',
      'Onboarding e treinamento'
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
  const planInfo = getPlanInfo(plan);
  if (plan === 'enterprise') {
    return 999999; // Ilimitado para enterprise
  }
  // Retorna o limite total (base + projetos extras)
  return planInfo.projectLimit + extraCredits;
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

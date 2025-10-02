/**
 * Core Facades - Funções utilitárias e hooks centrais
 * Re-exports para facilitar importação e estabilizar API pública
 */

// Hooks de navegação e projeto
export { useProjectNavigation } from '@/hooks/useProjectNavigation';

// Utilitários centrais
export { cn } from '@/lib/utils';

// Validação de autenticação
export { validateEmail, validatePassword, formatAuthError } from '@/utils/authValidation';

// Sanitização de conteúdo
export { sanitizeAIContent } from '@/utils/contentSanitizer';

// Utilitários de planos (agora do domain unificado)
export { 
  getPlanDisplayName, 
  getPlanLimit, 
  getPlanIcon, 
  getPlanBadgeStyle,
  getUpgradeMessage,
  canUpgrade,
  getNextPlan,
  getPlanPrice,
  formatPlanPrice,
  getPlanUsagePercentage,
  shouldShowUpgradeWarning,
  isMaxPlan,
  getPlanFeatures,
  type PlanTier,
  type FeatureKey,
} from '@/lib/domain/plans';

// Validação e segurança
export { validateUserInput, sanitizeFileName } from '@/utils/securityValidation';
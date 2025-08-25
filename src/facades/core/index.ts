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

// Utilitários de planos
export { 
  getPlanDisplayName, 
  getPlanLimit, 
  getPlanIcon, 
  getPlanBadgeStyle,
  getUpgradeMessage,
  canUpgrade,
  getNextPlan
} from '@/utils/planUtils';

// Validação e segurança
export { validateUserInput, sanitizeFileName } from '@/utils/securityValidation';
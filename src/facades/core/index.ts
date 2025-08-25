/**
 * Core Facades - Funções utilitárias e hooks centrais
 * Re-exports para facilitar importação e estabilizar API pública
 */

// Hooks de navegação e projeto
export { useProjectNavigation } from '@/hooks/useProjectNavigation';

// Utilitários centrais
export { cn } from '@/lib/utils';

// Validação e segurança
export { validateUserInput, sanitizeFileName } from '@/utils/securityValidation';
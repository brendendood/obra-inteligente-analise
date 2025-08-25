/**
 * Hooks Barrel - Re-exports dos hooks mais utilizados
 * Facilita importação com @/hooks ao invés de caminhos específicos
 */

// Hook de toast (50+ componentes conforme docs/inventory)
export { useToast } from '@/hooks/use-toast';

// Hooks de autenticação (quando disponíveis)
// export { useAuth } from '@/hooks/useAuth';
// export { useUserData } from '@/hooks/useUserData';
// export { useDefaultAvatar } from '@/hooks/useDefaultAvatar';
// export { useEmailSystem } from '@/hooks/useEmailSystem';

// Hooks de projeto (Dashboard, Projects conforme docs/inventory)
// export { useProjects } from '@/hooks/useProjects';
// export { useProjectDetail } from '@/hooks/useProjectDetail';
export { useProjectNavigation } from '@/hooks/useProjectNavigation';

// Hooks utilitários (quando disponíveis)
// export { useCRM } from '@/hooks/useCRM';
// export { useAdminAnalytics } from '@/hooks/useAdminAnalytics';
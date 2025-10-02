/**
 * Hooks Barrel - Re-exports dos hooks mais utilizados
 * Facilita importação com @/hooks ao invés de caminhos específicos
 */

// ============= UI Hooks =============
export { useToast } from '@/hooks/use-toast';

// ============= Auth Hooks =============
export { useAuth } from '@/hooks/useAuth';
export { useUserData } from '@/hooks/useUserData';

// ============= Plan & Feature Hooks =============
export { useFeatureAccess } from '@/hooks/use-feature-access';
export { useUserPlan } from '@/hooks/use-user-plan';

// ============= Project Hooks =============
export { useProjects, useProjectById, useProjectCount, useProjectsLoading } from '@/hooks/useProjects';
export { useProjectNavigation } from '@/hooks/useProjectNavigation';
export { useProjectSync } from '@/hooks/useProjectSync';
export { useProjectFilters } from '@/hooks/useProjectFilters';
export { useProjectActions } from '@/hooks/useProjectActions';

// ============= Admin Hooks =============
// export { useAdminAnalytics } from '@/hooks/useAdminAnalytics';

// Hooks utilitários (quando disponíveis)
// export { useCRM } from '@/hooks/useCRM';
// export { useAdminAnalytics } from '@/hooks/useAdminAnalytics';
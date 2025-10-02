import { useProjectSync } from '@/hooks/useProjectSync';
import { AppLayout } from '@/components/layout/AppLayout';
import { UnifiedLoading } from '@/components/ui/unified-loading';

/**
 * Hook para carregar projeto no workspace
 * Usa useProjectSync para sincronizar com URL
 */
export const useProjectLoader = () => {
  const { currentProject, isProjectLoaded } = useProjectSync();

  // Unified Loading Component
  const LoadingComponent = () => (
    <AppLayout>
      <UnifiedLoading />
    </AppLayout>
  );

  return {
    loading: !isProjectLoaded,
    error: null,
    currentProject,
    LoadingComponent
  };
};

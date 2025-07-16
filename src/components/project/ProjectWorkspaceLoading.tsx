
import { AppLayout } from '@/components/layout/AppLayout';
import { PageConstructionLoading } from '@/components/ui/construction-loading';

export const ProjectWorkspaceLoading = () => {
  return (
    <AppLayout>
      <PageConstructionLoading text="Construindo projeto..." />
    </AppLayout>
  );
};

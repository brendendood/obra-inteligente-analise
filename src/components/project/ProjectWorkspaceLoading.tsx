
import { AppLayout } from '@/components/layout/AppLayout';

export const ProjectWorkspaceLoading = () => {
  return (
    <AppLayout>
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando projeto...</p>
        </div>
      </div>
    </AppLayout>
  );
};

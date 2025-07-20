
import { ReactNode } from 'react';
import { MemberFooter } from './MemberFooter';
import { ResponsiveSidebarLayout } from './ResponsiveSidebarLayout';
import { useAuth } from '@/hooks/useAuth';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col w-full bg-gray-50">
      <ResponsiveSidebarLayout>
        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 min-h-screen">
          <div className="flex-1 overflow-auto">
            <div className="h-full p-4 sm:p-6 lg:p-8">
              {children}
            </div>
          </div>
          <MemberFooter />
        </main>
      </ResponsiveSidebarLayout>
    </div>
  );
};

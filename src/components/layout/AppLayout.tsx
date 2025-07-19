
import { ReactNode } from 'react';
import Header from './Header';
import { MemberFooter } from './MemberFooter';
import { DesktopSidebar } from './DesktopSidebar';
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <DesktopSidebar />
        
        <main className="flex-1 overflow-auto">
          <div className="h-full p-4 sm:p-6 lg:p-8">
            {children}
          </div>
          <MemberFooter />
        </main>
      </div>
    </div>
  );
};

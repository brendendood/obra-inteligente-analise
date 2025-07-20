
import { ReactNode } from 'react';
import { MemberFooter } from './MemberFooter';
import { Sidebar } from './Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { useSidebarState } from '@/hooks/useSidebarState';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { user, loading } = useAuth();
  const { isMobile, isCollapsed } = useSidebarState();

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

  // Calcular margem baseada no estado do sidebar
  const getMainMargin = () => {
    if (isMobile) return "ml-0"; // Mobile não tem margem
    return isCollapsed ? "ml-[64px]" : "ml-[280px]"; // Desktop com sidebar colapsável
  };

  return (
    <div className="min-h-screen flex flex-col w-full bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className={cn(
        "flex-1 flex flex-col min-h-screen transition-[margin] duration-300 ease-in-out",
        getMainMargin()
      )}>
        <div className="flex-1 overflow-auto">
          <div className="h-full p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </div>
        <MemberFooter />
      </main>
    </div>
  );
};

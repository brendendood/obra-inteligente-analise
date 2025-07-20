
import { ReactNode } from 'react';
import { MemberFooter } from './MemberFooter';
import { Sidebar } from './Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { user, loading } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar mobile e carregar estado do sidebar
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    const loadSidebarState = () => {
      const saved = localStorage.getItem('sidebar-collapsed');
      if (saved) {
        setIsCollapsed(JSON.parse(saved));
      }
    };

    checkIsMobile();
    loadSidebarState();
    
    window.addEventListener('resize', checkIsMobile);
    window.addEventListener('storage', loadSidebarState);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
      window.removeEventListener('storage', loadSidebarState);
    };
  }, []);

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
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className={cn(
        "flex-1 flex flex-col min-h-screen transition-all duration-300",
        !isMobile && (isCollapsed ? "ml-16" : "ml-72")
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

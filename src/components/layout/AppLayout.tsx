
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
  const [isMobile, setIsMobile] = useState(false);

  // Detectar mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
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
        "flex-1 flex flex-col min-h-screen transition-none",
        // Desktop: sempre com margem fixa de 280px (largura do sidebar)
        !isMobile && "ml-[280px]"
        // Mobile: sem margem, pois sidebar é overlay
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

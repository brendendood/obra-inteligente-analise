
import { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import Header from './Header';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { isAuthenticated, loading } = useAuth();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Controlar estado do sidebar baseado no tamanho da tela
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider 
      open={sidebarOpen} 
      onOpenChange={setSidebarOpen}
    >
      <div className="min-h-screen flex w-full bg-gray-50/30">
        {/* Sidebar Fixo */}
        <AppSidebar />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 w-full">
          {/* Header Simplificado */}
          <Header />
          
          {/* Content Area com Scroll */}
          <main className="flex-1 overflow-auto w-full min-w-0">
            <div className="container max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 w-full min-w-0">
              {children}
            </div>
          </main>
        </div>
      </div>
      
      {/* Overlay para Mobile quando Sidebar está aberto */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </SidebarProvider>
  );
};

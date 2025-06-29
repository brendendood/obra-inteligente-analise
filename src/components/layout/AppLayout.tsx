
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import Header from './Header';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const isMobile = useIsMobile();

  console.log('🏗️ APP LAYOUT: Renderizando layout');

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="min-h-screen flex w-full bg-gray-50/30">
        {/* Sidebar - Fixo no desktop, oculto no mobile */}
        {!isMobile && (
          <div className="flex-shrink-0">
            <AppSidebar />
          </div>
        )}
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 w-full">
          {/* Header */}
          <Header />
          
          {/* Content Area com Scroll */}
          <main className="flex-1 overflow-auto w-full min-w-0">
            <div className="container max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 w-full min-w-0">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

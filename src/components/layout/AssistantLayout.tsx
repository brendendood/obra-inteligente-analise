import { ReactNode, memo, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { UnifiedLoading } from '@/components/ui/unified-loading';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useProject } from '@/contexts/ProjectContext';
import { SidebarNavigation } from './sidebar/SidebarNavigation';
import { UserProfile } from './sidebar/UserProfile';

interface AssistantLayoutProps {
  children: ReactNode;
}

export const AssistantLayout = memo<AssistantLayoutProps>(({ children }) => {
  const { user, loading } = useAuth();
  const isMobile = useIsMobile();
  const location = useLocation();
  const { currentProject } = useProject();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Early return for loading state
  if (loading) {
    return <UnifiedLoading />;
  }

  // Early return for unauthenticated users
  if (!user) {
    return <>{children}</>;
  }

  // Effect para escutar evento de abertura do sidebar móvel
  useEffect(() => {
    const handleOpenMobileSidebar = () => {
      setIsMobileOpen(true);
    };

    window.addEventListener('openMobileSidebar', handleOpenMobileSidebar);
    return () => {
      window.removeEventListener('openMobileSidebar', handleOpenMobileSidebar);
    };
  }, []);

  // Sidebar Content Component
  const SidebarContent = () => (
    <div className="w-[280px] bg-sidebar border-r border-sidebar-border flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/6fd4d63a-4d95-4b1f-a41b-e2fa342c2181.png" 
            alt="MadenAI" 
            className="h-12 w-auto" 
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <SidebarNavigation />
      </div>

      {/* User Profile at bottom */}
      <UserProfile />
    </div>
  );

  // Mobile/Tablet: fullscreen com sidebar oculto mas disponível
  if (isMobile) {
    return (
      <div className="h-screen flex flex-col overflow-hidden">
        {/* Mobile Sidebar - sem header para página /ia */}
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetContent side="left" className="w-[280px] p-0 bg-sidebar border-sidebar-border">
            <SidebarContent />
          </SheetContent>
        </Sheet>
        
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    );
  }

  // Desktop: com sidebar
  return (
    <div className="min-h-screen flex w-full overflow-hidden">
      <div className="fixed left-0 top-0 h-full">
        <SidebarContent />
      </div>
      <main className="flex-1 flex flex-col ml-[280px] overflow-hidden">
        {children}
      </main>
    </div>
  );
});

AssistantLayout.displayName = 'AssistantLayout';
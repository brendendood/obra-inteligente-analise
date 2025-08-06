import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sidebar as SidebarRoot,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  useSidebar
} from '@/components/ui/sidebar';
import { SidebarNavigation } from './sidebar/SidebarNavigation';
import { UserProfile } from './sidebar/UserProfile';

interface SidebarProps {
  className?: string;
}

const SidebarContent_Internal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const isMobile = useIsMobile();

  // Listen for mobile sidebar toggle events
  useEffect(() => {
    const handleOpenMobileSidebar = () => {
      if (isMobile) {
        setIsOpen(true);
      }
    };

    window.addEventListener('openMobileSidebar', handleOpenMobileSidebar);
    return () => {
      window.removeEventListener('openMobileSidebar', handleOpenMobileSidebar);
    };
  }, [isMobile]);

  if (!user) {
    return null;
  }

  // Mobile sidebar overlay
  if (isMobile) {
    return (
      <>
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
        <div className={`
          fixed left-0 top-0 h-full w-80 bg-background border-r z-50 
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <SidebarRoot className="w-full h-full border-none">
            <SidebarHeader className="p-4">
              <h2 className="text-lg font-semibold">MadenAI</h2>
            </SidebarHeader>
            <SidebarContent>
              <SidebarNavigation />
            </SidebarContent>
            <SidebarFooter>
              <UserProfile />
            </SidebarFooter>
          </SidebarRoot>
        </div>
      </>
    );
  }

  // Desktop sidebar
  return (
    <SidebarRoot className="w-[280px]">
      <SidebarHeader className="p-4">
        <h2 className="text-lg font-semibold">MadenAI</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarNavigation />
      </SidebarContent>
      <SidebarFooter>
        <UserProfile />
      </SidebarFooter>
    </SidebarRoot>
  );
};

export const Sidebar = ({ className }: SidebarProps) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  if (!user) {
    return null;
  }

  if (isMobile) {
    return <SidebarContent_Internal />;
  }

  return (
    <SidebarProvider>
      <SidebarContent_Internal />
    </SidebarProvider>
  );
};
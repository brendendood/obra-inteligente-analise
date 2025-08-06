import { ReactNode, memo } from 'react';
import { Sidebar } from './Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { UnifiedLoading } from '@/components/ui/unified-loading';

interface AssistantLayoutProps {
  children: ReactNode;
}

export const AssistantLayout = memo<AssistantLayoutProps>(({ children }) => {
  const { user, loading } = useAuth();
  const isMobile = useIsMobile();

  // Early return for loading state
  if (loading) {
    return <UnifiedLoading />;
  }

  // Early return for unauthenticated users
  if (!user) {
    return <>{children}</>;
  }

  // Mobile/Tablet: fullscreen com sidebar oculto mas disponível
  if (isMobile) {
    return (
      <div className="h-screen flex flex-col overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    );
  }

  // Desktop: com sidebar
  return (
    <div className="min-h-screen flex w-full overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col ml-[280px] overflow-hidden">
        {children}
      </main>
    </div>
  );
});

AssistantLayout.displayName = 'AssistantLayout';
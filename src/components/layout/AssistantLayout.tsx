
import { ReactNode, memo } from 'react';
import { Sidebar } from './Sidebar';
import Header from './Header';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { UnifiedLoading } from '@/components/ui/unified-loading';
import { useLocation } from 'react-router-dom';

interface AssistantLayoutProps {
  children: ReactNode;
}

export const AssistantLayout = memo<AssistantLayoutProps>(({ children }) => {
  const { user, loading } = useAuth();
  const isMobile = useIsMobile();
  const location = useLocation();

  // Early return for loading state
  if (loading) {
    return <UnifiedLoading />;
  }

  // Early return for unauthenticated users
  if (!user) {
    return <>{children}</>;
  }

  // Verificar se estamos na rota /ia para não mostrar header no mobile
  const isAssistantRoute = location.pathname === '/ia';

  // Mobile/Tablet: fullscreen sem header na página /ia
  if (isMobile) {
    return (
      <div className="h-screen flex flex-col overflow-hidden">
        {/* Não renderizar Header na rota /ia no mobile */}
        {!isAssistantRoute && <Header />}
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

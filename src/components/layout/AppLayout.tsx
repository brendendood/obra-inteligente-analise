
import { ReactNode, memo, useMemo, useState, useEffect } from 'react';
import { MemberFooter } from './MemberFooter';
import { Sidebar } from './Sidebar';
import { SessionNavBar } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { UnifiedLoading } from '@/components/ui/unified-loading';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';
import '@/styles/sidebar-adjust.css';
import '@/styles/page-container.css';

interface AppLayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
}

// Optimized media query hook
const useOptimizedMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};

// Memoized sidebar component
const MemoizedSidebar = memo(Sidebar);
MemoizedSidebar.displayName = 'MemoizedSidebar';

// Memoized footer component  
const MemoizedFooter = memo(MemberFooter);
MemoizedFooter.displayName = 'MemoizedFooter';

export const AppLayout = memo<AppLayoutProps>(({ children, hideFooter }) => {
  const { user, loading } = useAuth();
  const { setTheme } = useTheme();
  const isMobile = useOptimizedMediaQuery('(max-width: 1023px)');
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  // Force Light Mode only in user area
  useEffect(() => {
    if (user) {
      setTheme('light');
    }
  }, [user, setTheme]);

  // Controlar o atributo data-sidebar no body para desktop
  useEffect(() => {
    if (typeof document !== "undefined" && !isMobile && user) {
      const val = sidebarCollapsed ? "collapsed" : "open";
      document.body.setAttribute("data-sidebar", val);
    }
    
    return () => {
      if (typeof document !== "undefined") {
        document.body.removeAttribute("data-sidebar");
      }
    };
  }, [sidebarCollapsed, isMobile, user]);
  
  // Verifica se é a página de IA
  const isAIPage = location.pathname === '/ia';
  const isProjectPage = location.pathname.startsWith('/projeto');
  const shouldHideFooter = hideFooter || isAIPage;
  
  // Esconde sidebar apenas na página IA no mobile
  const shouldHideSidebar = isMobile && isAIPage;

  // Memoize layout classes to prevent recalculation
  const layoutClasses = useMemo(() => ({
    container: "min-h-screen flex flex-col w-full bg-gray-50",
    main: "flex-1 flex flex-col min-h-screen transition-none pr-4",
    content: cn(
      "flex-1",
      isAIPage ? "overflow-hidden" : "overflow-auto"
    ),
    innerContent: isAIPage && !isMobile ? "h-full" : shouldHideSidebar ? "h-full" : (isProjectPage ? "h-full project-content" : "h-full")
  }), [isMobile, isAIPage, shouldHideSidebar, isProjectPage]);

  // Early return for loading state with unified loading
  if (loading) {
    return <UnifiedLoading />;
  }

  // Early return for unauthenticated users
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className={cn(
      "user-area min-h-screen w-full bg-gray-50",
      !isMobile && !shouldHideSidebar ? "desktop-grid" : "flex flex-col"
    )}>
      {/* Sidebar original para mobile */}
      {isMobile && !shouldHideSidebar && <MemoizedSidebar />}
      
      {/* Novo sidebar colapsável para desktop */}
      {!isMobile && !shouldHideSidebar && (
        <div className="hidden md:block">
          <SessionNavBar 
            onCollapseChange={setSidebarCollapsed}
            isCollapsed={sidebarCollapsed}
          />
        </div>
      )}
      
      <main className={cn(layoutClasses.main, "app-main")}>
        <div className={layoutClasses.content}>
          <div className={layoutClasses.innerContent}>
            {children}
          </div>
        </div>
        {!shouldHideFooter && <MemoizedFooter />}
      </main>
    </div>
  );
});

AppLayout.displayName = 'AppLayout';

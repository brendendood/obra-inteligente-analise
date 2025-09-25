import React, { ReactNode, memo, useMemo, useEffect } from 'react';
import { MemberFooter } from './MemberFooter';
import { AppSidebar } from './AppSidebar';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { UnifiedLoading } from '@/components/ui/unified-loading';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';
import '@/styles/page-container.css';

interface AppLayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
}

// Optimized media query hook
const useOptimizedMediaQuery = (query: string) => {
  const [matches, setMatches] = React.useState(() => window.matchMedia(query).matches);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
};

// Memoized sidebar component
const MemoizedAppSidebar = memo(AppSidebar);
MemoizedAppSidebar.displayName = 'MemoizedAppSidebar';

export const AppLayout = memo<AppLayoutProps>(({ children, hideFooter }) => {
  const location = useLocation();
  const { user, loading } = useAuth();
  const isMobile = useOptimizedMediaQuery('(max-width: 767px)');
  const { theme } = useTheme();

  // Esconde sidebar apenas na página IA no mobile
  const isAIPage = location.pathname === '/ia';
  const shouldHideSidebar = isMobile && isAIPage;

  // Memoize layout classes to prevent recalculation
  const layoutClasses = useMemo(() => ({
    main: !isMobile && !shouldHideSidebar ? "ml-[280px]" : "",
    content: !shouldHideSidebar ? "min-h-screen" : "h-screen",
    innerContent: isAIPage && !isMobile ? "h-full" : shouldHideSidebar ? "h-full" : "h-full"
  }), [isMobile, isAIPage, shouldHideSidebar]);

  useEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  if (loading) {
    return <UnifiedLoading />;
  }

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className={cn(
      "user-area min-h-screen w-full bg-background",
      !isMobile && !shouldHideSidebar ? "desktop-grid" : "flex flex-col"
    )}>
      {/* Sidebar - Desktop e Mobile */}
      {!shouldHideSidebar && <MemoizedAppSidebar />}
      
      <main className={cn(layoutClasses.main, "app-main")}>
        <div className={layoutClasses.content}>
          <div className={layoutClasses.innerContent}>
            {children}
          </div>
        </div>
        {!hideFooter && !isAIPage && <MemberFooter />}
      </main>
    </div>
  );
});

AppLayout.displayName = 'AppLayout';
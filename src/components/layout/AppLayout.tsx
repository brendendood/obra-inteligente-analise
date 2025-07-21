
import { ReactNode, memo, useMemo, useState, useEffect } from 'react';
import { MemberFooter } from './MemberFooter';
import { CustomSidebar } from './CustomSidebar';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { UnifiedLoading } from '@/components/ui/unified-loading';

interface AppLayoutProps {
  children: ReactNode;
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

export const AppLayout = memo<AppLayoutProps>(({ children }) => {
  const { user, loading } = useAuth();
  const isMobile = useOptimizedMediaQuery('(max-width: 1023px)');
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Memoize layout classes to prevent recalculation
  const layoutClasses = useMemo(() => ({
    container: "min-h-screen flex flex-col w-full bg-gray-50",
    main: cn(
      "flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out",
      !isMobile && (isCollapsed ? "ml-16" : "ml-64")
    ),
    content: "flex-1 overflow-auto",
    innerContent: "h-full p-4 sm:p-6 lg:p-8"
  }), [isMobile, isCollapsed]);

  // Early return for loading state with unified loading
  if (loading) {
    return <UnifiedLoading />;
  }

  // Early return for unauthenticated users
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className={layoutClasses.container}>
      <CustomSidebar 
        isCollapsed={isCollapsed} 
        onToggle={() => setIsCollapsed(!isCollapsed)} 
      />
      <main className={layoutClasses.main}>
        <div className={layoutClasses.content}>
          <div className={layoutClasses.innerContent}>
            {children}
          </div>
        </div>
        <MemberFooter />
      </main>
    </div>
  );
});

AppLayout.displayName = 'AppLayout';

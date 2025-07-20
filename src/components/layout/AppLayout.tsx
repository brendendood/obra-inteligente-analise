
import { ReactNode, memo, useMemo, useState, useEffect } from 'react';
import { MemberFooter } from './MemberFooter';
import { Sidebar } from './Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

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

// Memoized loading component
const LoadingState = memo(() => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Carregando...</p>
    </div>
  </div>
));

LoadingState.displayName = 'LoadingState';

// Memoized sidebar component
const MemoizedSidebar = memo(Sidebar);
MemoizedSidebar.displayName = 'MemoizedSidebar';

// Memoized footer component  
const MemoizedFooter = memo(MemberFooter);
MemoizedFooter.displayName = 'MemoizedFooter';

export const AppLayout = memo<AppLayoutProps>(({ children }) => {
  const { user, loading } = useAuth();
  const isMobile = useOptimizedMediaQuery('(max-width: 1023px)');

  // Memoize layout classes to prevent recalculation
  const layoutClasses = useMemo(() => ({
    container: "min-h-screen flex flex-col w-full bg-gray-50",
    main: cn(
      "flex-1 flex flex-col min-h-screen transition-none",
      !isMobile && "ml-[280px]"
    ),
    content: "flex-1 overflow-auto",
    innerContent: "h-full p-4 sm:p-6 lg:p-8"
  }), [isMobile]);

  // Early return for loading state
  if (loading) {
    return <LoadingState />;
  }

  // Early return for unauthenticated users
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className={layoutClasses.container}>
      <MemoizedSidebar />
      <main className={layoutClasses.main}>
        <div className={layoutClasses.content}>
          <div className={layoutClasses.innerContent}>
            {children}
          </div>
        </div>
        <MemoizedFooter />
      </main>
    </div>
  );
});

AppLayout.displayName = 'AppLayout';

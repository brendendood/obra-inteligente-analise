
import { ReactNode, memo, useMemo, useState, useEffect } from 'react';
import { MemberFooter } from './MemberFooter';
import { Sidebar } from './Sidebar';
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

// Hook para detectar estado collapsed do sidebar
const useSidebarCollapsed = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const savedCollapsed = localStorage.getItem('sidebar-collapsed');
    if (savedCollapsed !== null) {
      setIsCollapsed(JSON.parse(savedCollapsed));
    }

    // Escutar mudanças no localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sidebar-collapsed' && e.newValue !== null) {
        setIsCollapsed(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Escutar mudanças diretas no localStorage (mesmo tab)
    const checkCollapsed = () => {
      const current = localStorage.getItem('sidebar-collapsed');
      if (current !== null) {
        const newValue = JSON.parse(current);
        setIsCollapsed(prev => prev !== newValue ? newValue : prev);
      }
    };

    const interval = setInterval(checkCollapsed, 100);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return isCollapsed;
};

// Memoized sidebar component
const MemoizedSidebar = memo(Sidebar);
MemoizedSidebar.displayName = 'MemoizedSidebar';

// Memoized footer component  
const MemoizedFooter = memo(MemberFooter);
MemoizedFooter.displayName = 'MemoizedFooter';

export const AppLayout = memo<AppLayoutProps>(({ children }) => {
  const { user, loading } = useAuth();
  const isMobile = useOptimizedMediaQuery('(max-width: 1023px)');
  const isCollapsed = useSidebarCollapsed();

  // Memoize layout classes to prevent recalculation
  const layoutClasses = useMemo(() => ({
    container: "min-h-screen flex flex-col w-full bg-gray-50",
    main: cn(
      "flex-1 flex flex-col min-h-screen transition-all duration-300",
      !isMobile && (isCollapsed ? "ml-16" : "ml-[280px]")
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

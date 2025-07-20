
import { useState, useEffect, useCallback, useMemo } from 'react';

export const useSidebarState = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar-collapsed');
      return saved === 'true';
    }
    return false;
  });

  // Detectar mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  // Fechar mobile sidebar quando redimensionar para desktop
  useEffect(() => {
    if (!isMobile) {
      setIsMobileOpen(false);
    }
  }, [isMobile]);

  // Salvar estado do collapse no localStorage
  useEffect(() => {
    if (!isMobile) {
      localStorage.setItem('sidebar-collapsed', isCollapsed.toString());
      // Adicionar classe global para estilizações CSS
      document.body.setAttribute('data-sidebar-collapsed', isCollapsed.toString());
    }
  }, [isCollapsed, isMobile]);

  const toggleCollapse = useCallback(() => {
    if (!isMobile) {
      setIsCollapsed(prev => !prev);
    }
  }, [isMobile]);

  const toggleMobile = useCallback(() => {
    setIsMobileOpen(prev => !prev);
  }, []);

  const closeMobile = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  const sidebarWidth = useMemo(() => {
    if (isMobile) return 280;
    return isCollapsed ? 64 : 280;
  }, [isMobile, isCollapsed]);

  return {
    isMobile,
    isMobileOpen,
    isCollapsed: !isMobile && isCollapsed,
    sidebarWidth,
    toggleCollapse,
    toggleMobile,
    closeMobile,
    setIsMobileOpen
  };
};

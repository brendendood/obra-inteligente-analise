
import { useState, useEffect, ReactNode } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModernSidebar } from './ModernSidebar';
import { cn } from '@/lib/utils';

interface ResponsiveSidebarLayoutProps {
  children: ReactNode;
}

export const ResponsiveSidebarLayout = ({ children }: ResponsiveSidebarLayoutProps) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);

  // Detectar se é mobile de forma responsiva
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Carregar estado do sidebar desktop do localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('desktop-sidebar-collapsed');
    if (savedState) {
      setIsDesktopSidebarCollapsed(JSON.parse(savedState));
    }
  }, []);

  // Salvar estado do sidebar desktop no localStorage
  const toggleDesktopSidebar = () => {
    const newState = !isDesktopSidebarCollapsed;
    setIsDesktopSidebarCollapsed(newState);
    localStorage.setItem('desktop-sidebar-collapsed', JSON.stringify(newState));
  };

  // Fechar sidebar mobile quando a tela for redimensionada para desktop
  useEffect(() => {
    if (!isMobile) {
      setIsMobileSidebarOpen(false);
    }
  }, [isMobile]);

  return (
    <div className="flex flex-1 w-full overflow-x-hidden">
      {/* Mobile Header - Apenas no mobile */}
      {isMobile && (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
          <div className="flex items-center justify-between p-4">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                MadenAI
              </span>
            </div>
            
            {/* Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 w-10 h-10 flex-shrink-0"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </header>
      )}

      {/* Desktop Sidebar - Sempre visível e fixo no desktop */}
      {!isMobile && (
        <div className={cn(
          "fixed left-0 top-0 h-screen z-30 transition-all duration-300 ease-in-out overflow-x-hidden",
          isDesktopSidebarCollapsed ? "w-16" : "w-72"
        )}>
          <ModernSidebar 
            isCollapsed={isDesktopSidebarCollapsed}
            onToggleCollapse={toggleDesktopSidebar}
          />
        </div>
      )}

      {/* Mobile Overlay */}
      {isMobile && isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" 
          onClick={() => setIsMobileSidebarOpen(false)} 
        />
      )}

      {/* Mobile Sidebar Overlay */}
      {isMobile && (
        <div className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transition-transform duration-300 overflow-x-hidden",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          {/* Header do Mobile Sidebar */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 aspect-square">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                MadenAI
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileSidebarOpen(false)}
              className="p-2 w-10 h-10 flex-shrink-0 aspect-square"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Sidebar Content para Mobile */}
          <ModernSidebar 
            isMobile={true}
            onNavigate={() => setIsMobileSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main Content Area - Ajustar margem baseado no estado do sidebar */}
      <div className={cn(
        "flex-1 transition-all duration-300 ease-in-out min-w-0 overflow-x-hidden",
        !isMobile && (isDesktopSidebarCollapsed ? "ml-16" : "ml-72")
      )}>
        {children}
      </div>
    </div>
  );
};

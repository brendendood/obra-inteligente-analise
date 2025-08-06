
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  FolderOpen, 
  Upload, 
  Bot, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Menu,
  X,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { UserProfileCard } from './sidebar/UserProfileCard';
import { PlanCard } from './sidebar/PlanCard';
import { supabase } from '@/integrations/supabase/client';

interface SidebarProps {
  className?: string;
}

export const Sidebar = ({ className }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  // Escutar evento customizado do chat para abrir sidebar móvel
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

  const navigationItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: FolderOpen, label: 'Projetos', path: '/projetos' },
    { icon: Upload, label: 'Upload', path: '/upload' },
    { icon: Bot, label: 'Assistente IA', path: '/ia' },
  ];

  const bottomItems = [
    { icon: Settings, label: 'Configurações', path: '/conta' },
    { icon: HelpCircle, label: 'Ajuda', path: '/ajuda' },
  ];

  const isActivePath = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleUpgrade = () => {
    navigate('/plano');
    if (isMobile) {
      setIsOpen(false);
    }
  };

  if (!user) return null;

  // Mobile overlay
  if (isMobile && isOpen) {
    return (
      <>
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
        
        {/* Sidebar Mobile */}
        <div className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">MadenAI</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="p-2"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all duration-200",
                    isActivePath(item.path)
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </div>

            <div className="border-t my-6" />

            <div className="space-y-2">
              {bottomItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all duration-200",
                    isActivePath(item.path)
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t space-y-4">
            <UserProfileCard isCollapsed={false} />
            <PlanCard isCollapsed={false} onUpgrade={handleUpgrade} />
            <Button
              onClick={handleSignOut}
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sair
            </Button>
          </div>
        </div>
      </>
    );
  }

  // Desktop sidebar
  return (
    <div className={cn(
      "fixed left-0 top-0 bottom-0 w-[280px] bg-white border-r border-gray-100 flex flex-col z-30",
      className
    )}>
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">MadenAI</h1>
            <p className="text-sm text-gray-500">Gestão Inteligente</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group",
                isActivePath(item.path)
                  ? "bg-blue-50 text-blue-600 font-medium shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 flex-shrink-0 transition-colors",
                isActivePath(item.path) ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
              )} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="border-t border-gray-100 my-6" />

        <nav className="space-y-2">
          {bottomItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group",
                isActivePath(item.path)
                  ? "bg-blue-50 text-blue-600 font-medium shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 flex-shrink-0 transition-colors",
                isActivePath(item.path) ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
              )} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 space-y-4">
        <UserProfileCard isCollapsed={false} />
        <PlanCard isCollapsed={false} onUpgrade={handleUpgrade} />
        <Button
          onClick={handleSignOut}
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50/80 transition-colors"
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sair da Conta
        </Button>
      </div>
    </div>
  );
};

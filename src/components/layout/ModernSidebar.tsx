
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Settings, 
  CreditCard,
  FolderOpen,
  Plus,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  User
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useDefaultAvatar } from '@/hooks/useDefaultAvatar';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

export const ModernSidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getDefaultAvatarUrl, getAvatarFallback } = useDefaultAvatar();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const userGender = user?.user_metadata?.gender;
  const avatarUrl = user?.user_metadata?.avatar_url || getDefaultAvatarUrl(userGender);

  const mainNavItems = [
    { 
      icon: Home, 
      label: 'Dashboard', 
      path: '/painel',
      isActive: location.pathname === '/painel' || location.pathname === '/'
    },
    { 
      icon: FolderOpen, 
      label: 'Meus Projetos', 
      path: '/projetos',
      isActive: location.pathname.startsWith('/projetos')
    },
    { 
      icon: Plus, 
      label: 'Nova Obra', 
      path: '/upload',
      isActive: location.pathname.startsWith('/upload')
    }
  ];

  const settingsItems = [
    { 
      icon: Settings, 
      label: 'Configurações', 
      path: '/configuracoes',
      isActive: location.pathname.startsWith('/configuracoes')
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      navigate('/');
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Logo */}
      <div className={cn("flex items-center justify-center p-6", !isCollapsed && "justify-start")}>
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <div className="w-5 h-5 bg-white rounded-sm"></div>
        </div>
        {!isCollapsed && (
          <span className="ml-3 text-xl font-bold text-gray-900 dark:text-white">
            MadenAI
          </span>
        )}
      </div>

      {/* Main Navigation */}
      <div className="flex-1 px-3 pt-6">
        <nav className="space-y-2">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={cn(
                  "w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group",
                  item.isActive
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                  isCollapsed && "justify-center px-3"
                )}
              >
                <Icon className={cn("h-5 w-5 flex-shrink-0", !isCollapsed && "mr-3")} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Separator */}
        <div className="my-6 border-t border-gray-200 dark:border-gray-700"></div>

        {/* Settings Navigation */}
        <nav className="space-y-2">
          {settingsItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={cn(
                  "w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group",
                  item.isActive
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                  isCollapsed && "justify-center px-3"
                )}
              >
                <Icon className={cn("h-5 w-5 flex-shrink-0", !isCollapsed && "mr-3")} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-3 space-y-2 border-t border-gray-200 dark:border-gray-700">
        {/* User Account */}
        <button
          onClick={() => handleNavigation('/conta')}
          className={cn(
            "w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group",
            location.pathname.startsWith('/conta')
              ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
            isCollapsed && "justify-center px-3"
          )}
        >
          <Avatar className="h-5 w-5 flex-shrink-0">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="bg-blue-600 text-white text-xs">
              {getAvatarFallback(userGender)}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && <span className="ml-3 truncate">Conta</span>}
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group",
            "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20",
            isCollapsed && "justify-center px-3"
          )}
        >
          <LogOut className={cn("h-5 w-5 flex-shrink-0", !isCollapsed && "mr-3")} />
          {!isCollapsed && <span className="truncate">Sair</span>}
        </button>

        {/* Collapse Toggle */}
        <div className="hidden lg:block pt-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
              "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800",
              isCollapsed && "justify-center px-3"
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5 mr-3" />
                <span className="truncate">Recolher</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="bg-white dark:bg-gray-800 shadow-lg"
        >
          {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={cn(
        "bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 shadow-sm",
        // Desktop
        "hidden lg:flex",
        isCollapsed ? "w-20" : "w-72",
        // Mobile
        "lg:relative lg:translate-x-0",
        isMobileOpen && "fixed inset-y-0 left-0 z-50 flex w-72"
      )}>
        <SidebarContent />
      </div>
    </>
  );
};

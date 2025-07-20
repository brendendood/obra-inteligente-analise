import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Bot,
  Home, 
  User,
  CreditCard,
  HelpCircle,
  MessageCircle,
  LogOut,
  Menu,
  X,
  Crown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useDefaultAvatar } from '@/hooks/useDefaultAvatar';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ModernSidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const ModernSidebar = ({ isMobileOpen = false, onMobileClose }: ModernSidebarProps = {}) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getDefaultAvatarUrl, getAvatarFallback } = useDefaultAvatar();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const userGender = user?.user_metadata?.gender;
  const avatarUrl = user?.user_metadata?.avatar_url || getDefaultAvatarUrl(userGender);

  const navigationItems = [
    { 
      icon: Bot, 
      label: 'Assistente IA', 
      path: '/ia',
      isActive: location.pathname === '/ia'
    },
    { 
      icon: Home, 
      label: 'Dashboard', 
      path: '/painel',
      isActive: location.pathname === '/painel' || location.pathname === '/'
    },
    { 
      icon: User, 
      label: 'Conta & Preferências', 
      path: '/conta',
      isActive: location.pathname.startsWith('/conta')
    },
    { 
      icon: CreditCard, 
      label: 'Plano e Pagamentos', 
      path: '/plano',
      isActive: location.pathname.startsWith('/plano')
    },
    { 
      icon: HelpCircle, 
      label: 'Ajuda e FAQs', 
      path: '/ajuda',
      isActive: location.pathname.startsWith('/ajuda')
    },
    { 
      icon: MessageCircle, 
      label: 'Fale com a Gente', 
      path: '/contato',
      isActive: location.pathname.startsWith('/contato'),
      isCTA: true
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    onMobileClose?.();
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

  const NavItem = ({ item }: { item: any }) => {
    const Icon = item.icon;
    return (
      <div className="relative group">
        <button
          onClick={() => handleNavigation(item.path)}
          className={cn(
            "w-full flex items-center rounded-xl transition-all duration-200 relative",
            "hover:bg-slate-50 dark:hover:bg-slate-800/50",
            isCollapsed ? "p-3 justify-center" : "p-3",
            item.isActive && "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400"
          )}
        >
          <Icon className={cn(
            "h-5 w-5 flex-shrink-0 transition-colors",
            !isCollapsed && "mr-3",
            item.isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-600 dark:text-slate-400"
          )} />
          
          {!isCollapsed && (
            <span className={cn(
              "text-sm font-medium truncate transition-colors",
              item.isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-700 dark:text-slate-300"
            )}>
              {item.label}
            </span>
          )}

          {/* Active indicator */}
          {item.isActive && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 dark:bg-blue-400 rounded-r-full" />
          )}
        </button>

        {/* Tooltip for collapsed state */}
        {isCollapsed && (
          <div className="absolute left-full ml-3 px-3 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap pointer-events-none shadow-lg">
            {item.label}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-900 dark:bg-slate-100 rotate-45" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn(
      "bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 h-full",
      // Desktop
      "hidden lg:flex lg:h-screen",
      isCollapsed ? "w-16" : "w-72",
      // Mobile - usado quando passado como prop do header
      "lg:relative lg:translate-x-0"
    )}>
        
        {/* Header */}
        <div className={cn(
          "flex items-center p-4 border-b border-slate-200 dark:border-slate-800",
          isCollapsed && "justify-center px-2"
        )}>
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
          {!isCollapsed && (
            <span className="ml-3 text-lg font-bold text-slate-900 dark:text-white">
              MadenAI
            </span>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-200 dark:border-slate-800 p-3 space-y-3">
          
          {/* Profile & Upgrade */}
          <div className={cn(
            "bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 transition-all",
            isCollapsed && "p-2"
          )}>
            {!isCollapsed ? (
              <>
                <div className="flex items-center mb-3">
                  <Avatar className="h-8 w-8 mr-3 ring-2 ring-white dark:ring-slate-800">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback className="bg-blue-500 text-white text-sm">
                      {getAvatarFallback(userGender)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      Plano Basic
                    </p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-sm"
                  onClick={() => handleNavigation('/plano')}
                >
                  <Crown className="h-3 w-3 mr-2" />
                  Upgrade para Pro
                </Button>
              </>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <Avatar className="h-8 w-8 ring-2 ring-white dark:ring-slate-800">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="bg-blue-500 text-white text-sm">
                    {getAvatarFallback(userGender)}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  size="sm" 
                  className="w-8 h-8 p-0 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-sm"
                  onClick={() => handleNavigation('/plano')}
                >
                  <Crown className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>

          {/* Logout */}
          <div className="relative group">
            <button
              onClick={handleLogout}
              className={cn(
                "w-full flex items-center rounded-xl transition-all duration-200",
                "hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400",
                isCollapsed ? "p-3 justify-center" : "p-3"
              )}
            >
              <LogOut className={cn("h-5 w-5 flex-shrink-0", !isCollapsed && "mr-3")} />
              {!isCollapsed && <span className="text-sm font-medium truncate">Sair</span>}
            </button>
            
            {isCollapsed && (
              <div className="absolute left-full ml-3 px-3 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap pointer-events-none shadow-lg">
                Sair
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-900 dark:bg-slate-100 rotate-45" />
              </div>
            )}
          </div>

          {/* Collapse Toggle - Desktop Only */}
          <div className="hidden lg:block">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={cn(
                "w-full flex items-center rounded-xl transition-all duration-200",
                "hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-500 dark:text-slate-400",
                isCollapsed ? "p-3 justify-center" : "p-3"
              )}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <>
                  <ChevronLeft className="h-4 w-4 mr-3" />
                  <span className="text-sm font-medium truncate">Recolher</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
  );
};

import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Bot,
  Home, 
  User,
  CreditCard,
  HelpCircle,
  MessageCircle,
  LogOut,
  Crown,
  Menu,
  X,
  PanelLeft
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useDefaultAvatar } from '@/hooks/useDefaultAvatar';
import { useToast } from '@/hooks/use-toast';
import { ProjectLimitBar } from './ProjectLimitBar';
import { cn } from '@/lib/utils';
import { useSidebarState } from '@/hooks/useSidebarState';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SidebarProps {
  className?: string;
}

export const Sidebar = ({ className }: SidebarProps) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getDefaultAvatarUrl, getAvatarFallback } = useDefaultAvatar();
  
  const {
    isMobile,
    isMobileOpen,
    isCollapsed,
    toggleCollapse,
    toggleMobile,
    closeMobile
  } = useSidebarState();

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
      isActive: location.pathname.startsWith('/contato')
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      closeMobile();
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      navigate('/');
      if (isMobile) {
        closeMobile();
      }
    } catch (error) {
      console.error('Erro no logout:', error);
      toast({
        title: "Erro no logout",
        description: "Ocorreu um erro ao tentar fazer logout.",
        variant: "destructive",
      });
    }
  };

  // Mobile Header
  const MobileHeader = () => (
    <header className="lg:hidden bg-white border-b border-slate-200/60 sticky top-0 z-50 backdrop-blur-sm">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-sm">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            MadenAI
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMobile}
          className="p-2 hover:bg-slate-100"
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5 text-slate-600" />
        </Button>
      </div>
    </header>
  );

  // Navigation Item Component
  const NavigationItem = ({ item }: { item: typeof navigationItems[0] }) => {
    const Icon = item.icon;
    
    const buttonContent = (
      <button
        onClick={() => handleNavigation(item.path)}
        className={cn(
          "w-full flex items-center rounded-xl transition-all duration-200 p-3 text-left relative group",
          "hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-opacity-50",
          item.isActive 
            ? "bg-blue-50/80 text-blue-700 shadow-sm" 
            : "text-slate-700 hover:text-slate-900",
          isCollapsed && "justify-center p-2"
        )}
        aria-current={item.isActive ? "page" : undefined}
        aria-label={isCollapsed ? item.label : undefined}
      >
        <Icon className={cn(
          "h-5 w-5 flex-shrink-0",
          item.isActive ? "text-blue-600" : "text-slate-500",
          !isCollapsed && "mr-3"
        )} />
        
        {!isCollapsed && (
          <span className="text-sm font-medium truncate">
            {item.label}
          </span>
        )}

        {item.isActive && !isCollapsed && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />
        )}
        
        {item.isActive && isCollapsed && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-l-full" />
        )}
      </button>
    );

    if (isCollapsed) {
      return (
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              {buttonContent}
            </TooltipTrigger>
            <TooltipContent side="right" className="ml-2">
              {item.label}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return buttonContent;
  };

  // Sidebar Content
  const SidebarContent = () => (
    <div className={cn(
      "bg-white border-r border-slate-200/60 flex flex-col h-full shadow-sm transition-all duration-300 ease-in-out",
      isCollapsed ? "w-[64px]" : "w-[280px]"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-200/60">
        <div className={cn(
          "flex items-center transition-all duration-300",
          isCollapsed && "justify-center w-full"
        )}>
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
          {!isCollapsed && (
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent ml-3">
              MadenAI
            </span>
          )}
        </div>
        
        {/* Desktop Collapse Button */}
        {!isMobile && (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleCollapse}
                  className={cn(
                    "p-2 hover:bg-slate-100 transition-transform duration-300",
                    isCollapsed ? "rotate-180" : "rotate-0"
                  )}
                  aria-expanded={!isCollapsed}
                  aria-label={isCollapsed ? "Expandir menu" : "Recolher menu"}
                >
                  <PanelLeft className="h-4 w-4 text-slate-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side={isCollapsed ? "right" : "bottom"} className={isCollapsed ? "ml-2" : ""}>
                {isCollapsed ? "Expandir menu" : "Recolher menu"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {/* Close Button - mobile only */}
        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={closeMobile}
            className="p-2 hover:bg-slate-100"
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5 text-slate-500" />
          </Button>
        )}
      </div>

      {/* Project Limit Bar - hide when collapsed */}
      {!isCollapsed && (
        <div className="p-6 border-b border-slate-200/60">
          <ProjectLimitBar currentProjects={3} plan="basic" />
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigationItems.map((item) => (
          <NavigationItem key={item.path} item={item} />
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200/60 p-4 space-y-4">
        {/* User Profile & Upgrade */}
        {!isCollapsed ? (
          <div className="bg-slate-50/80 rounded-xl p-4">
            <div className="flex items-center mb-3">
              <Avatar className="h-10 w-10 mr-3 ring-2 ring-white shadow-sm">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="bg-blue-500 text-white text-sm font-medium">
                  {getAvatarFallback(userGender)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário'}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  Plano Basic
                </p>
              </div>
            </div>
            <Button 
              size="sm" 
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-sm"
              onClick={() => handleNavigation('/plano')}
            >
              <Crown className="h-3 w-3 mr-2" />
              Upgrade para Pro
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar className="h-8 w-8 ring-2 ring-white shadow-sm cursor-pointer">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback className="bg-blue-500 text-white text-xs font-medium">
                      {getAvatarFallback(userGender)}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent side="right" className="ml-2">
                  {user?.user_metadata?.full_name || 'Usuário'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="sm" 
                    className="w-8 h-8 p-0 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-sm"
                    onClick={() => handleNavigation('/plano')}
                    aria-label="Upgrade para Pro"
                  >
                    <Crown className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="ml-2">
                  Upgrade para Pro
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        {/* Logout */}
        {!isCollapsed ? (
          <button
            onClick={handleLogout}
            className="w-full flex items-center rounded-xl transition-all duration-200 p-3 hover:bg-red-50 text-red-600 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-opacity-50"
            aria-label="Sair da conta"
          >
            <LogOut className="h-5 w-5 mr-3" />
            <span className="text-sm font-medium">Sair</span>
          </button>
        ) : (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center rounded-xl transition-all duration-200 p-2 hover:bg-red-50 text-red-600 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-opacity-50"
                  aria-label="Sair da conta"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="ml-2">
                Sair
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header */}
      <MobileHeader />

      {/* Desktop Sidebar - Always visible and fixed */}
      {!isMobile && (
        <div 
          className={cn(
            "fixed left-0 top-0 h-screen z-40 transition-all duration-300 ease-in-out",
            isCollapsed ? "w-[64px]" : "w-[280px]"
          )}
        >
          <SidebarContent />
        </div>
      )}

      {/* Mobile Overlay */}
      {isMobile && isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" 
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar */}
      {isMobile && (
        <div 
          className={cn(
            "fixed inset-y-0 left-0 z-50 shadow-2xl transition-transform duration-300 ease-out",
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
          aria-hidden={!isMobileOpen}
        >
          <SidebarContent />
        </div>
      )}
    </>
  );
};

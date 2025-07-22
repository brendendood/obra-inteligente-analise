
import { useState, useEffect } from 'react';
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
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useDefaultAvatar } from '@/hooks/useDefaultAvatar';
import { useToast } from '@/hooks/use-toast';
import { ProjectLimitBar } from './ProjectLimitBar';
import { useUserData } from '@/hooks/useUserData';
import { cn } from '@/lib/utils';
import { getPlanDisplayName, getUpgradeMessage, canUpgrade } from '@/utils/planUtils';

interface SidebarProps {
  className?: string;
}

export const Sidebar = ({ className }: SidebarProps) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getDefaultAvatarUrl, getAvatarFallback } = useDefaultAvatar();
  const { userData } = useUserData();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Detectar mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Carregar estado collapsed do localStorage
  useEffect(() => {
    if (!isMobile) {
      const savedCollapsed = localStorage.getItem('sidebar-collapsed');
      if (savedCollapsed !== null) {
        setIsCollapsed(JSON.parse(savedCollapsed));
      }
    }
  }, [isMobile]);

  // Fechar mobile sidebar quando redimensionar para desktop
  useEffect(() => {
    if (!isMobile) {
      setIsMobileOpen(false);
    }
  }, [isMobile]);

  const toggleCollapsed = () => {
    if (!isMobile) {
      const newCollapsed = !isCollapsed;
      setIsCollapsed(newCollapsed);
      localStorage.setItem('sidebar-collapsed', JSON.stringify(newCollapsed));
    }
  };

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
      setIsMobileOpen(false);
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
        setIsMobileOpen(false);
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
          onClick={() => setIsMobileOpen(true)}
          className="p-2 hover:bg-slate-100"
        >
          <Menu className="h-5 w-5 text-slate-600" />
        </Button>
      </div>
    </header>
  );

  // Sidebar Content
  const SidebarContent = () => (
    <div className={cn(
      "bg-white border-r border-slate-200/60 flex flex-col h-full shadow-sm transition-all duration-300",
      !isMobile && isCollapsed ? "w-16" : "w-[280px]"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-200/60 h-[88px]">
        <div className={cn(
          "flex items-center transition-opacity duration-200",
          !isMobile && isCollapsed && "opacity-0"
        )}>
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-sm">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
          {(!isMobile && !isCollapsed) && (
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              MadenAI
            </span>
          )}
        </div>
        
        {/* Desktop Toggle Button */}
        {!isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCollapsed}
            className="p-2 hover:bg-slate-100"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-slate-500" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-slate-500" />
            )}
          </Button>
        )}

        {/* Close Button - mobile only */}
        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileOpen(false)}
            className="p-2 hover:bg-slate-100"
          >
            <X className="h-5 w-5 text-slate-500" />
          </Button>
        )}
      </div>

      {/* Project Limit Bar */}
      {(!isMobile && !isCollapsed) && (
        <div className="p-6 border-b border-slate-200/60">
          <ProjectLimitBar 
            currentProjects={userData.projectCount} 
            plan={userData.plan} 
          />
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "w-full flex items-center rounded-xl transition-all duration-200 p-3 text-left relative group",
                "hover:bg-slate-50",
                item.isActive 
                  ? "bg-blue-50/80 text-blue-700 shadow-sm" 
                  : "text-slate-700 hover:text-slate-900",
                !isMobile && isCollapsed && "justify-center px-2"
              )}
              title={(!isMobile && isCollapsed) ? item.label : undefined}
            >
              {/* Indicador ativo - ponto redondo */}
              {item.isActive && (
                <div className={cn(
                  "absolute w-2 h-2 bg-blue-600 rounded-full",
                  !isMobile && isCollapsed ? "-left-1 top-1/2 -translate-y-1/2" : "left-1 top-1/2 -translate-y-1/2"
                )} />
              )}

              <Icon className={cn(
                "h-5 w-5 flex-shrink-0",
                (!isMobile && !isCollapsed) && "mr-3",
                item.isActive ? "text-blue-600" : "text-slate-500"
              )} />
              
              {(!isMobile && !isCollapsed) && (
                <span className="text-sm font-medium truncate">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      {(!isMobile && !isCollapsed) && (
        <div className="border-t border-slate-200/60 p-4 space-y-4">
          {/* User Profile & Upgrade */}
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
                  Plano {getPlanDisplayName(userData.plan)}
                </p>
              </div>
            </div>
            {canUpgrade(userData.plan) && (
              <Button 
                size="sm" 
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-sm"
                onClick={() => handleNavigation('/plano')}
              >
                <Crown className="h-3 w-3 mr-2" />
                {getUpgradeMessage(userData.plan)}
              </Button>
            )}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center rounded-xl transition-all duration-200 p-3 hover:bg-red-50 text-red-600"
          >
            <LogOut className="h-5 w-5 mr-3" />
            <span className="text-sm font-medium">Sair</span>
          </button>
        </div>
      )}

      {/* Collapsed Footer - Avatar only */}
      {(!isMobile && isCollapsed) && (
        <div className="border-t border-slate-200/60 p-4 flex justify-center">
          <Avatar className="h-8 w-8 ring-2 ring-white shadow-sm">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="bg-blue-500 text-white text-xs font-medium">
              {getAvatarFallback(userGender)}
            </AvatarFallback>
          </Avatar>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Header */}
      <MobileHeader />

      {/* Desktop Sidebar - Always visible and fixed */}
      {!isMobile && (
        <div className={cn(
          "fixed left-0 top-0 h-screen z-40 transition-all duration-300",
          isCollapsed ? "w-16" : "w-[280px]"
        )}>
          <SidebarContent />
        </div>
      )}

      {/* Mobile Overlay */}
      {isMobile && isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" 
          onClick={() => setIsMobileOpen(false)} 
        />
      )}

      {/* Mobile Sidebar */}
      {isMobile && (
        <div className={cn(
          "fixed inset-y-0 left-0 z-50 shadow-2xl transition-transform duration-300 ease-out",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <SidebarContent />
        </div>
      )}
    </>
  );
};

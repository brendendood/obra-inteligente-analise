
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
  ChevronRight,
  Zap
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
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center p-2.5 mr-3 shadow-lg">
            <Zap className="w-6 h-6 text-white" />
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
      !isMobile && isCollapsed ? "w-20" : "w-[280px]"
    )}>
      {/* Header - Logo sempre visível */}
      <div className="flex items-center justify-center p-6 border-b border-slate-200/60 h-[88px]">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center p-2.5 shadow-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          {(!isMobile && !isCollapsed) && (
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent ml-3">
              MadenAI
            </span>
          )}
        </div>

        {/* Close Button - mobile only */}
        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileOpen(false)}
            className="absolute right-4 p-2 hover:bg-slate-100"
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
                "h-6 w-6 flex-shrink-0",
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

      {/* Footer - Versão expandida */}
      {(!isMobile && !isCollapsed) && (
        <div className="border-t border-slate-200/60 p-4 space-y-4">
          {/* Botão de Toggle */}
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCollapsed}
              className="p-3 hover:bg-slate-100 bg-slate-50 border border-slate-200"
              title="Recolher menu"
            >
              <ChevronLeft className="h-7 w-7 text-slate-700" />
            </Button>
          </div>

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

      {/* Footer Colapsado - Avatar + Logout + Toggle */}
      {(!isMobile && isCollapsed) && (
        <div className="border-t border-slate-200/60 p-4 space-y-3 flex flex-col items-center">
          {/* Avatar */}
          <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm" title={user?.user_metadata?.full_name || 'Usuário'}>
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="bg-blue-500 text-white text-sm font-medium">
              {getAvatarFallback(userGender)}
            </AvatarFallback>
          </Avatar>

          {/* Botão Sair */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="p-2 hover:bg-red-50 text-red-600"
            title="Sair"
          >
            <LogOut className="h-6 w-6" />
          </Button>

          {/* Botão de Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCollapsed}
            className="p-3 hover:bg-slate-100 bg-slate-50 border border-slate-200"
            title="Expandir menu"
          >
            <ChevronRight className="h-7 w-7 text-slate-700" />
          </Button>
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
          isCollapsed ? "w-20" : "w-[280px]"
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

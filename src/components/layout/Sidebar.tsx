
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
import { cn } from '@/lib/utils';

interface SidebarProps {
  className?: string;
}

export const Sidebar = ({ className }: SidebarProps) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getDefaultAvatarUrl, getAvatarFallback } = useDefaultAvatar();

  // Estados para desktop e mobile
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Carregar estado do collapse do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved) {
      setIsCollapsed(JSON.parse(saved));
    }
  }, []);

  // Fechar mobile sidebar quando redimensionar para desktop
  useEffect(() => {
    if (!isMobile) {
      setIsMobileOpen(false);
    }
  }, [isMobile]);

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

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', JSON.stringify(newState));
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
    <header className="lg:hidden bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
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
          className="p-2"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );

  // Sidebar Content
  const SidebarContent = () => (
    <div className={cn(
      "bg-white border-r border-slate-200 flex flex-col h-full transition-all duration-300",
      isMobile ? "w-72" : (isCollapsed ? "w-16" : "w-72")
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 min-h-[73px]">
        {(!isCollapsed || isMobile) && (
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              MadenAI
            </span>
          </div>
        )}
        
        {/* Toggle Button - desktop only */}
        {!isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCollapse}
            className="p-2"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        )}

        {/* Close Button - mobile only */}
        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileOpen(false)}
            className="p-2"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Project Limit Bar */}
      {(!isCollapsed || isMobile) && (
        <div className="p-4 border-b border-slate-200">
          <ProjectLimitBar currentProjects={3} plan="basic" />
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.path} className="relative group">
              <button
                onClick={() => handleNavigation(item.path)}
                className={cn(
                  "w-full flex items-center rounded-xl transition-all duration-200 p-3",
                  "hover:bg-slate-50",
                  (isCollapsed && !isMobile) && "justify-center",
                  item.isActive && "bg-blue-50 text-blue-600"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5",
                  (!isCollapsed || isMobile) && "mr-3",
                  item.isActive ? "text-blue-600" : "text-slate-600"
                )} />
                
                {(!isCollapsed || isMobile) && (
                  <span className={cn(
                    "text-sm font-medium",
                    item.isActive ? "text-blue-600" : "text-slate-700"
                  )}>
                    {item.label}
                  </span>
                )}

                {item.isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-full" />
                )}
              </button>

              {/* Tooltip para collapsed */}
              {isCollapsed && !isMobile && (
                <div className="absolute left-full ml-3 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 z-50 whitespace-nowrap pointer-events-none shadow-lg">
                  {item.label}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-900 rotate-45" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 p-3 space-y-3">
        {/* User Profile & Upgrade */}
        <div className={cn(
          "bg-slate-50 rounded-xl transition-all duration-300",
          (isCollapsed && !isMobile) ? "p-2" : "p-3"
        )}>
          {(!isCollapsed || isMobile) ? (
            <>
              <div className="flex items-center mb-3">
                <Avatar className="h-8 w-8 mr-3 ring-2 ring-white">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="bg-blue-500 text-white text-sm">
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
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                onClick={() => handleNavigation('/plano')}
              >
                <Crown className="h-3 w-3 mr-2" />
                Upgrade para Pro
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <Avatar className="h-8 w-8 ring-2 ring-white">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="bg-blue-500 text-white text-sm">
                  {getAvatarFallback(userGender)}
                </AvatarFallback>
              </Avatar>
              <Button 
                size="sm" 
                className="w-8 h-8 p-0 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
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
              "w-full flex items-center rounded-xl transition-all duration-200 p-3",
              "hover:bg-red-50 text-red-600",
              (isCollapsed && !isMobile) && "justify-center"
            )}
          >
            <LogOut className={cn("h-5 w-5", (!isCollapsed || isMobile) && "mr-3")} />
            {(!isCollapsed || isMobile) && <span className="text-sm font-medium">Sair</span>}
          </button>
          
          {isCollapsed && !isMobile && (
            <div className="absolute left-full ml-3 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 z-50 whitespace-nowrap pointer-events-none shadow-lg">
              Sair
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-900 rotate-45" />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header */}
      <MobileHeader />

      {/* Desktop Sidebar */}
      {!isMobile && (
        <div className={cn(
          "fixed left-0 top-0 h-screen z-40 transition-all duration-300",
          isCollapsed ? "w-16" : "w-72"
        )}>
          <SidebarContent />
        </div>
      )}

      {/* Mobile Overlay */}
      {isMobile && isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" 
          onClick={() => setIsMobileOpen(false)} 
        />
      )}

      {/* Mobile Sidebar */}
      {isMobile && (
        <div className={cn(
          "fixed inset-y-0 left-0 z-50 shadow-2xl transition-transform duration-300",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <SidebarContent />
        </div>
      )}
    </>
  );
};

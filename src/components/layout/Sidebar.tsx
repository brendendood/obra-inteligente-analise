import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UnifiedLogo } from '@/components/ui/UnifiedLogo';
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
  X
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
  const { getAvatarUrl, getAvatarFallback } = useDefaultAvatar();
  const { userData } = useUserData();

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

  // Fechar mobile sidebar quando redimensionar para desktop
  useEffect(() => {
    if (!isMobile) {
      setIsMobileOpen(false);
    }
  }, [isMobile]);

  // Listener para evento customizado de abrir o sidebar mobile
  useEffect(() => {
    const handleOpenMobileSidebar = () => {
      if (isMobile) {
        setIsMobileOpen(true);
      }
    };

    window.addEventListener('openMobileSidebar', handleOpenMobileSidebar);
    return () => {
      window.removeEventListener('openMobileSidebar', handleOpenMobileSidebar);
    };
  }, [isMobile]);

  const fullName = user?.user_metadata?.full_name || '';
  const avatarUrl = getAvatarUrl(fullName, user?.email);

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
    <header className="lg:hidden bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/6fd4d63a-4d95-4b1f-a41b-e2fa342c2181.png" 
            alt="MadeAI" 
            className="h-12 w-auto" 
          />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileOpen(true)}
          className="p-2 hover:bg-accent rounded-apple"
        >
          <Menu className="h-5 w-5 text-foreground" strokeWidth={1.5} />
        </Button>
      </div>
    </header>
  );

  // Sidebar Content
  const SidebarContent = () => (
    <div className="w-[280px] bg-sidebar border-r border-sidebar-border flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/6fd4d63a-4d95-4b1f-a41b-e2fa342c2181.png" 
            alt="MadeAI" 
            className="h-20 w-auto" 
          />
        </div>
        
        {/* Close Button - mobile only */}
        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileOpen(false)}
            className="p-2 hover:bg-sidebar-accent"
          >
            <X className="h-4 w-4 text-sidebar-foreground" strokeWidth={1.5} />
          </Button>
        )}
      </div>

      {/* Project Limit Bar */}
      <div className="px-4 py-3 border-b border-sidebar-border">
        <ProjectLimitBar 
          currentProjects={userData.projectCount} 
          plan={userData.plan}
          extraCredits={userData.credits}
        />
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "w-full flex items-center rounded-apple transition-all duration-200 p-3 text-left relative group",
                "hover:bg-sidebar-accent",
                item.isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-sidebar-foreground hover:text-sidebar-foreground"
              )}
            >
              <Icon className={cn(
                "h-4 w-4 mr-3 flex-shrink-0",
                item.isActive ? "text-primary" : "text-muted-foreground"
              )} strokeWidth={1.5} />
              
              <span className="text-sm font-medium truncate">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4 space-y-3">
        {/* User Profile & Upgrade */}
        <div className="bg-sidebar-accent rounded-apple p-3">
          <div className="flex items-center mb-2">
            <Avatar className="h-8 w-8 mr-3">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                {getAvatarFallback(fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                Plano {getPlanDisplayName(userData.plan)}
              </p>
            </div>
          </div>
          {canUpgrade(userData.plan) && (
            <Button 
              size="sm" 
              className="w-full h-8 bg-primary hover:bg-primary/90 text-primary-foreground text-xs rounded-apple"
              onClick={() => handleNavigation('/plano')}
            >
              <Crown className="h-3 w-3 mr-1" strokeWidth={1.5} />
              {getUpgradeMessage(userData.plan)}
            </Button>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center rounded-apple transition-all duration-200 p-3 hover:bg-destructive/10 text-destructive"
        >
          <LogOut className="h-4 w-4 mr-3" strokeWidth={1.5} />
          <span className="text-sm font-medium">Sair</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header */}
      <MobileHeader />

      {/* Desktop Sidebar - Always visible and fixed */}
      {!isMobile && (
        <div className="fixed left-0 top-0 h-screen z-40 w-[280px]">
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

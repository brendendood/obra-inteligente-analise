import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UnifiedLogo } from '@/components/ui/UnifiedLogo';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useDefaultAvatar } from '@/hooks/useDefaultAvatar';
import { useToast } from '@/hooks/use-toast';
import { ProjectLimitBar } from './ProjectLimitBar';
import { useUserData } from '@/hooks/useUserData';
import { cn } from '@/lib/utils';
import { getPlanDisplayName, canUpgrade } from '@/utils/planUtils';
import { PlanBadge } from '@/components/ui/PlanBadge';
import { canShowUpgradeButton, renderProjectQuota } from '@/utils/planQuota';

interface AppSidebarProps {
  className?: string;
}

type NavigationItem = {
  icon: string;
  label: string;
  path: string;
  isActive: boolean;
};

// Hook para detectar mobile
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
};

export const AppSidebar = ({ className }: AppSidebarProps) => {
  const isMobile = useIsMobile();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userData } = useUserData();
  const { getAvatarUrl } = useDefaultAvatar();
  const { toast } = useToast();

  const fullName = user?.user_metadata?.full_name || '';

  const navigationItems: NavigationItem[] = [
    { 
      icon: 'Bot', 
      label: 'Assistente IA', 
      path: '/ia',
      isActive: location.pathname === '/ia'
    },
    { 
      icon: 'Home', 
      label: 'Dashboard', 
      path: '/painel',
      isActive: location.pathname === '/painel' || location.pathname === '/'
    },
    { 
      icon: 'Users', 
      label: 'CRM', 
      path: '/crm',
      isActive: location.pathname.startsWith('/crm')
    },
    { 
      icon: 'User', 
      label: 'Conta & Preferências', 
      path: '/conta',
      isActive: location.pathname.startsWith('/conta')
    },
    { 
      icon: 'CreditCard', 
      label: 'Plano e Pagamentos', 
      path: '/plano',
      isActive: location.pathname.startsWith('/plano')
    },
    { 
      icon: 'HelpCircle', 
      label: 'Ajuda e FAQs', 
      path: '/ajuda',
      isActive: location.pathname.startsWith('/ajuda')
    },
    { 
      icon: 'MessageCircle', 
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

  // Listener para evento de abertura do mobile sidebar
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

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut({ scope: 'global' });
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast({
        title: "Erro",
        description: "Não foi possível fazer logout. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const getAvatarFallback = (name: string) => {
    if (!name) return 'U';
    const names = name.trim().split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  // Mobile Header Component
  const MobileHeader = () => (
    <header className="md:hidden sticky top-0 z-50 bg-sidebar border-b border-sidebar-border">
      <div className="flex items-center justify-between p-4">
        <UnifiedLogo size="sm" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileOpen(true)}
          className="p-2"
        >
          <Icon name="Menu" size="md" />
        </Button>
      </div>
    </header>
  );

  // Sidebar Content Component  
  const SidebarContent = () => (
    <div className="w-[280px] bg-sidebar border-r border-sidebar-border flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
        <div className="flex items-center">
          <UnifiedLogo size="sm" />
        </div>
        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileOpen(false)}
            className="p-2"
          >
            <Icon name="X" size="md" />
          </Button>
        )}
      </div>

      {/* Project Quota */}
      <div className="px-6 py-4 border-b border-sidebar-border">
        <ProjectLimitBar currentProjects={userData.projectCount} plan={userData.plan || 'basic'} />
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <button
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            className={cn(
              "w-full flex items-center rounded-apple transition-all duration-200 p-3",
              "hover:bg-sidebar-accent",
              item.isActive 
                ? "bg-primary/10 text-primary" 
                : "text-sidebar-foreground hover:text-sidebar-foreground"
            )}
          >
            <Icon 
              name={item.icon as any}
              size="md"
              className={cn(
                "mr-3 flex-shrink-0",
                item.isActive ? "text-primary" : "text-muted-foreground"
              )} 
            />
            
            <span className="text-sm font-medium truncate">
              {item.label}
            </span>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4 space-y-3">
        {/* User Profile & Plan */}
        <div className="bg-sidebar-accent rounded-apple p-3">
          <div className="flex items-center mb-2">
            <Avatar className="h-8 w-8 mr-3">
              <AvatarImage src={getAvatarUrl(fullName)} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                {getAvatarFallback(fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {fullName || 'Usuário'}
              </p>
              <div className="flex items-center gap-2">
                <PlanBadge planCode={userData.plan} />
                <span className="text-xs text-muted-foreground">
                  {renderProjectQuota(userData.plan, userData.projectCount || 0)}
                </span>
              </div>
            </div>
          </div>
          {canShowUpgradeButton(userData.plan) && (
            <Button 
              size="sm" 
              className="w-full h-8 bg-primary hover:bg-primary/90 text-primary-foreground text-xs rounded-apple"
              onClick={() => handleNavigation('/plano')}
            >
              <Icon name="Crown" size="sm" className="mr-1" />
              Upgrade
            </Button>
          )}
        </div>

        {/* Indique e ganhe */}
        <button
          onClick={() => handleNavigation('/indique')}
          className="w-full flex items-center rounded-apple transition-all duration-200 p-3 hover:bg-sidebar-accent text-primary"
        >
          <Icon name="Gift" size="md" className="mr-3 flex-shrink-0" />
          <span className="text-sm font-medium truncate">
            Indique e ganhe projetos grátis
          </span>
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center rounded-apple transition-all duration-200 p-3 hover:bg-destructive/10 text-destructive"
        >
          <Icon name="LogOut" size="md" className="mr-3" />
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
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50" 
            onClick={() => setIsMobileOpen(false)}
          />
          {/* Sidebar */}
          <div className={cn(
            "fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-out",
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          )}>
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
};
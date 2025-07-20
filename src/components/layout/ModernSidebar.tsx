
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
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Crown
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useDefaultAvatar } from '@/hooks/useDefaultAvatar';
import { useToast } from '@/hooks/use-toast';
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
    }
  ];

  const accountItems = [
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
    }
  ];

  const supportItems = [
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
    <div className="flex flex-col h-full bg-background border-r border-border">
      {/* Header with Logo */}
      <div className={cn("flex items-center px-4 py-4 border-b border-border", isCollapsed && "justify-center px-2")}>
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
          <div className="w-4 h-4 bg-primary-foreground rounded-sm"></div>
        </div>
        {!isCollapsed && (
          <span className="ml-3 text-lg font-bold text-foreground">
            MadenAI
          </span>
        )}
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 flex flex-col px-3 py-4 space-y-6">
        {/* Main Navigation */}
        <div>
          {mainNavItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={cn(
                  "w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group relative mb-1",
                  item.isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent",
                  isCollapsed && "justify-center px-2.5"
                )}
              >
                <Icon className={cn("h-5 w-5 flex-shrink-0", !isCollapsed && "mr-3")} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap pointer-events-none">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Account Section */}
        <div>
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
              Conta
            </h3>
          )}
          {accountItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={cn(
                  "w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group relative mb-1",
                  item.isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent",
                  isCollapsed && "justify-center px-2.5"
                )}
              >
                <Icon className={cn("h-5 w-5 flex-shrink-0", !isCollapsed && "mr-3")} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap pointer-events-none">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Support Section */}
        <div>
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
              Suporte
            </h3>
          )}
          {supportItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={cn(
                  "w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group relative",
                  item.isCTA 
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : item.isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent",
                  isCollapsed && "justify-center px-2.5",
                  index < supportItems.length - 1 && "mb-1"
                )}
              >
                <Icon className={cn("h-5 w-5 flex-shrink-0", !isCollapsed && "mr-3")} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap pointer-events-none">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-border p-3 space-y-3">
        {/* Profile Card - Always Visible */}
        <div className={cn(
          "bg-accent/50 rounded-lg p-3",
          isCollapsed && "p-2"
        )}>
          {!isCollapsed ? (
            <>
              <div className="flex items-center mb-3">
                <Avatar className="h-8 w-8 mr-3">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {getAvatarFallback(userGender)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    Plano Basic
                  </p>
                </div>
              </div>
              <Button 
                size="sm" 
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0"
                onClick={() => handleNavigation('/plano')}
              >
                <Crown className="h-4 w-4 mr-2" />
                Upgrade para Pro
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {getAvatarFallback(userGender)}
                </AvatarFallback>
              </Avatar>
              <Button 
                size="sm" 
                className="w-8 h-8 p-0 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                onClick={() => handleNavigation('/plano')}
              >
                <Crown className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group relative",
            "text-destructive hover:bg-destructive/10",
            isCollapsed && "justify-center px-2.5"
          )}
        >
          <LogOut className={cn("h-5 w-5 flex-shrink-0", !isCollapsed && "mr-3")} />
          {!isCollapsed && <span className="truncate">Sair</span>}
          
          {/* Tooltip for collapsed state */}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap pointer-events-none">
              Sair
            </div>
          )}
        </button>

        {/* Collapse Toggle - Desktop Only */}
        <div className="hidden lg:block">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
              "text-muted-foreground hover:text-foreground hover:bg-accent",
              isCollapsed && "justify-center px-2.5"
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
        "bg-background border-r border-border flex flex-col transition-all duration-300 shadow-sm",
        // Desktop
        "hidden lg:flex",
        isCollapsed ? "w-16" : "w-64",
        // Mobile
        "lg:relative lg:translate-x-0",
        isMobileOpen && "fixed inset-y-0 left-0 z-50 flex w-64"
      )}>
        <SidebarContent />
      </div>
    </>
  );
};

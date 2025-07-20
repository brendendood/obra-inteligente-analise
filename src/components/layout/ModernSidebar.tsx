
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
  PanelLeft,
  PanelLeftClose
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useDefaultAvatar } from '@/hooks/useDefaultAvatar';
import { useToast } from '@/hooks/use-toast';
import { ProjectLimitBar } from './ProjectLimitBar';
import { cn } from '@/lib/utils';

interface ModernSidebarProps {
  isMobile?: boolean;
  onNavigate?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const ModernSidebar = ({ 
  isMobile = false, 
  onNavigate,
  isCollapsed = false,
  onToggleCollapse
}: ModernSidebarProps) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getDefaultAvatarUrl, getAvatarFallback } = useDefaultAvatar();

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
    onNavigate?.(); // Fechar sidebar mobile ao navegar
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      navigate('/');
      onNavigate?.(); // Fechar sidebar mobile após logout
    } catch (error) {
      console.error('Erro no logout:', error);
      toast({
        title: "Erro no logout",
        description: "Ocorreu um erro ao tentar fazer logout.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={cn(
      "bg-white border-r border-slate-200 flex flex-col h-full transition-all duration-300 ease-in-out",
      isMobile ? "w-72" : (isCollapsed ? "w-16" : "w-72")
    )}>
      
      {/* Header Superior - Logo + Toggle Button */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 flex-shrink-0">
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
        
        {/* Toggle Button - apenas no desktop */}
        {!isMobile && onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className={cn(
              "flex items-center justify-center rounded-lg transition-all duration-200 p-2",
              "hover:bg-slate-100 text-slate-500 hover:text-slate-700",
              isCollapsed && "w-8 h-8"
            )}
          >
            {isCollapsed ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {/* Barra de Limite de Projetos */}
      {(!isCollapsed || isMobile) && (
        <div className="p-4 border-b border-slate-200 flex-shrink-0">
          <ProjectLimitBar currentProjects={3} plan="basic" />
        </div>
      )}

      {/* Navegação Principal - Área com scroll */}
      <div className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.path} className="relative group">
              <button
                onClick={() => handleNavigation(item.path)}
                className={cn(
                  "w-full flex items-center rounded-xl transition-all duration-200 relative p-3",
                  "hover:bg-slate-50",
                  (isCollapsed && !isMobile) ? "justify-center" : "",
                  item.isActive && "bg-blue-50 text-blue-600"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 flex-shrink-0",
                  (!isCollapsed || isMobile) && "mr-3",
                  item.isActive ? "text-blue-600" : "text-slate-600"
                )} />
                
                {(!isCollapsed || isMobile) && (
                  <span className={cn(
                    "text-sm font-medium truncate",
                    item.isActive ? "text-blue-600" : "text-slate-700"
                  )}>
                    {item.label}
                  </span>
                )}

                {/* Indicador ativo */}
                {item.isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-full" />
                )}
              </button>

              {/* Tooltip para estado colapsado no desktop */}
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

      {/* Footer Fixo - Perfil, Upgrade e Logout */}
      <div className="border-t border-slate-200 p-3 space-y-3 flex-shrink-0">
        
        {/* Perfil & Upgrade */}
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
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-sm"
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
              "w-full flex items-center rounded-xl transition-all duration-200 p-3",
              "hover:bg-red-50 text-red-600",
              (isCollapsed && !isMobile) && "justify-center"
            )}
          >
            <LogOut className={cn("h-5 w-5 flex-shrink-0", (!isCollapsed || isMobile) && "mr-3")} />
            {(!isCollapsed || isMobile) && <span className="text-sm font-medium truncate">Sair</span>}
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
};

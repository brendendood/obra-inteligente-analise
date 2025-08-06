import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Upload, 
  MessageSquare, 
  Settings,
  Shield,
  User,
  HelpCircle,
  MessageCircle
} from 'lucide-react';
import { useUnifiedAdmin } from '@/hooks/useUnifiedAdmin';
import { cn } from '@/lib/utils';

export const AssistantSidebarNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin } = useUnifiedAdmin();

  const mainNavItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      path: '/painel'
    },
    { 
      icon: MessageSquare, 
      label: 'Assistente IA', 
      path: '/ia'
    },
    { 
      icon: FolderOpen, 
      label: 'Projetos', 
      path: '/projetos'
    },
    { 
      icon: Upload, 
      label: 'Upload', 
      path: '/upload'
    },
  ];

  const supportItems = [
    { icon: User, label: 'Conta & Preferências', path: '/account' },
    { icon: HelpCircle, label: 'Ajuda e FAQs', path: '/help' },
    { icon: MessageCircle, label: 'Fale com a Gente', path: '/contact' }
  ];

  const isActive = (path: string) => {
    if (path === '/painel') {
      return location.pathname === '/painel' || location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const NavButton = ({ item }: { item: { icon: any; label: string; path: string } }) => {
    const Icon = item.icon;
    const active = isActive(item.path);
    
    return (
      <button
        onClick={() => handleNavigate(item.path)}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
          active
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
        )}
      >
        <Icon className="h-4 w-4 flex-shrink-0" />
        <span>{item.label}</span>
      </button>
    );
  };

  return (
    <div className="flex flex-col space-y-6 p-4">
      {/* Main Navigation */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-sidebar-muted-foreground uppercase tracking-wider px-3">
          Principal
        </h3>
        <div className="space-y-1">
          {mainNavItems.map((item) => (
            <NavButton key={item.path} item={item} />
          ))}
        </div>
      </div>

      {/* Support & Account */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-sidebar-muted-foreground uppercase tracking-wider px-3">
          Suporte
        </h3>
        <div className="space-y-1">
          {supportItems.map((item) => (
            <NavButton key={item.path} item={item} />
          ))}
        </div>
      </div>

      {/* Admin Access */}
      {isAdmin && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-sidebar-muted-foreground uppercase tracking-wider px-3">
            Admin
          </h3>
          <div className="space-y-1">
            <NavButton item={{ icon: Shield, label: 'Admin', path: '/admin' }} />
          </div>
        </div>
      )}

      {/* Settings */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-sidebar-muted-foreground uppercase tracking-wider px-3">
          Configurações
        </h3>
        <div className="space-y-1">
          <NavButton item={{ icon: Settings, label: 'Configurações', path: '/configuracoes' }} />
        </div>
      </div>
    </div>
  );
};
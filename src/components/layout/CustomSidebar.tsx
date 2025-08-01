import { ChevronLeft, ChevronRight, Bot, Home, User, CreditCard, HelpCircle, MessageCircle, Folder, Calendar, BarChart3 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LogoImage } from '@/components/ui/LogoImage';

interface CustomSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const navigationItems = [
  { icon: Bot, label: 'Assistente IA', path: '/ia' },
  { icon: Home, label: 'Dashboard', path: '/painel' },
  { icon: Folder, label: 'Projetos', path: '/projetos' },
  { icon: Calendar, label: 'Cronograma', path: '/cronograma' },
  { icon: BarChart3, label: 'Orçamento', path: '/orcamento' },
  { icon: User, label: 'Conta', path: '/conta' },
  { icon: CreditCard, label: 'Plano', path: '/plano' },
  { icon: HelpCircle, label: 'Ajuda', path: '/ajuda' },
  { icon: MessageCircle, label: 'Contato', path: '/contato' },
];

export const CustomSidebar = ({ isCollapsed, onToggle }: CustomSidebarProps) => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/painel') {
      return location.pathname === '/painel' || location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div 
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 ease-in-out flex flex-col z-50",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border relative">
        <div 
          className={cn(
            "transition-opacity duration-200",
            isCollapsed ? "opacity-0" : "opacity-100"
          )}
        >
          <LogoImage size="md" clickable={false} />
        </div>
        
        <button
          onClick={onToggle}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-sidebar-accent transition-colors duration-200"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5 shrink-0" />
          ) : (
            <ChevronLeft className="h-5 w-5 shrink-0" />
          )}
        </button>
      </div>

      {/* Navigation Area */}
      <ScrollArea className="flex-1">
        <div className="grid gap-1 px-2 py-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <a
                key={item.path}
                href={item.path}
                className={cn(
                  "flex items-center rounded-md transition-all duration-200 text-sm font-medium h-10",
                  "hover:bg-sidebar-accent",
                  active ? "bg-sidebar-accent" : "",
                  isCollapsed ? "justify-center px-0" : "px-3"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!isCollapsed && (
                  <span className={cn(
                    "ml-3 transition-opacity duration-200",
                    isCollapsed ? "opacity-0" : "opacity-100"
                  )}>
                    {item.label}
                  </span>
                )}
              </a>
            );
          })}
        </div>
      </ScrollArea>

      {/* Footer/Status */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="bg-sidebar-accent/50 rounded-md p-3">
          <div className={cn(
            "text-xs text-sidebar-foreground/70 transition-opacity duration-200",
            isCollapsed ? "opacity-0" : "opacity-100"
          )}>
            Sistema Online
          </div>
        </div>
      </div>
    </div>
  );
};
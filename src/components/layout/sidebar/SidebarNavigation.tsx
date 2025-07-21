

import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Upload, 
  Calculator, 
  Calendar, 
  MessageSquare, 
  FileText, 
  Settings,
  Shield,
  User,
  HelpCircle,
  MessageCircle
} from 'lucide-react';
import { 
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';

export const SidebarNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { open } = useSidebar();

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

  const toolsItems = [
    { icon: Calculator, label: 'Orçamento', path: '/orcamento' },
    { icon: Calendar, label: 'Cronograma', path: '/cronograma' },
    { icon: FileText, label: 'Documentos', path: '/documentos' }
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

  return (
    <div className="flex flex-col space-y-2">
      {/* Main Navigation */}
      <SidebarGroup>
        <SidebarGroupLabel>Principal</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={active}
                    tooltip={!open ? item.label : undefined}
                  >
                    <button 
                      onClick={() => handleNavigate(item.path)}
                      className="w-full flex items-center"
                    >
                      <Icon />
                      {open && <span>{item.label}</span>}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* Tools */}
      <SidebarGroup>
        <SidebarGroupLabel>Ferramentas</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {toolsItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={active}
                    tooltip={!open ? item.label : undefined}
                  >
                    <button 
                      onClick={() => handleNavigate(item.path)}
                      className="w-full flex items-center"
                    >
                      <Icon />
                      {open && <span>{item.label}</span>}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* Support & Account */}
      <SidebarGroup>
        <SidebarGroupLabel>Suporte</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {supportItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={active}
                    tooltip={!open ? item.label : undefined}
                  >
                    <button 
                      onClick={() => handleNavigate(item.path)}
                      className="w-full flex items-center"
                    >
                      <Icon />
                      {open && <span>{item.label}</span>}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* Admin Access */}
      {isAdmin && (
        <SidebarGroup>
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive('/admin')}
                  tooltip={!open ? 'Admin' : undefined}
                >
                  <button 
                    onClick={() => handleNavigate('/admin')}
                    className="w-full flex items-center"
                  >
                    <Shield />
                    {open && <span>Admin</span>}
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      )}

      {/* Settings */}
      <SidebarGroup>
        <SidebarGroupLabel>Configurações</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive('/configuracoes')}
                tooltip={!open ? 'Configurações' : undefined}
              >
                <button 
                  onClick={() => handleNavigate('/configuracoes')}
                  className="w-full flex items-center"
                >
                  <Settings />
                  {open && <span>Configurações</span>}
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </div>
  );
};


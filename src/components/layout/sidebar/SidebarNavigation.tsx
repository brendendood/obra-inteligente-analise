
import { useLocation, useParams } from 'react-router-dom';
import { 
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard, 
  Plus, 
  Bot, 
  Calculator, 
  Calendar, 
  FileText
} from 'lucide-react';
import { useContextualNavigation } from '@/hooks/useContextualNavigation';
import { useProject } from '@/contexts/ProjectContext';

export const SidebarNavigation = () => {
  const location = useLocation();
  const { projectId } = useParams<{ projectId: string }>();
  const { currentProject } = useProject();
  const { navigateContextual } = useContextualNavigation();

  const handleNavigation = (path: string) => {
    navigateContextual(path, projectId);
  };

  // Determinar se estamos numa área de projeto
  const isInProject = projectId && currentProject;

  // Menu items para navegação geral
  const generalMenuItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      path: '/painel',
      color: 'text-blue-600'
    },
    { 
      icon: Plus, 
      label: 'Upload', 
      path: '/upload',
      color: 'text-purple-600'
    },
    { 
      icon: Bot, 
      label: 'Assistente', 
      path: '/ia',
      color: 'text-orange-600'
    }
  ];

  // Menu items para área do projeto - ROTA CORRIGIDA
  const projectMenuItems = [
    { 
      icon: FileText, 
      label: 'Visão Geral', 
      path: `/projeto/${projectId}`,
      color: 'text-blue-600'
    },
    { 
      icon: Calculator, 
      label: 'Orçamento', 
      path: `/projeto/${projectId}/orcamento`,
      color: 'text-red-600'
    },
    { 
      icon: Calendar, 
      label: 'Cronograma', 
      path: `/projeto/${projectId}/cronograma`,
      color: 'text-indigo-600'
    },
    { 
      icon: Bot, 
      label: 'Assistente IA', 
      path: `/projeto/${projectId}/assistente`,
      color: 'text-orange-600'
    },
    { 
      icon: FileText, 
      label: 'Documentos', 
      path: `/projeto/${projectId}/documentos`,
      color: 'text-teal-600'
    }
  ];

  const isActive = (path: string) => location.pathname === path;
  const menuItems = isInProject ? projectMenuItems : generalMenuItems;

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  onClick={() => handleNavigation(item.path)}
                  isActive={active}
                  className={`
                    flex items-center space-x-3 h-12 px-4 text-left font-medium transition-all duration-200
                    ${active 
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className={`h-5 w-5 ${active ? 'text-blue-600' : item.color}`} />
                  <span className="flex-1">{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

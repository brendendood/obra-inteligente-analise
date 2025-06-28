
import { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
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
  FileText, 
  LogOut,
  ArrowLeft,
  Building2,
  User
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProject } from '@/contexts/ProjectContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useContextualNavigation } from '@/hooks/useContextualNavigation';
import { MyAccountDialog } from '@/components/account/MyAccountDialog';
import { useDefaultAvatar } from '@/hooks/useDefaultAvatar';

export const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();
  const { currentProject } = useProject();
  const { toast } = useToast();
  const { navigateContextual, clearHistory } = useContextualNavigation();
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false);
  const { getDefaultAvatarUrl, getAvatarFallback } = useDefaultAvatar();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      clearHistory();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      navigate('/');
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const handleNavigation = (path: string) => {
    navigateContextual(path, projectId);
  };

  const handleBackToDashboard = () => {
    navigateContextual('/painel');
  };

  // Determinar se estamos numa área de projeto
  const isInProject = projectId && currentProject;

  // Menu items para navegação geral (sem "Projetos", apenas Dashboard, Upload e Assistente)
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

  // Menu items para área do projeto
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
      path: `/ia/${projectId}`,
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

  const userGender = user?.user_metadata?.gender;
  const avatarUrl = user?.user_metadata?.avatar_url || getDefaultAvatarUrl(userGender);

  return (
    <>
      <Sidebar className="border-r">
        <SidebarHeader className="border-b border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <span className="text-xl font-bold text-gray-800">MadenAI</span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          {/* Project Context Header */}
          {isInProject && currentProject && (
            <SidebarGroup>
              <div className="p-4 bg-blue-50 border-b border-blue-100">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToDashboard}
                  className="w-full justify-start mb-2 text-blue-700 hover:bg-blue-100"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar para Dashboard
                </Button>
                <div className="flex items-center space-x-2 px-2">
                  <Building2 className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800 truncate">
                    {currentProject.name}
                  </span>
                </div>
              </div>
            </SidebarGroup>
          )}

          {/* Navigation Menu */}
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
        </SidebarContent>

        <SidebarFooter className="border-t border-gray-100 p-4">
          <div className="space-y-3">
            {/* Minha Conta */}
            <Button
              variant="outline"
              className="w-full justify-start h-10 text-blue-600 border-blue-200 hover:bg-blue-50"
              onClick={() => setIsAccountDialogOpen(true)}
            >
              <User className="h-4 w-4 mr-3" />
              Minha Conta
            </Button>

            {/* User Info */}
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
              <Avatar className="h-10 w-10">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="bg-blue-600 text-white">
                  {getAvatarFallback(userGender)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {user?.user_metadata?.full_name || 'Usuário'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            
            <Button
              variant="outline"
              className="w-full justify-start h-10 text-red-600 border-red-200 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sair
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>

      {/* Dialog Minha Conta */}
      <MyAccountDialog 
        isOpen={isAccountDialogOpen}
        onClose={() => setIsAccountDialogOpen(false)}
      />
    </>
  );
};

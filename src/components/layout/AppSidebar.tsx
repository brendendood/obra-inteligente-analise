
import { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Plus, 
  Bot, 
  Calculator, 
  Calendar, 
  FileText, 
  LogOut,
  X,
  HelpCircle,
  ArrowLeft,
  Building2
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProject } from '@/contexts/ProjectContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useContextualNavigation } from '@/hooks/useContextualNavigation';

interface AppSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const AppSidebar = ({ isOpen, onToggle }: AppSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();
  const { currentProject } = useProject();
  const { toast } = useToast();
  const { navigateContextual, goBack, clearHistory } = useContextualNavigation();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      clearHistory(); // Limpar histórico de navegação
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
    if (window.innerWidth < 1024) onToggle();
  };

  const handleBackToProjects = () => {
    goBack(projectId);
    if (window.innerWidth < 1024) onToggle();
  };

  // Determinar se estamos numa área de projeto
  const isInProject = projectId && currentProject;

  // Menu items para navegação geral (sem projeto específico)
  const generalMenuItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Painel', 
      path: '/painel',
      color: 'text-blue-500',
      tooltip: 'Visão geral dos seus projetos'
    },
    { 
      icon: FolderOpen, 
      label: 'Obras', 
      path: '/obras',
      color: 'text-green-500',
      tooltip: 'Gerenciar todos os projetos'
    },
    { 
      icon: Plus, 
      label: 'Nova Obra', 
      path: '/upload',
      color: 'text-purple-500',
      tooltip: 'Enviar novo projeto PDF'
    }
  ];

  // Menu items para área do projeto
  const projectMenuItems = [
    { 
      icon: FileText, 
      label: 'Visão Geral', 
      path: `/projeto/${projectId}`,
      color: 'text-blue-500',
      tooltip: 'Informações gerais do projeto'
    },
    { 
      icon: Calculator, 
      label: 'Orçamento', 
      path: `/projeto/${projectId}/orcamento`,
      color: 'text-red-500',
      tooltip: 'Gerar orçamentos SINAPI'
    },
    { 
      icon: Calendar, 
      label: 'Cronograma', 
      path: `/projeto/${projectId}/cronograma`,
      color: 'text-indigo-500',
      tooltip: 'Timeline das etapas'
    },
    { 
      icon: Bot, 
      label: 'Assistente IA', 
      path: `/projeto/${projectId}/assistente`,
      color: 'text-orange-500',
      tooltip: 'Chat inteligente sobre projetos'
    },
    { 
      icon: FileText, 
      label: 'Documentos', 
      path: `/projeto/${projectId}/documentos`,
      color: 'text-teal-500',
      tooltip: 'Downloads e relatórios'
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  const menuItems = isInProject ? projectMenuItems : generalMenuItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 shadow-lg z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:static lg:shadow-none
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <span className="text-xl font-bold text-gray-800">ConstructIA</span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Project Context Header */}
        {isInProject && currentProject && (
          <div className="p-4 bg-blue-25 border-b border-blue-100">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToProjects}
              className="w-full justify-start mb-2 text-blue-600 hover:bg-blue-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Obras
            </Button>
            <div className="flex items-center space-x-2 px-2">
              <Building2 className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-800 truncate">
                {currentProject.name}
              </span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Tooltip key={item.path}>
                <TooltipTrigger asChild>
                  <Button
                    variant={active ? "default" : "ghost"}
                    className={`
                      w-full justify-start h-12 px-4 text-left font-medium transition-all duration-200
                      ${active 
                        ? 'bg-blue-25 text-blue-600 border border-blue-100 shadow-sm' 
                        : 'text-gray-600 hover:bg-gray-25 hover:text-gray-800'
                      }
                    `}
                    onClick={() => handleNavigation(item.path)}
                  >
                    <Icon className={`h-5 w-5 mr-3 ${active ? 'text-blue-500' : item.color}`} />
                    <span className="flex-1">{item.label}</span>
                    <HelpCircle className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="ml-2">
                  <p>{item.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="border-t border-gray-100 p-4 space-y-3">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-25">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-blue-500 text-white">
                {user?.email?.charAt(0).toUpperCase()}
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
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start h-10 text-red-500 border-red-100 hover:bg-red-25"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-3" />
                Sair
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Desconectar da plataforma</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </>
  );
};

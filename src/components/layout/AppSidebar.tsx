
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Plus, 
  Bot, 
  Calculator, 
  Calendar, 
  FileText, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AppSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const AppSidebar = ({ isOpen, onToggle }: AppSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      navigate('/login');
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Painel', 
      path: '/painel',
      color: 'text-blue-600'
    },
    { 
      icon: FolderOpen, 
      label: 'Obras', 
      path: '/obras',
      color: 'text-green-600'
    },
    { 
      icon: Plus, 
      label: 'Nova Obra', 
      path: '/upload',
      color: 'text-purple-600'
    },
    { 
      icon: Bot, 
      label: 'Assistente IA', 
      path: '/assistant',
      color: 'text-orange-600'
    },
    { 
      icon: Calculator, 
      label: 'Orçamento', 
      path: '/budget',
      color: 'text-red-600'
    },
    { 
      icon: Calendar, 
      label: 'Cronograma', 
      path: '/schedule',
      color: 'text-indigo-600'
    },
    { 
      icon: FileText, 
      label: 'Documentos', 
      path: '/documents',
      color: 'text-teal-600'
    }
  ];

  const isActive = (path: string) => location.pathname === path;

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
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <span className="text-xl font-bold text-gray-900">ConstructIA</span>
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

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Button
                key={item.path}
                variant={active ? "default" : "ghost"}
                className={`
                  w-full justify-start h-12 px-4 text-left font-medium transition-all duration-200
                  ${active 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
                onClick={() => {
                  navigate(item.path);
                  if (window.innerWidth < 1024) onToggle();
                }}
              >
                <Icon className={`h-5 w-5 mr-3 ${active ? 'text-blue-600' : item.color}`} />
                {item.label}
              </Button>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="border-t border-gray-100 p-4 space-y-3">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-blue-600 text-white">
                {user?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
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
      </div>
    </>
  );
};

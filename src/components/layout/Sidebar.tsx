
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ThemeToggle from './ThemeToggle';
import { 
  FolderOpen, 
  LayoutDashboard, 
  Upload, 
  MessageSquare, 
  Calculator, 
  Calendar, 
  FileText, 
  LogOut,
  Menu,
  X,
  Settings
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer logout. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Painel', path: '/painel' },
    { icon: FolderOpen, label: 'Obras', path: '/obras' },
    { icon: Upload, label: 'Nova Obra', path: '/upload' },
    { icon: MessageSquare, label: 'Assistente IA', path: '/assistant' },
    { icon: Calculator, label: 'Orçamento', path: '/budget' },
    { icon: Calendar, label: 'Cronograma', path: '/schedule' },
    { icon: FileText, label: 'Documentos', path: '/documents' },
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-card text-foreground rounded-md border border-border"
      >
        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:relative inset-y-0 left-0 z-40
        w-64 bg-card border-r border-border flex flex-col
        transform transition-transform duration-200 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
              <FolderOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">ArchiAI</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActivePath(item.path);
            
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsMobileMenuOpen(false);
                }}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors
                  ${isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Theme Toggle and User Section */}
        <div className="border-t border-border p-4 space-y-4">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Tema</span>
            <ThemeToggle />
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-3 p-2 rounded-lg bg-muted/50">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground truncate">
                {user?.email || 'Usuário'}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-red-600/20 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

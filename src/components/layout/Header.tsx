
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  LogOut, 
  Settings, 
  Moon, 
  Sun,
  ArrowLeft,
  FolderOpen
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from './ThemeProvider';
import { useNavigationHistory } from '@/hooks/useNavigationHistory';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Header = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { goBack } = useNavigationHistory();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
      toast({
        title: "👋 Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const showBackButton = location.pathname !== '/' && location.pathname !== '/painel';

  return (
    <header className="bg-background dark:bg-[#1a1a1a] border-b border-border dark:border-[#333] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and Back Button */}
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={goBack}
                className="text-muted-foreground dark:text-[#bbbbbb] hover:text-foreground dark:hover:text-[#f2f2f2] hover:bg-accent dark:hover:bg-[#232323]"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            )}
            
            <div className="flex items-center space-x-2">
              <div className="bg-primary p-2 rounded-lg shadow-lg">
                <FolderOpen className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground dark:text-[#f2f2f2]">
                  ArchiAI
                </h1>
                <p className="text-xs text-muted-foreground dark:text-[#bbbbbb]">
                  Análise Inteligente de Projetos
                </p>
              </div>
            </div>
          </div>

          {/* Right side - User menu and theme toggle */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="text-muted-foreground dark:text-[#bbbbbb] hover:text-foreground dark:hover:text-[#f2f2f2] hover:bg-accent dark:hover:bg-[#232323]"
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>

            {user && (
              <>
                {/* User Info */}
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground dark:text-[#f2f2f2]">
                      {user.email}
                    </p>
                    <Badge variant="outline" className="text-xs border-border dark:border-[#333] text-muted-foreground dark:text-[#bbbbbb]">
                      Usuário
                    </Badge>
                  </div>
                  <div className="bg-primary p-2 rounded-full shadow-lg">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/painel')}
                    className="text-muted-foreground dark:text-[#bbbbbb] hover:text-foreground dark:hover:text-[#f2f2f2] hover:bg-accent dark:hover:bg-[#232323]"
                  >
                    Painel
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/obras')}
                    className="text-muted-foreground dark:text-[#bbbbbb] hover:text-foreground dark:hover:text-[#f2f2f2] hover:bg-accent dark:hover:bg-[#232323]"
                  >
                    Obras
                  </Button>
                </div>

                {/* Logout Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-destructive dark:text-red-400 hover:text-destructive hover:bg-destructive/10 dark:hover:bg-red-900/20"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

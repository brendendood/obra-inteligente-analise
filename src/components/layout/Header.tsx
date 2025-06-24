
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
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and Back Button */}
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={goBack}
                className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            )}
            
            <div className="flex items-center space-x-2">
              <div className="bg-black p-2 rounded-lg shadow-lg">
                <FolderOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  ArchiAI
                </h1>
                <p className="text-xs text-slate-500">
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
              className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
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
                    <p className="text-sm font-medium text-slate-900">
                      {user.email}
                    </p>
                    <Badge variant="outline" className="text-xs border-slate-300 text-slate-600">
                      Usuário
                    </Badge>
                  </div>
                  <div className="bg-black p-2 rounded-full shadow-lg">
                    <User className="h-4 w-4 text-white" />
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/painel')}
                    className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  >
                    Painel
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/obras')}
                    className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  >
                    Obras
                  </Button>
                </div>

                {/* Logout Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
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

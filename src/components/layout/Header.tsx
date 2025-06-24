
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  LogOut, 
  Moon, 
  Sun,
  ArrowLeft,
  FolderOpen,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from './ThemeProvider';
import { useNavigationHistory } from '@/hooks/useNavigationHistory';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const Header = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { goBack } = useNavigationHistory();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const navigationLinks = [
    { to: '/painel', label: 'Painel' },
    { to: '/obras', label: 'Obras' }
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="bg-background dark:bg-[#1a1a1a] border-b border-border dark:border-[#333] shadow-sm sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Left side - Logo and Back Button */}
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1 sm:flex-none">
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={goBack}
                className="text-muted-foreground dark:text-[#bbbbbb] hover:text-foreground dark:hover:text-[#f2f2f2] hover:bg-accent dark:hover:bg-[#232323] hidden sm:flex"
              >
                <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Voltar</span>
              </Button>
            )}
            
            <Link to="/" className="flex items-center space-x-2 min-w-0" onClick={closeMobileMenu}>
              <div className="bg-primary p-1.5 sm:p-2 rounded-lg shadow-lg flex-shrink-0">
                <FolderOpen className="h-4 w-4 sm:h-6 sm:w-6 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-foreground dark:text-[#f2f2f2] truncate">
                  ArchiAI
                </h1>
                <p className="text-xs text-muted-foreground dark:text-[#bbbbbb] hidden sm:block truncate">
                  Análise Inteligente de Projetos
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
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

            {user ? (
              <>
                {/* User Info */}
                <div className="flex items-center space-x-3">
                  <div className="text-right hidden xl:block">
                    <p className="text-sm font-medium text-foreground dark:text-[#f2f2f2] truncate max-w-[150px]">
                      {user.email}
                    </p>
                    <Badge variant="outline" className="text-xs border-border dark:border-[#333] text-muted-foreground dark:text-[#bbbbbb]">
                      Usuário
                    </Badge>
                  </div>
                  <div className="bg-primary p-2 rounded-full shadow-lg flex-shrink-0">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center space-x-2">
                  {navigationLinks.map((link) => (
                    <Button
                      key={link.to}
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(link.to)}
                      className={cn(
                        "text-muted-foreground dark:text-[#bbbbbb] hover:text-foreground dark:hover:text-[#f2f2f2] hover:bg-accent dark:hover:bg-[#232323] transition-all duration-200",
                        location.pathname === link.to && "bg-accent dark:bg-[#232323] text-foreground dark:text-[#f2f2f2]"
                      )}
                    >
                      {link.label}
                    </Button>
                  ))}
                </div>

                {/* Logout Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-destructive dark:text-red-400 hover:text-destructive hover:bg-destructive/10 dark:hover:bg-red-900/20 transition-all duration-200"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-muted-foreground dark:text-[#bbbbbb] hover:text-foreground dark:hover:text-[#f2f2f2]">
                    Entrar
                  </Button>
                </Link>
                <Link to="/cadastro">
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:bg-gradient-to-r dark:from-green-600 dark:to-green-500 text-white">
                    Cadastrar
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 lg:hidden">
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
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-muted-foreground dark:text-[#bbbbbb] hover:text-foreground dark:hover:text-[#f2f2f2] hover:bg-accent dark:hover:bg-[#232323]"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border dark:border-[#333] bg-background dark:bg-[#1a1a1a] animate-fade-in">
          <div className="px-4 py-3 space-y-3">
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  goBack();
                  closeMobileMenu();
                }}
                className="w-full justify-start text-muted-foreground dark:text-[#bbbbbb] hover:text-foreground dark:hover:text-[#f2f2f2] hover:bg-accent dark:hover:bg-[#232323]"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            )}

            {user ? (
              <>
                <div className="px-3 py-2 border-b border-border dark:border-[#333]">
                  <p className="text-sm font-medium text-foreground dark:text-[#f2f2f2] truncate">
                    {user.email}
                  </p>
                  <Badge variant="outline" className="text-xs border-border dark:border-[#333] text-muted-foreground dark:text-[#bbbbbb] mt-1">
                    Usuário
                  </Badge>
                </div>

                {navigationLinks.map((link) => (
                  <Button
                    key={link.to}
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigate(link.to);
                      closeMobileMenu();
                    }}
                    className={cn(
                      "w-full justify-start text-muted-foreground dark:text-[#bbbbbb] hover:text-foreground dark:hover:text-[#f2f2f2] hover:bg-accent dark:hover:bg-[#232323]",
                      location.pathname === link.to && "bg-accent dark:bg-[#232323] text-foreground dark:text-[#f2f2f2]"
                    )}
                  >
                    {link.label}
                  </Button>
                ))}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    handleLogout();
                    closeMobileMenu();
                  }}
                  className="w-full justify-start text-destructive dark:text-red-400 hover:text-destructive hover:bg-destructive/10 dark:hover:bg-red-900/20"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </>
            ) : (
              <div className="space-y-2">
                <Link to="/login" onClick={closeMobileMenu}>
                  <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground dark:text-[#bbbbbb] hover:text-foreground dark:hover:text-[#f2f2f2]">
                    Entrar
                  </Button>
                </Link>
                <Link to="/cadastro" onClick={closeMobileMenu}>
                  <Button size="sm" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 dark:bg-gradient-to-r dark:from-green-600 dark:to-green-500 text-white">
                    Cadastrar
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

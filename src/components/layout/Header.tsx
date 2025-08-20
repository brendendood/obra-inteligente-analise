
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Menu } from 'lucide-react';
import { UnifiedLogo } from '@/components/ui/UnifiedLogo';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-border/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 lg:py-4">
          {/* Logo - Bustem Style */}
          <div className="flex items-center">
            <UnifiedLogo size="lg" theme="auto" priority />
          </div>

          {/* Desktop Navigation - Bustem Style */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex items-center space-x-6">
              <a href="#recursos" className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">
                Recursos
              </a>
              <a href="#como-funciona" className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">
                Como Funciona
              </a>
              <a href="#precos" className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">
                Preços
              </a>
            </nav>
            
            <div className="flex items-center space-x-3">
              {!user ? (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate('/login')}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground"
                  >
                    Entrar
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => navigate('/upload')}
                    className="bg-primary hover:bg-primary/90 text-white font-medium rounded-lg px-4 py-2 text-sm"
                  >
                    Analisar Projeto Grátis
                  </Button>
                </>
              ) : (
                <Button 
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                  className="bg-primary hover:bg-primary/90 text-white font-medium rounded-lg px-4 py-2 text-sm"
                >
                  Dashboard
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="transition-all duration-200 hover:bg-muted p-2"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-border/50">
            <nav className="flex flex-col space-y-4">
              <a href="#recursos" className="text-muted-foreground hover:text-foreground text-sm font-medium">
                Recursos
              </a>
              <a href="#como-funciona" className="text-muted-foreground hover:text-foreground text-sm font-medium">
                Como Funciona
              </a>
              <a href="#precos" className="text-muted-foreground hover:text-foreground text-sm font-medium">
                Preços
              </a>
              
              <div className="flex flex-col space-y-2 pt-4 border-t border-border/50">
                {!user ? (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/login')}
                      className="w-full justify-center"
                    >
                      Entrar
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => navigate('/upload')}
                      className="w-full justify-center bg-primary hover:bg-primary/90 text-white"
                    >
                      Analisar Projeto Grátis
                    </Button>
                  </>
                ) : (
                  <Button 
                    size="sm"
                    onClick={() => navigate('/dashboard')}
                    className="w-full justify-center bg-primary hover:bg-primary/90 text-white"
                  >
                    Dashboard
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

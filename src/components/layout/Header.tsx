
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
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Bustem Style */}
          <div className="flex items-center">
            <UnifiedLogo size="md" theme="auto" priority />
          </div>

          {/* Desktop Navigation - Bustem Style */}
          <div className="hidden lg:flex items-center space-x-8">
            <nav className="flex items-center space-x-8">
              <a href="#recursos" className="text-gray-600 hover:text-navy font-medium text-[15px] transition-colors duration-200">
                Recursos
              </a>
              <a href="#como-funciona" className="text-gray-600 hover:text-navy font-medium text-[15px] transition-colors duration-200">
                Como Funciona
              </a>
              <a href="#precos" className="text-gray-600 hover:text-navy font-medium text-[15px] transition-colors duration-200">
                Preços
              </a>
            </nav>
            
            <div className="flex items-center space-x-4">
              {!user ? (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate('/login')}
                    className="text-[15px] font-medium text-gray-600 hover:text-navy hover:bg-transparent px-4 py-2"
                  >
                    Entrar
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => navigate('/upload')}
                    className="bg-navy hover:bg-navy/90 text-white font-medium rounded-lg px-6 py-2.5 text-[15px] transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Analisar Projeto Grátis
                  </Button>
                </>
              ) : (
                <Button 
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                  className="bg-navy hover:bg-navy/90 text-white font-medium rounded-lg px-6 py-2.5 text-[15px] transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Dashboard
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="transition-all duration-200 hover:bg-gray-100 p-2"
            >
              {isMenuOpen ? <X className="h-5 w-5 text-gray-600" /> : <Menu className="h-5 w-5 text-gray-600" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden pb-6 pt-4 border-t border-gray-200 bg-white">
            <nav className="flex flex-col space-y-6">
              <a href="#recursos" className="text-gray-600 hover:text-navy font-medium text-[15px] px-2">
                Recursos
              </a>
              <a href="#como-funciona" className="text-gray-600 hover:text-navy font-medium text-[15px] px-2">
                Como Funciona
              </a>
              <a href="#precos" className="text-gray-600 hover:text-navy font-medium text-[15px] px-2">
                Preços
              </a>
              
              <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
                {!user ? (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/login')}
                      className="w-full justify-center border-gray-300 text-gray-600 hover:text-navy hover:border-navy"
                    >
                      Entrar
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => navigate('/upload')}
                      className="w-full justify-center bg-navy hover:bg-navy/90 text-white font-medium rounded-lg py-2.5"
                    >
                      Analisar Projeto Grátis
                    </Button>
                  </>
                ) : (
                  <Button 
                    size="sm"
                    onClick={() => navigate('/dashboard')}
                    className="w-full justify-center bg-navy hover:bg-navy/90 text-white font-medium rounded-lg py-2.5"
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

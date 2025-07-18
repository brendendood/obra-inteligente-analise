
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Menu } from 'lucide-react';
import { HeaderLogo } from './header/HeaderLogo';
import { HeaderAuthActions } from './header/HeaderAuthActions';
import { HeaderMobileMenu } from './header/HeaderMobileMenu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-slate-200 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center py-3 sm:py-4 lg:h-16">
          {/* Logo à esquerda */}
          <div className="flex items-center">
            <div className="font-display font-bold text-lg sm:text-xl lg:text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              MadenAI
            </div>
          </div>

          {/* Desktop Actions - Apenas botões de auth */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <HeaderAuthActions />
          </div>

          {/* Mobile Menu Button - Apenas à direita */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="transition-all duration-200 hover:bg-slate-50 p-2"
            >
              {isMenuOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <HeaderMobileMenu 
          isOpen={isMenuOpen} 
          onClose={() => setIsMenuOpen(false)} 
        />
      </div>
    </header>
  );
};

export default Header;

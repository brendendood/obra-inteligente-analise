
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Menu } from 'lucide-react';
import { UnifiedLogo } from '@/components/ui/UnifiedLogo';
import { HeaderAuthActions } from './header/HeaderAuthActions';
import { HeaderMobileMenu } from './header/HeaderMobileMenu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-apple-gray-200 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6 sm:py-8 lg:h-24">
          {/* Logo à esquerda - com destaque máximo */}
          <div className="flex items-center bg-gradient-to-r from-white to-apple-gray-50 rounded-2xl px-6 py-3 shadow-sm border border-apple-gray-100">
            <UnifiedLogo size="2xl" theme="auto" className="transition-all duration-300 hover:scale-110 filter hover:brightness-110" />
          </div>

          {/* Desktop Actions - Apenas botão de auth */}
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

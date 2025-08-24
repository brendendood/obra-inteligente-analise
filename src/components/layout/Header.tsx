
import { useState, useEffect } from 'react';
import { StarBorder } from '@/components/ui/star-border';
import { X, Menu } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-4 left-4 right-4 z-50 transition-colors duration-300 bg-white/70 supports-[backdrop-filter]:backdrop-blur-md shadow-none border border-black/5 dark:bg-black dark:shadow-none dark:border-white/10 rounded-2xl">
      <div className="max-w-7xl mx-auto px-6 md:px-8 rounded-xl transition-colors duration-300">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Logo className="transition-all duration-300 hover:scale-105" />
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <StarBorder 
              as={Link}
              to="/login" 
              className="px-4 py-2 text-sm"
            >
              Login
            </StarBorder>
            <StarBorder 
              as={Link}
              to="/cadastro"
              className="px-6 py-2 text-sm"
            >
              Começar Agora
            </StarBorder>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <StarBorder 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="p-2 text-sm"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </StarBorder>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border mt-4 theme-transition">
            <div className="flex flex-col space-y-3">
              <StarBorder 
                as={Link}
                to="/login"
                className="w-full px-4 py-2 text-sm text-left"
              >
                Login
              </StarBorder>
              <StarBorder 
                as={Link}
                to="/cadastro"
                className="w-full px-4 py-2 text-sm text-left"
              >
                Começar Agora
              </StarBorder>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

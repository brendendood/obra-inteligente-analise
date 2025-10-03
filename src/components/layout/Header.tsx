
import { useState, useEffect } from 'react';
import { AppleButton } from '@/components/ui/apple-button';
import { X, Menu } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Link } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const { theme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-4 left-4 right-4 z-50 transition-colors duration-300 bg-white/70 supports-[backdrop-filter]:backdrop-blur-md shadow-none border border-black/5 dark:bg-transparent dark:shadow-none dark:border-gray-500 rounded-2xl">
      <div className="max-w-7xl mx-auto px-6 md:px-8 rounded-xl transition-colors duration-300 dark:bg-transparent relative">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Logo width={120} height={40} className="transition-all duration-300 hover:scale-105" />
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <AppleButton 
              as={Link}
              to="/login" 
              variant="ghost"
              size="sm"
            >
              Login
            </AppleButton>
            <AppleButton 
              as={Link}
              to="/cadastro"
              variant="primary"
              size="sm"
            >
              Começar Agora
            </AppleButton>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <AppleButton 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              variant="ghost"
              size="sm"
              className="p-2"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </AppleButton>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border mt-4 theme-transition">
            <div className="flex flex-col space-y-3">
              <AppleButton 
                as={Link}
                to="/login"
                variant="ghost"
                size="sm"
                className="w-full justify-start"
              >
                Login
              </AppleButton>
              <AppleButton 
                as={Link}
                to="/cadastro"
                variant="primary"
                size="sm"
                className="w-full"
              >
                Começar Agora
              </AppleButton>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;


import { useState, useEffect } from 'react';
import { AppleButton } from '@/components/ui/apple-button';
import { X, Menu } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Link } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';
import logoDark from '@/assets/logo-dark.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const { theme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    console.log('🎨 Theme changed in Header:', theme);
  }, [theme]);

  return (
    <header className="fixed top-4 left-4 right-4 z-50 transition-colors duration-300 bg-white/70 supports-[backdrop-filter]:backdrop-blur-md shadow-none border border-black/5 dark:bg-transparent dark:shadow-none dark:border-gray-500 rounded-2xl">
      <div className="max-w-7xl mx-auto px-6 md:px-8 rounded-xl transition-colors duration-300 dark:bg-transparent relative">
        {/* Decorative image in left corner - responsive to theme */}
        <div className="absolute left-6 top-2 w-10 h-10">
          {/* Dark mode image */}
          <img 
            key={`logo-dark-${theme}`}
            src={logoDark} 
            alt="Decorative element dark" 
            className={`absolute left-0 top-0 w-10 h-10 object-contain transition-opacity duration-500 ease-in-out ${
              theme === 'dark' ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => console.log('✅ Dark logo loaded')}
            onError={(e) => console.error('❌ Dark logo error:', e)}
          />
          {/* Light mode image */}
          <img 
            key={`logo-light-${theme}`}
            src="/lovable-uploads/7941e5b3-cadc-4cba-ad71-21d8d88f9e7e.png" 
            alt="Decorative element light" 
            className={`absolute left-0 top-0 w-10 h-10 object-contain transition-opacity duration-500 ease-in-out ${
              theme === 'light' ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => console.log('✅ Light logo loaded')}
            onError={(e) => console.error('❌ Light logo error:', e)}
          />
        </div>
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center ml-10">
            <Logo className="transition-all duration-300 hover:scale-105" />
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

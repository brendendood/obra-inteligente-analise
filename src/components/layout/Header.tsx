
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Menu } from 'lucide-react';
import { UnifiedLogo } from '@/components/ui/UnifiedLogo';
import ThemeToggle from '@/components/ui/ThemeToggle';
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
    <header className={`fixed top-4 left-4 right-4 z-50 transition-all duration-300 theme-transition ${
      scrollY > 50 
        ? 'bg-card/95 backdrop-blur-xl border border-border shadow-lg shadow-primary/5' 
        : 'bg-card/90 backdrop-blur-md border border-border/50'
    } rounded-2xl`}>
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <UnifiedLogo size="md" theme="auto" priority className="transition-all duration-300 hover:scale-105" />
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="sm"
              className="text-sm font-medium text-muted-foreground hover:text-foreground theme-transition"
              asChild
            >
              <Link to="/login">Login</Link>
            </Button>
            <Button 
              size="sm" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200"
              asChild
            >
              <Link to="/signup">
                Começar Agora
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="transition-all duration-200 hover:bg-muted p-2 rounded-lg theme-transition"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border mt-4 theme-transition">
            <div className="flex flex-col space-y-3">
              <Button 
                variant="ghost" 
                size="sm"
                className="justify-start text-sm font-medium text-muted-foreground hover:text-foreground theme-transition"
                asChild
              >
                <Link to="/login">Login</Link>
              </Button>
              <Button 
                size="sm" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground justify-start transition-all duration-200"
                asChild
              >
                <Link to="/signup">
                  Começar Agora
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

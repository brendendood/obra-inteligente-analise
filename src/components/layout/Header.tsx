
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Menu } from 'lucide-react';
import { UnifiedLogo } from '@/components/ui/UnifiedLogo';
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
    <header className={`fixed top-4 left-4 right-4 z-50 transition-all duration-300 ${
      scrollY > 50 
        ? 'bg-white/95 backdrop-blur-xl border border-gray-200 shadow-lg' 
        : 'bg-white/90 backdrop-blur-md border border-gray-100'
    } rounded-2xl`}>
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <UnifiedLogo size="md" theme="auto" priority className="transition-all duration-300 hover:scale-105" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Brand & Content Protection
            </Link>
            <Link to="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Monitoring
            </Link>
            <Link to="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Anti-Theft Tools
            </Link>
            <Link to="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              DMCA Services
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
              asChild
            >
              <Link to="/login">Login</Link>
            </Button>
            <Button 
              size="sm" 
              className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 text-sm font-medium rounded-lg"
              asChild
            >
              <Link to="/cadastro">
                📊 Analisar Projeto Grátis
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="transition-all duration-200 hover:bg-gray-50 p-2 rounded-lg"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 mt-4">
            <nav className="flex flex-col space-y-4">
              <Link to="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Brand & Content Protection
              </Link>
              <Link to="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Monitoring
              </Link>
              <Link to="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Anti-Theft Tools
              </Link>
              <Link to="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                DMCA Services
              </Link>
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-100">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="justify-start text-sm font-medium text-gray-600 hover:text-gray-900"
                  asChild
                >
                  <Link to="/login">Login</Link>
                </Button>
                <Button 
                  size="sm" 
                  className="bg-slate-900 hover:bg-slate-800 text-white justify-start"
                  asChild
                >
                  <Link to="/cadastro">
                    📊 Analisar Projeto Grátis
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

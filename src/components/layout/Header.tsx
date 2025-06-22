
import { Button } from '@/components/ui/button';
import { FileText, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              ArqFlow.IA
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/#funcionalidades" className="text-slate-600 hover:text-blue-600 transition-colors">
              Funcionalidades
            </Link>
            <Link to="/#precos" className="text-slate-600 hover:text-blue-600 transition-colors">
              Preços
            </Link>
            <a href="mailto:suporte@arqflow.app" className="text-slate-600 hover:text-blue-600 transition-colors">
              Suporte
            </a>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/painel">
                  <Button variant="ghost" className="text-slate-600">
                    Painel
                  </Button>
                </Link>
                <span className="text-sm text-slate-600">
                  {user?.email?.split('@')[0]}
                </span>
                <Button onClick={handleSignOut} variant="outline" size="sm">
                  Sair
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-slate-600">
                    Entrar
                  </Button>
                </Link>
                <Link to="/cadastro">
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    Criar Conta
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200">
            <div className="flex flex-col space-y-4">
              <Link to="/#funcionalidades" className="text-slate-600 hover:text-blue-600">
                Funcionalidades
              </Link>
              <Link to="/#precos" className="text-slate-600 hover:text-blue-600">
                Preços
              </Link>
              <a href="mailto:suporte@arqflow.app" className="text-slate-600 hover:text-blue-600">
                Suporte
              </a>
              {isAuthenticated ? (
                <div className="flex flex-col space-y-2">
                  <Link to="/painel">
                    <Button variant="ghost" className="w-full justify-start">
                      Painel
                    </Button>
                  </Link>
                  <Button onClick={handleSignOut} variant="outline" className="w-full">
                    Sair
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link to="/login">
                    <Button variant="ghost" className="w-full">
                      Entrar
                    </Button>
                  </Link>
                  <Link to="/cadastro">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">
                      Criar Conta
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

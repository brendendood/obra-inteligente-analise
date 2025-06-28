import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Home, Upload, MessageSquare, LogOut, User, FolderOpen, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    isAuthenticated,
    user
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    toast
  } = useToast();
  const handleLogout = async () => {
    try {
      const {
        error
      } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: "👋 Logout realizado",
        description: "Você foi desconectado com sucesso."
      });
      navigate('/');
    } catch (error) {
      console.error('Erro no logout:', error);
      toast({
        title: "❌ Erro no logout",
        description: "Não foi possível fazer logout.",
        variant: "destructive"
      });
    }
  };
  const navigationItems = [{
    name: 'Dashboard',
    path: '/painel',
    icon: Home
  }, {
    name: 'Projetos',
    path: '/projetos',
    icon: FolderOpen
  }, {
    name: 'Upload',
    path: '/upload',
    icon: Upload
  }, {
    name: 'Assistente',
    path: '/assistant',
    icon: MessageSquare
  }];
  const isActivePath = (path: string) => {
    return location.pathname === path;
  };
  return <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-slate-200 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo MadenAI */}
          <div className="flex items-center cursor-pointer group transition-all duration-200 hover:scale-105" onClick={() => navigate(isAuthenticated ? '/painel' : '/')}>
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2.5 rounded-xl mr-3 shadow-lg group-hover:shadow-xl transition-all duration-200">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              MadenAI
            </span>
          </div>

          {/* Desktop Navigation */}
          {isAuthenticated && <nav className="hidden md:flex space-x-1">
              {navigationItems.map(item => {
            const Icon = item.icon;
            return;
          })}
            </nav>}

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? <>
                <div className="flex items-center space-x-2 text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
                  <User className="h-4 w-4" />
                  <span className="max-w-32 truncate">
                    {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                  </span>
                </div>
                <Button variant="outline" onClick={handleLogout} className="flex items-center space-x-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200">
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </Button>
              </> : <div className="flex items-center space-x-3">
                <Button variant="outline" onClick={() => navigate('/login')} className="transition-all duration-200 hover:bg-slate-50">
                  Entrar
                </Button>
                <Button onClick={() => navigate('/cadastro')} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200">
                  Cadastrar
                </Button>
              </div>}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)} className="transition-all duration-200 hover:bg-slate-50">
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu com animação */}
        {isMenuOpen && <div className="md:hidden border-t border-slate-200 py-4 animate-fade-in">
            <div className="space-y-2">
              {isAuthenticated && navigationItems.map(item => {
            const Icon = item.icon;
            return <Button key={item.name} variant={isActivePath(item.path) ? "default" : "ghost"} onClick={() => {
              navigate(item.path);
              setIsMenuOpen(false);
            }} className={`w-full justify-start flex items-center space-x-2 transition-all duration-200 ${isActivePath(item.path) ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Button>;
          })}
              
              {isAuthenticated ? <>
                  <div className="px-3 py-2 text-sm text-slate-600 border-t border-slate-200 mt-2 pt-4 bg-slate-50 rounded-lg">
                    {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                  </div>
                  <Button variant="outline" onClick={() => {
              handleLogout();
              setIsMenuOpen(false);
            }} className="w-full justify-start hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </Button>
                </> : <div className="space-y-2 pt-2 border-t border-slate-200">
                  <Button variant="outline" onClick={() => {
              navigate('/login');
              setIsMenuOpen(false);
            }} className="w-full justify-start transition-all duration-200">
                    Entrar
                  </Button>
                  <Button onClick={() => {
              navigate('/cadastro');
              setIsMenuOpen(false);
            }} className="w-full justify-start bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200">
                    Cadastrar
                  </Button>
                </div>}
            </div>
          </div>}
      </div>
    </header>;
};
export default Header;
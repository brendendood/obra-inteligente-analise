
import { useNavigate, useLocation } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const HeaderLogo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const handleLogoClick = () => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    // Navegação contextual para usuários autenticados
    if (location.pathname.startsWith('/admin-panel')) {
      navigate('/admin-panel');
    } else {
      navigate('/painel');
    }
  };

  return (
    <div 
      className="flex items-center cursor-pointer group transition-all duration-200 hover:scale-105" 
      onClick={handleLogoClick}
    >
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2.5 rounded-xl mr-3 shadow-lg group-hover:shadow-xl transition-all duration-200">
        <Zap className="w-6 h-6 text-white" />
      </div>
      <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
        MadenAI
      </span>
    </div>
  );
};

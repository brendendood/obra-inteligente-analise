
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Upload, 
  Calculator, 
  Calendar, 
  MessageSquare, 
  FileText, 
  Settings,
  Shield
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const SidebarNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const mainNavItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      path: '/dashboard',
      description: 'Visão geral dos seus projetos'
    },
    { 
      icon: FolderOpen, 
      label: 'Projetos', 
      path: '/projetos',
      description: 'Gerencie todos os seus projetos'
    },
    { 
      icon: Upload, 
      label: 'Upload', 
      path: '/upload',
      description: 'Faça upload de novos projetos'
    },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Navegação Principal */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <div className="mb-4">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Principal
          </h3>
        </div>
        
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Button
              key={item.path}
              variant="ghost"
              className={`w-full justify-start h-auto p-3 rounded-md ${
                active 
                  ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
              onClick={() => navigate(item.path)}
            >
              <div className="flex items-center space-x-3 w-full">
                <Icon className={`h-5 w-5 flex-shrink-0 ${
                  active ? 'text-blue-600' : 'text-gray-500'
                }`} />
                <div className="flex-1 text-left">
                  <div className={`text-sm font-medium ${
                    active ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    {item.label}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {item.description}
                  </div>
                </div>
              </div>
            </Button>
          );
        })}

        {/* Divider */}
        <div className="my-6 border-t border-gray-200"></div>

        {/* Ferramentas Gerais */}
        <div className="mb-4">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Ferramentas
          </h3>
        </div>
        
        {[
          { icon: Calculator, label: 'Orçamento', path: '/orcamento', description: 'Orçamentos automáticos' },
          { icon: Calendar, label: 'Cronograma', path: '/cronograma', description: 'Planejamento de obras' },
          { icon: MessageSquare, label: 'Assistente IA', path: '/assistente', description: 'Chat inteligente' },
          { icon: FileText, label: 'Documentos', path: '/documentos', description: 'Relatórios e plantas' }
        ].map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Button
              key={item.path}
              variant="ghost"
              className={`w-full justify-start h-auto p-3 rounded-md ${
                active 
                  ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
              onClick={() => navigate(item.path)}
            >
              <div className="flex items-center space-x-3 w-full">
                <Icon className={`h-5 w-5 flex-shrink-0 ${
                  active ? 'text-blue-600' : 'text-gray-500'
                }`} />
                <div className="flex-1 text-left">
                  <div className={`text-sm font-medium ${
                    active ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    {item.label}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {item.description}
                  </div>
                </div>
              </div>
            </Button>
          );
        })}
      </nav>

      {/* Admin Access */}
      {isAdmin && (
        <div className="px-3 py-4 border-t border-gray-200">
          <Button
            variant="ghost" 
            className={`w-full justify-start h-auto p-3 rounded-md ${
              location.pathname.startsWith('/admin')
                ? 'bg-red-50 text-red-700 hover:bg-red-100'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`}
            onClick={() => navigate('/admin')}
          >
            <div className="flex items-center space-x-3 w-full">
              <Shield className={`h-5 w-5 flex-shrink-0 ${
                location.pathname.startsWith('/admin') ? 'text-red-600' : 'text-gray-500'
              }`} />
              <div className="flex-1 text-left">
                <div className={`text-sm font-medium ${
                  location.pathname.startsWith('/admin') ? 'text-red-900' : 'text-gray-900'
                }`}>
                  Admin
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  Painel administrativo
                </div>
              </div>
            </div>
          </Button>
        </div>
      )}

      {/* Configurações */}
      <div className="px-3 py-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full justify-start h-auto p-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
          onClick={() => navigate('/configuracoes')}
        >
          <div className="flex items-center space-x-3 w-full">
            <Settings className="h-5 w-5 flex-shrink-0 text-gray-500" />
            <div className="flex-1 text-left">
              <div className="text-sm font-medium text-gray-900">
                Configurações
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                Preferências e conta
              </div>
            </div>
          </div>
        </Button>
      </div>
    </div>
  );
};

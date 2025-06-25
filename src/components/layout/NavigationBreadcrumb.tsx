
import { ChevronRight, Home } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface NavigationBreadcrumbProps {
  items?: BreadcrumbItem[];
  projectName?: string;
}

export const NavigationBreadcrumb = ({ items = [], projectName }: NavigationBreadcrumbProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Função para navegar contextualmente
  const handleNavigation = (path?: string) => {
    if (!path) return;
    
    // Se estamos em uma página de projeto, navegar dentro do contexto
    if (location.pathname.includes('/obra/')) {
      const projectId = location.pathname.split('/obra/')[1];
      if (path === '/painel' && projectId) {
        navigate(`/obra/${projectId}`);
        return;
      }
    }
    
    navigate(path);
  };

  const defaultItems: BreadcrumbItem[] = [
    { label: 'Painel', path: '/painel' }
  ];

  // Determinar items baseado na rota atual
  let breadcrumbItems = [...defaultItems];

  if (location.pathname.includes('/obra/')) {
    const projectId = location.pathname.split('/obra/')[1];
    breadcrumbItems.push(
      { label: 'Obras', path: '/obras' },
      { label: projectName || 'Projeto', path: `/obra/${projectId}` }
    );

    // Adicionar item específico da página atual
    if (location.pathname.includes('/assistant')) {
      breadcrumbItems.push({ label: 'Assistente IA' });
    } else if (location.pathname.includes('/budget')) {
      breadcrumbItems.push({ label: 'Orçamento' });
    } else if (location.pathname.includes('/schedule')) {
      breadcrumbItems.push({ label: 'Cronograma' });
    } else if (location.pathname.includes('/documents')) {
      breadcrumbItems.push({ label: 'Documentos' });
    }
  } else if (location.pathname === '/obras') {
    breadcrumbItems.push({ label: 'Obras' });
  } else if (location.pathname === '/upload') {
    breadcrumbItems.push({ label: 'Nova Obra' });
  } else if (location.pathname === '/assistant') {
    breadcrumbItems.push({ label: 'Assistente IA' });
  } else if (location.pathname === '/budget') {
    breadcrumbItems.push({ label: 'Orçamento' });
  } else if (location.pathname === '/schedule') {
    breadcrumbItems.push({ label: 'Cronograma' });
  } else if (location.pathname === '/documents') {
    breadcrumbItems.push({ label: 'Documentos' });
  }

  // Usar items customizados se fornecidos
  if (items.length > 0) {
    breadcrumbItems = items;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <Home className="h-4 w-4" />
      {breadcrumbItems.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400" />}
          {item.path && index < breadcrumbItems.length - 1 ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-sm text-gray-600 hover:text-blue-600"
              onClick={() => handleNavigation(item.path)}
            >
              {item.label}
            </Button>
          ) : (
            <span className={index === breadcrumbItems.length - 1 ? 'text-gray-900 font-medium' : 'text-gray-600'}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
};

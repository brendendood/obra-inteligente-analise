
import { ChevronRight, Home } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useContextualNavigation } from '@/hooks/useContextualNavigation';
import { Button } from '@/components/ui/button';

interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export const EnhancedBreadcrumb = () => {
  const location = useLocation();
  const { navigateContextual } = useContextualNavigation();

  const getBreadcrumbItems = (): BreadcrumbItem[] => {
    const path = location.pathname;
    const items: BreadcrumbItem[] = [
      { label: 'Dashboard', path: '/painel', icon: Home }
    ];

    if (path.startsWith('/projetos')) {
      items.push({ label: 'Projetos', path: '/projetos' });
    }

    if (path.startsWith('/projeto/')) {
      const projectId = path.split('/')[2];
      items.push({ label: 'Projetos', path: '/projetos' });
      items.push({ label: 'Projeto', path: `/projeto/${projectId}` });
      
      if (path.includes('/orcamento')) {
        items.push({ label: 'Orçamento', path: `${path}` });
      } else if (path.includes('/cronograma')) {
        items.push({ label: 'Cronograma', path: `${path}` });
      } else if (path.includes('/assistente')) {
        items.push({ label: 'Assistente', path: `${path}` });
      } else if (path.includes('/documentos')) {
        items.push({ label: 'Documentos', path: `${path}` });
      }
    }

    if (path === '/upload') {
      items.push({ label: 'Novo Projeto', path: '/upload' });
    }

    return items;
  };

  const items = getBreadcrumbItems();

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const Icon = item.icon;
        
        return (
          <div key={item.path} className="flex items-center space-x-2">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-gray-400" />
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => !isLast && navigateContextual(item.path)}
              className={`h-auto p-1 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                isLast 
                  ? 'text-blue-600 font-medium cursor-default' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
              disabled={isLast}
            >
              <div className="flex items-center space-x-1">
                {Icon && <Icon className="h-4 w-4" />}
                <span>{item.label}</span>
              </div>
            </Button>
          </div>
        );
      })}
    </nav>
  );
};

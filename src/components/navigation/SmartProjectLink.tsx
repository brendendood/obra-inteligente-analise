
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useOptimizedProjectNavigation } from '@/hooks/useOptimizedProjectNavigation';
import { cn } from '@/lib/utils';

interface SmartProjectLinkProps {
  projectId: string;
  section?: 'orcamento' | 'cronograma' | 'assistente' | 'documentos';
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const SmartProjectLink = ({ 
  projectId, 
  section, 
  children, 
  className,
  onClick 
}: SmartProjectLinkProps) => {
  const { navigateToProject } = useOptimizedProjectNavigation();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick?.();
    navigateToProject(projectId, section);
  };

  // Gerar URL correta
  const getUrl = () => {
    const basePath = `/projeto/${projectId}`;
    
    if (!section) return basePath;
    
    const sectionRoutes = {
      orcamento: `${basePath}/orcamento`,
      cronograma: `${basePath}/cronograma`,
      assistente: `/ia/${projectId}`,
      documentos: `${basePath}/documentos`
    };
    
    return sectionRoutes[section];
  };

  return (
    <Link
      to={getUrl()}
      onClick={handleClick}
      className={cn(
        "transition-colors hover:text-blue-600 focus:text-blue-600",
        className
      )}
    >
      {children}
    </Link>
  );
};

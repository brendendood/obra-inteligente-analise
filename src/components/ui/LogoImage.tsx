import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface LogoImageProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  clickable?: boolean;
  className?: string;
  alt?: string;
}

export const LogoImage = ({ 
  size = 'md', 
  clickable = true, 
  className, 
  alt = 'MadenAI' 
}: LogoImageProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12',
    xl: 'h-16'
  };

  const handleClick = () => {
    if (!clickable) return;

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

  // Fallback para texto se imagem não carregar
  const LogoFallback = () => (
    <div 
      className={cn(
        sizeClasses[size],
        'flex items-center justify-center font-bold text-blue-600',
        clickable && 'cursor-pointer transition-all duration-200 hover:scale-105',
        className
      )}
      onClick={handleClick}
    >
      <span className="text-xl font-bold">MadenAI</span>
    </div>
  );

  // Nova logo fornecida pelo usuário
  const logoSrc = `/lovable-uploads/9c18fc10-48d2-4c03-9f33-5ae3b5260cd3.png`;

  return (
    <div className="flex items-center">
      <img
        src={logoSrc}
        alt={alt}
        className={cn(
          sizeClasses[size],
          'object-contain',
          clickable && 'cursor-pointer transition-all duration-200 hover:scale-105',
          className
        )}
        onClick={handleClick}
        onError={(e) => {
          console.warn('Logo falhou ao carregar, usando fallback');
          // Se a imagem falhar, substitui por fallback melhorado
          const fallback = document.createElement('div');
          fallback.className = cn(
            sizeClasses[size],
            'flex items-center justify-center font-bold bg-blue-600 text-white rounded-lg px-3',
            clickable && 'cursor-pointer transition-all duration-200 hover:scale-105',
            className
          );
          fallback.innerHTML = '<span class="text-xl font-bold">MadenAI</span>';
          if (clickable) fallback.onclick = handleClick;
          e.currentTarget.parentNode?.replaceChild(fallback, e.currentTarget);
        }}
        loading="eager"
      />
    </div>
  );
};
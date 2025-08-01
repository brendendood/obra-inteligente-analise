import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface LogoImageProps {
  variant?: 'full' | 'white' | 'favicon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  clickable?: boolean;
  className?: string;
  alt?: string;
}

export const LogoImage = ({ 
  variant = 'full', 
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
        'flex items-center justify-center font-bold text-primary',
        variant === 'white' ? 'text-white' : 'text-blue-600',
        clickable && 'cursor-pointer transition-all duration-200 hover:scale-105',
        className
      )}
      onClick={handleClick}
    >
      <span className="text-xl font-bold">MadenAI</span>
    </div>
  );

  // Adiciona timestamp para evitar cache
  const logoSrc = `/lovable-uploads/55510b18-df92-4123-b5ff-483f8ee93d82.png?v=${Date.now()}`;

  return (
    <div className="flex items-center">
      <img
        src={logoSrc}
        alt={alt}
        className={cn(
          sizeClasses[size],
          'object-contain',
          // Remove filtros que podem distorcer a logo
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
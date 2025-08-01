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

  return (
    <div className="flex items-center">
      <img
        src="/lovable-uploads/d5abf474-193e-414e-adda-903502b13c0a.png"
        alt={alt}
        className={cn(
          sizeClasses[size],
          'object-contain',
          variant === 'white' && 'brightness-0 invert',
          clickable && 'cursor-pointer transition-all duration-200 hover:scale-105',
          className
        )}
        onClick={handleClick}
        onError={(e) => {
          // Se a imagem falhar, substitui por fallback
          const fallback = document.createElement('div');
          fallback.className = cn(
            sizeClasses[size],
            'flex items-center justify-center font-bold',
            variant === 'white' ? 'text-white' : 'text-blue-600',
            clickable && 'cursor-pointer transition-all duration-200 hover:scale-105',
            className
          );
          fallback.innerHTML = '<span class="text-xl font-bold">MadenAI</span>';
          fallback.onclick = handleClick;
          e.currentTarget.parentNode?.replaceChild(fallback, e.currentTarget);
        }}
      />
    </div>
  );
};
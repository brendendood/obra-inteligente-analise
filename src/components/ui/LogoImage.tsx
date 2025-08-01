
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

interface LogoImageProps {
  variant?: 'full' | 'icon' | 'favicon';
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
  const [imageError, setImageError] = useState(false);

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

  const handleImageError = () => {
    console.warn('Logo image failed to load, showing fallback');
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  // URL da nova logo anexada pelo usuário
  const logoSrc = variant === 'favicon' 
    ? `/lovable-uploads/50a67dd2-626f-4917-818e-46cd6f114030.png`
    : `/lovable-uploads/ec965021-ee37-4f71-9b28-160fa8724995.png`;

  // Fallback visual se a imagem não carregar
  if (imageError) {
    return (
      <div 
        className={cn(
          sizeClasses[size],
          'flex items-center justify-center bg-primary text-primary-foreground font-bold rounded',
          clickable && 'cursor-pointer transition-all duration-200 hover:scale-105',
          className
        )}
        onClick={handleClick}
      >
        <span className="text-xs">MadenAI</span>
      </div>
    );
  }

  return (
    <img
      src={logoSrc}
      alt={alt}
      loading="eager"
      decoding="async"
      onError={handleImageError}
      onLoad={handleImageLoad}
      className={cn(
        sizeClasses[size],
        'object-contain',
        clickable && 'cursor-pointer transition-all duration-200 hover:scale-105',
        className
      )}
      onClick={handleClick}
    />
  );
};

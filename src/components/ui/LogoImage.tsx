import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

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

  const logoSrc = variant === 'favicon' 
    ? '/lovable-uploads/50a67dd2-626f-4917-818e-46cd6f114030.png'
    : '/lovable-uploads/2fae2af7-8158-4c17-b123-0e8ae95386be.png';

  return (
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
    />
  );
};
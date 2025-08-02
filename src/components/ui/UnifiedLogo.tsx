import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';

interface UnifiedLogoProps {
  variant?: 'full' | 'icon' | 'favicon';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  clickable?: boolean;
  className?: string;
  alt?: string;
  theme?: 'auto' | 'light' | 'dark';
  loading?: boolean;
}

export const UnifiedLogo = ({ 
  variant = 'full', 
  size = 'md', 
  clickable = true, 
  className, 
  alt = 'MadenAI',
  theme = 'auto',
  loading = false
}: UnifiedLogoProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [imageError, setImageError] = useState(false);
  const [logoTheme, setLogoTheme] = useState<'light' | 'dark'>('dark');

  const sizeClasses = {
    xs: 'h-4',
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12',
    xl: 'h-16',
    '2xl': 'h-20'
  };

  // Detect background theme
  useEffect(() => {
    if (theme !== 'auto') {
      setLogoTheme(theme);
      return;
    }

    // Auto-detect based on context or system theme
    const isDarkMode = document.documentElement.classList.contains('dark') ||
                      window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Check if parent has dark background
    const parentElement = document.querySelector('[data-logo-background]');
    if (parentElement) {
      const bgColor = window.getComputedStyle(parentElement).backgroundColor;
      const isDarkBg = bgColor.includes('rgb') && 
                      bgColor.match(/\d+/g)?.slice(0, 3)
                        .reduce((sum, val) => sum + parseInt(val), 0) < 384; // 128*3
      setLogoTheme(isDarkBg ? 'light' : 'dark');
    } else {
      setLogoTheme(isDarkMode ? 'light' : 'dark');
    }
  }, [theme]);

  const handleClick = () => {
    if (!clickable || loading) return;

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

  // Logo source - MadenAI logo (preto + azul) funciona bem em fundos claros e escuros
  const logoSrc = `/lovable-uploads/e1676e4f-fd0b-4426-8c49-a197872cae07.png?v=${Date.now()}`; // Cache busting

  // Loading state
  if (loading) {
    return (
      <div 
        className={cn(
          sizeClasses[size],
          'animate-pulse bg-muted rounded flex items-center justify-center',
          className
        )}
      >
        {/* Loading state without text */}
      </div>
    );
  }

  // Fallback robusto com retry automático
  if (imageError) {
    return (
      <div 
        className={cn(
          sizeClasses[size],
          'flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold rounded-lg shadow-lg',
          clickable && 'cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-xl',
          className
        )}
        onClick={handleClick}
        role={clickable ? 'button' : 'img'}
        aria-label={alt}
        tabIndex={clickable ? 0 : -1}
        onKeyDown={(e) => {
          if (clickable && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        <span className={cn(
          'font-bold tracking-tight',
          size === 'xs' && 'text-xs',
          size === 'sm' && 'text-sm',
          size === 'md' && 'text-base',
          size === 'lg' && 'text-lg',
          size === 'xl' && 'text-xl',
          size === '2xl' && 'text-2xl'
        )}>
          M
        </span>
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
        'object-contain transition-all duration-200',
        clickable && 'cursor-pointer hover:scale-105',
        className
      )}
      onClick={handleClick}
      role={clickable ? 'button' : 'img'}
      tabIndex={clickable ? 0 : -1}
      onKeyDown={(e) => {
        if (clickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleClick();
        }
      }}
    />
  );
};
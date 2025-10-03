import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useState, useMemo, useCallback } from 'react';
import logoDark from '@/assets/logo-dark.svg';
import logoLight from '@/assets/logo-light.svg';

interface UnifiedLogoProps {
  variant?: 'full' | 'icon' | 'favicon';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  clickable?: boolean;
  className?: string;
  alt?: string;
  theme?: 'auto' | 'light' | 'dark';
  loading?: boolean;
  priority?: boolean;
}

export const UnifiedLogo = ({ 
  variant = 'full', 
  size = 'md', 
  clickable = true, 
  className, 
  alt = 'MadeAI',
  theme = 'dark', // Default to dark for better performance
  loading = false,
  priority = false
}: UnifiedLogoProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme: currentTheme } = useTheme();
  // Only use auth hook if clickable (performance optimization)
  const { isAuthenticated } = clickable ? useAuth() : { isAuthenticated: false };
  const [imageError, setImageError] = useState(false);

  // Memoize size classes for better performance
  const sizeClasses = useMemo(() => ({
    xs: 'h-4',
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12',
    xl: 'h-16',
    '2xl': 'h-20',
    '3xl': 'h-24'
  }), []);

  // Optimized click handler with useCallback
  const handleClick = useCallback(() => {
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
  }, [clickable, loading, isAuthenticated, navigate, location.pathname]);

  // Optimized error handler
  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  // Optimized load handler
  const handleImageLoad = useCallback(() => {
    setImageError(false);
  }, []);

  // Logo da MadeAI - responsive ao tema atual
  const logoSrc = currentTheme === 'dark' ? logoDark : logoLight;

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

  // Fast SVG fallback for errors
  if (imageError) {
    return (
      <svg
        className={cn(
          sizeClasses[size],
          'object-contain transition-all duration-200',
          clickable && 'cursor-pointer hover:scale-105',
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
        viewBox="0 0 100 24"
        fill="none"
      >
        <text x="50" y="12" textAnchor="middle" dominantBaseline="middle" className="text-xs font-bold fill-primary">
          MadeAI
        </text>
      </svg>
    );
  }

  return (
    <img
      src={logoSrc}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      onError={handleImageError}
      onLoad={handleImageLoad}
      className={cn(
        sizeClasses[size],
        'object-contain transition-opacity duration-300',
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
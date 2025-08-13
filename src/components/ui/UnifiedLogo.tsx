import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';

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
  theme = 'auto',
  loading = false,
  priority = false
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
    '2xl': 'h-20',
    '3xl': 'h-24'
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

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('[UnifiedLogo] ERRO: Logo falhou ao carregar!');
    console.error('[UnifiedLogo] URL tentada:', e.currentTarget.src);
    console.error('[UnifiedLogo] Erro completo:', e);
    setImageError(true);
  };

  const handleImageLoad = () => {
    console.log('[UnifiedLogo] ✅ SUCESSO: Logo carregada!');
    setImageError(false);
  };

  // Logo da MadeAI - usando a nova imagem enviada pelo usuário
  const logoSrc = `/lovable-uploads/71b28b41-8880-485d-97bc-36bda534c54e.png`;
  
  // Debug: Log se a imagem está carregando
  useEffect(() => {
    console.log('[UnifiedLogo] Tentando carregar logo:', logoSrc);
  }, [logoSrc]);

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

  // Fallback temporário para DEBUG - mostra texto para identificar o problema
  if (imageError) {
    return (
      <div 
        className={cn(
          sizeClasses[size],
          'flex items-center justify-center bg-red-100 border border-red-300 rounded text-red-700 text-xs font-bold',
          clickable && 'cursor-pointer transition-all duration-200 hover:scale-105',
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
        ERRO LOGO
      </div>
    );
  }

  return (
    <img
      src={logoSrc}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
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
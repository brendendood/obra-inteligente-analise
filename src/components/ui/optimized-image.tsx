import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  fallback?: React.ReactNode;
  priority?: boolean;
  sizes?: string;
  quality?: number;
}

export const OptimizedImage = React.forwardRef<HTMLImageElement, OptimizedImageProps>(
  ({ src, alt, className, fallback, priority = false, sizes, quality = 85, ...props }, ref) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isInView, setIsInView] = useState(priority);
    const imgRef = useRef<HTMLImageElement>(null);

    // Intersection Observer para lazy loading
    useEffect(() => {
      if (priority) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true);
              observer.disconnect();
            }
          });
        },
        { rootMargin: '50px' }
      );

      if (imgRef.current) {
        observer.observe(imgRef.current);
      }

      return () => observer.disconnect();
    }, [priority]);

    // Reset states when src changes
    useEffect(() => {
      setIsLoaded(false);
      setHasError(false);
    }, [src]);

    const handleLoad = () => {
      setIsLoaded(true);
      setHasError(false);
    };

    const handleError = () => {
      setHasError(true);
      setIsLoaded(false);
    };

    // Optimizar formato da imagem baseado no suporte do browser
    const getOptimizedSrc = (originalSrc: string) => {
      if (!originalSrc) return originalSrc;
      
      // Se já é WebP, retorna como está
      if (originalSrc.includes('.webp')) return originalSrc;
      
      // Para URLs externas, retorna como está
      if (originalSrc.startsWith('http')) return originalSrc;
      
      // Para imagens locais, tenta converter para WebP
      const supportsWebP = document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;
      
      if (supportsWebP && (originalSrc.includes('.jpg') || originalSrc.includes('.jpeg') || originalSrc.includes('.png'))) {
        return originalSrc.replace(/\.(jpg|jpeg|png)$/, '.webp');
      }
      
      return originalSrc;
    };

    if (hasError && fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className={cn("relative overflow-hidden", className)}>
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
        )}
        
        <img
          ref={imgRef}
          src={isInView ? getOptimizedSrc(src) : undefined}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          sizes={sizes}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

OptimizedImage.displayName = 'OptimizedImage';
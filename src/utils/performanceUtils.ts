// Utilitários para melhorar performance

// Debounce para evitar múltiplas chamadas
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle para limitar frequência de execução
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Preload de recursos críticos
export const preloadResource = (href: string, as: string) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = as;
  link.href = href;
  document.head.appendChild(link);
};

// Lazy loading para componentes pesados
export const createLazyComponent = (importFunc: () => Promise<any>) => {
  return importFunc;
};

// Performance monitoring
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
};

// Memory optimization
export const memoizeWithExpiry = <T>(
  fn: (...args: any[]) => T,
  ttl: number = 5 * 60 * 1000
) => {
  const cache = new Map<string, { value: T; expiry: number }>();
  
  return (...args: any[]): T => {
    const key = JSON.stringify(args);
    const cached = cache.get(key);
    
    if (cached && cached.expiry > Date.now()) {
      return cached.value;
    }
    
    const result = fn(...args);
    cache.set(key, { value: result, expiry: Date.now() + ttl });
    
    return result;
  };
};

// Intersection Observer para lazy loading
export const createIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };
  
  return new IntersectionObserver(callback, defaultOptions);
};

// Resource hints
export const addResourceHints = () => {
  // DNS prefetch para recursos externos
  const dnsHints = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://mozqijzvtbuwuzgemzsm.supabase.co'
  ];
  
  dnsHints.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = href;
    document.head.appendChild(link);
  });
};

// Service Worker para cache
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered:', registration);
      })
      .catch(error => {
        console.log('SW registration failed:', error);
      });
  }
};

// Image optimization
export const optimizeImage = (src: string, width?: number, quality: number = 85) => {
  // Para imagens do Supabase ou outras CDNs que suportam transformação
  if (src.includes('supabase.co')) {
    const params = new URLSearchParams();
    if (width) params.append('width', width.toString());
    params.append('quality', quality.toString());
    return `${src}?${params.toString()}`;
  }
  
  return src;
};

// Performance metrics
export const reportWebVitals = (onPerfEntry?: (metric: any) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    console.log('Performance metrics would be reported here');
  }
};

// Configurações específicas para domínio personalizado
export const DOMAIN_CONFIG = {
  production: 'arqcloud.com.br',
  staging: 'mozqijzvtbuwuzgemzsm.supabase.co',
  localhost: 'localhost:5173'
};

export const getCurrentDomain = (): string => {
  if (typeof window === 'undefined') return DOMAIN_CONFIG.production;
  
  const hostname = window.location.hostname;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return DOMAIN_CONFIG.localhost;
  }
  
  if (hostname === 'arqcloud.com.br' || hostname === 'www.arqcloud.com.br') {
    return DOMAIN_CONFIG.production;
  }
  
  return DOMAIN_CONFIG.staging;
};

export const getBaseUrl = (): string => {
  const domain = getCurrentDomain();
  const protocol = domain.includes('localhost') ? 'http' : 'https';
  return `${protocol}://${domain}`;
};

export const isCustomDomain = (): boolean => {
  return getCurrentDomain() === DOMAIN_CONFIG.production;
};

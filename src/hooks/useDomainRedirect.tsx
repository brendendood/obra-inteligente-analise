
import { useEffect } from 'react';
import { getCurrentDomain, isCustomDomain } from '@/utils/domainConfig';

export const useDomainRedirect = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const hostname = window.location.hostname;
    const currentDomain = getCurrentDomain();
    
    // Redirecionar www para domínio principal se necessário
    if (hostname === 'www.arqcloud.com.br' && isCustomDomain()) {
      const newUrl = window.location.href.replace('www.arqcloud.com.br', 'arqcloud.com.br');
      window.location.replace(newUrl);
      return;
    }
    
    // Forçar HTTPS em domínio personalizado
    if (isCustomDomain() && window.location.protocol === 'http:') {
      const httpsUrl = window.location.href.replace('http:', 'https:');
      window.location.replace(httpsUrl);
      return;
    }
    
    console.log('🌐 DOMAIN: Domínio atual detectado:', currentDomain);
  }, []);
  
  return {
    currentDomain: getCurrentDomain(),
    isCustomDomain: isCustomDomain()
  };
};

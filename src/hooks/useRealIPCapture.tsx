import { useState, useCallback } from 'react';

interface RealIPResult {
  ip: string | null;
  source: string;
  success: boolean;
  error?: string;
}

/**
 * Hook para capturar o IP real do usuário no frontend
 * Usa múltiplas APIs para garantir precisão
 */
export const useRealIPCapture = () => {
  const [isCapturing, setIsCapturing] = useState(false);

  const captureRealIP = useCallback(async (): Promise<RealIPResult> => {
    setIsCapturing(true);
    
    const ipAPIs = [
      { url: 'https://ipapi.co/ip/', source: 'ipapi.co' },
      { url: 'https://api.ipify.org?format=text', source: 'ipify.org' },
      { url: 'https://icanhazip.com/', source: 'icanhazip.com' },
      { url: 'https://httpbin.org/ip', source: 'httpbin.org', parseJson: true }
    ];

    for (const api of ipAPIs) {
      try {
        console.log(`🌐 Tentando capturar IP via ${api.source}...`);
        
        const response = await fetch(api.url, {
          method: 'GET',
          headers: {
            'Accept': 'text/plain, application/json',
          }
        });

        if (!response.ok) {
          console.warn(`❌ ${api.source} falhou:`, response.status);
          continue;
        }

        let ip: string;
        
        if (api.parseJson) {
          const data = await response.json();
          ip = data.origin?.split(',')[0]?.trim() || data.ip;
        } else {
          ip = (await response.text()).trim();
        }

        // Validar formato do IP
        if (ip && isValidIP(ip)) {
          console.log(`✅ IP real capturado via ${api.source}: ${ip}`);
          setIsCapturing(false);
          return {
            ip,
            source: api.source,
            success: true
          };
        }
      } catch (error) {
        console.warn(`❌ Erro em ${api.source}:`, error);
        continue;
      }
    }

    setIsCapturing(false);
    return {
      ip: null,
      source: 'none',
      success: false,
      error: 'Não foi possível capturar IP real de nenhuma fonte'
    };
  }, []);

  return {
    captureRealIP,
    isCapturing
  };
};

function isValidIP(ip: string): boolean {
  // Validar IPv4
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  
  // Validar IPv6 (básico)
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}
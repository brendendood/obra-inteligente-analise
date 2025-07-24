import { supabase } from '@/integrations/supabase/client';

export interface IPDetectionResult {
  isReturningUser: boolean;
  lastLoginDate?: string;
  userEmail?: string;
}

export const detectUserByIP = async (): Promise<IPDetectionResult> => {
  try {
    // Tentar obter o IP do usuário (fallback para localhost em desenvolvimento)
    const currentIP = await getCurrentUserIP();
    
    if (!currentIP) {
      return { isReturningUser: false };
    }

    // Buscar histórico de login com esse IP e dados do usuário
    const { data: loginHistory, error } = await supabase
      .from('user_login_history')
      .select(`
        user_id,
        login_at
      `)
      .eq('ip_address', currentIP)
      .order('login_at', { ascending: false })
      .limit(1);

    if (error || !loginHistory || loginHistory.length === 0) {
      return { isReturningUser: false };
    }

    const lastLogin = loginHistory[0];
    
    // Buscar dados do usuário separadamente
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('full_name')
      .eq('user_id', lastLogin.user_id)
      .single();
    
    return {
      isReturningUser: true,
      lastLoginDate: lastLogin.login_at,
      userEmail: userProfile?.full_name
    };
  } catch (error) {
    console.error('Erro ao detectar usuário por IP:', error);
    return { isReturningUser: false };
  }
};

const getCurrentUserIP = async (): Promise<string | null> => {
  try {
    // Em desenvolvimento, usar localhost
    if (window.location.hostname === 'localhost') {
      return '127.0.0.1';
    }

    // Tentar obter IP real via serviço externo
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Erro ao obter IP:', error);
    return null;
  }
};

export const getWelcomeMessage = (ipResult: IPDetectionResult): string => {
  if (ipResult.isReturningUser) {
    return 'Olá, bem-vindo de volta! 👋';
  }
  return 'Crie sua conta gratuita para começar';
};
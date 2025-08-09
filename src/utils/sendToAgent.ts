import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Project } from '@/types/project';

interface SendMessageContext {
  user?: User | null;
  project?: Project | null;
}

/**
 * Envia mensagem para o assistente IA via webhook N8N
 */
export const sendToN8N = async (
  message: string, 
  context: SendMessageContext = {}
): Promise<string> => {
  // Preparar payload com contexto rico
  const payload = {
    message: message.trim(),
    user_id: context.user?.id || null,
    timestamp: new Date().toISOString(),
    project_id: context.project?.id || null
  };

  console.log('🚀 Enviando mensagem (via proxy) para N8N:', { message: message.substring(0, 50) + '...', payload });

  try {
    const invoke = supabase.functions.invoke('secure-n8n-proxy', {
      body: { agentType: 'general', payload },
    });

    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 30000));

    const result = (await Promise.race([invoke, timeoutPromise])) as { data: any; error: any };

    if (result?.error) throw result.error;

    const data = result?.data || {};
    const extracted =
      (typeof data?.response === 'string' && data.response) ||
      (typeof data?.raw?.response === 'string' && data.raw.response) ||
      (typeof data?.raw?.text === 'string' && data.raw.text) ||
      '';

    if (!extracted) {
      throw new Error('invalid_response');
    }

    console.log('✅ Resposta recebida do N8N (proxy)');
    return extracted;

  } catch (error: any) {
    console.error('❌ Erro na comunicação com N8N (proxy):', error);

    if (error?.message === 'timeout') {
      throw new Error('timeout');
    }

    throw new Error('network');
  }
};

/**
 * Função principal para enviar mensagens com fallback inteligente
 */
export const sendMessageToAgent = async (
  message: string,
  context: SendMessageContext = {}
): Promise<string> => {
  try {
    // Primeira tentativa: N8N
    const response = await sendToN8N(message, context);
    return response;
    
  } catch (error) {
    console.log('🔄 Primeira tentativa falhou, tentando novamente...');
    
    try {
      // Segunda tentativa: N8N (retry)
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = await sendToN8N(message, context);
      return response;
      
    } catch (retryError) {
      console.error('🆘 Ambas tentativas falharam, usando fallback simulado');
      
      // Mensagem de erro específica baseada no tipo de erro
      if (error.message === 'timeout') {
        return "Houve um tempo limite ao conectar com o assistente de IA. Tente novamente em alguns instantes.";
      }
      
      if (error.message === 'network') {
        return "Houve um erro ao conectar com o assistente de IA. Tente novamente em alguns instantes.";
      }

      if (error.message === 'invalid_response') {
        return "O assistente retornou uma resposta inválida. Tente novamente em instantes.";
      }
      return getSimulatedResponse(message, context);
    }
  }
};

/**
 * Respostas simuladas como fallback
 */
const getSimulatedResponse = (message: string, context: SendMessageContext): string => {
  const lowerMessage = message.toLowerCase();
  const projectName = context.project?.name || 'seu projeto';
  
  // Respostas sobre estruturas
  if (lowerMessage.includes('estrutura') || lowerMessage.includes('concreto') || lowerMessage.includes('aço')) {
    return `Para dimensionamento estrutural no ${projectName}, é fundamental seguir a NBR 6118 (estruturas de concreto) e NBR 8800 (estruturas de aço). Precisa de cálculos específicos para algum elemento?\n\n*Nota: Esta é uma resposta simulada. O assistente especializado está temporariamente indisponível.*`;
  }
  
  // Respostas sobre arquitetura
  if (lowerMessage.includes('projeto') || lowerMessage.includes('planta') || lowerMessage.includes('arquitetura')) {
    return `No desenvolvimento do ${projectName}, sempre priorizo funcionalidade, acessibilidade e conformidade com o código de obras local. Em que posso ajudar?\n\n*Nota: Esta é uma resposta simulada. O assistente especializado está temporariamente indisponível.*`;
  }
  
  // Respostas sobre normas
  if (lowerMessage.includes('norma') || lowerMessage.includes('nbr') || lowerMessage.includes('código')) {
    return `As normas técnicas brasileiras são fundamentais para garantir segurança e qualidade no ${projectName}. Sobre qual NBR específica você gostaria de saber?\n\n*Nota: Esta é uma resposta simulada. O assistente especializado está temporariamente indisponível.*`;
  }
  
  // Respostas gerais
  const responses = [
    `Sou especialista em arquitetura e engenharia civil, com foco no ${projectName}. Como posso ajudar com seu projeto?`,
    `Posso auxiliar com cálculos estruturais, especificações técnicas, normas brasileiras e desenvolvimento do ${projectName}. O que você precisa?`,
    `Estou aqui para esclarecer dúvidas técnicas sobre construção civil relacionadas ao ${projectName}. Qual sua pergunta específica?`,
    `Com minha experiência em projetos como o ${projectName}, posso orientar sobre estruturas, instalações, materiais e normas técnicas. Como posso ajudar?`
  ];
  
  const selectedResponse = responses[Math.floor(Math.random() * responses.length)];
  return `${selectedResponse}\n\n*Nota: Esta é uma resposta simulada. O assistente especializado está temporariamente indisponível.*`;
};

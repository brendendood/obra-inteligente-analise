import { RichAgentContext } from '../agentTypes';

export const getAnalysisFallback = (message: string, context: RichAgentContext): string => {
  const lowerMessage = message.toLowerCase();
  const projectName = context.project_context?.name || 'projeto';
  
  // Respostas sobre análise de documentos
  if (lowerMessage.includes('documento') || lowerMessage.includes('pdf') || lowerMessage.includes('planta')) {
    return `Para análise técnica do ${projectName}, posso extrair dados de plantas, especificações e memoriais. Identifico áreas, materiais, cotas e elementos estruturais automaticamente.\n\n*Especialista em análise técnica temporariamente indisponível*`;
  }
  
  // Respostas sobre extração de dados
  if (lowerMessage.includes('extrair') || lowerMessage.includes('dados') || lowerMessage.includes('informação')) {
    return `Minha análise do ${projectName} inclui: identificação de ambientes, cálculo de áreas, extração de cotas, especificações de materiais e elementos estruturais. Tudo automatizado e preciso.\n\n*Especialista em análise técnica temporariamente indisponível*`;
  }
  
  // Respostas sobre interpretação técnica
  if (lowerMessage.includes('interpretar') || lowerMessage.includes('entender') || lowerMessage.includes('significado')) {
    return `Interpreto elementos técnicos do ${projectName}: simbologias, especificações, normas aplicadas, detalhes construtivos. Posso esclarecer aspectos técnicos complexos.\n\n*Especialista em análise técnica temporariamente indisponível*`;
  }
  
  // Respostas sobre conformidade
  if (lowerMessage.includes('conformidade') || lowerMessage.includes('norma') || lowerMessage.includes('regulamento')) {
    return `Verifico conformidade do ${projectName} com normas técnicas, códigos de obras e regulamentações locais. Identifico possíveis inadequações e sugiro correções.\n\n*Especialista em análise técnica temporariamente indisponível*`;
  }
  
  // Resposta geral sobre análise
  return `Como especialista em análise técnica, posso processar documentos do ${projectName} e extrair informações precisas: áreas, materiais, especificações, conformidade. O que você precisa analisar?\n\n*Especialista em análise técnica temporariamente indisponível*`;
};
import { RichAgentContext } from '../agentTypes';

export const getBudgetFallback = (message: string, context: RichAgentContext): string => {
  const lowerMessage = message.toLowerCase();
  const projectName = context.project_context?.name || 'projeto';
  const projectArea = context.project_context?.area || 0;
  const projectLocation = context.project_context?.location || context.user_context?.location || 'Brasil';
  
  // Respostas sobre custos SINAPI
  if (lowerMessage.includes('sinapi') || lowerMessage.includes('custo') || lowerMessage.includes('preço')) {
    return `Para orçamentação do ${projectName} em ${projectLocation}, utilizo dados SINAPI atualizados. Com ${projectArea}m², posso estimar custos detalhados por categoria (estrutura, acabamentos, instalações).\n\n*Especialista em orçamentos temporariamente indisponível*`;
  }
  
  // Respostas sobre materiais e quantitativos
  if (lowerMessage.includes('material') || lowerMessage.includes('quantidade') || lowerMessage.includes('quantitativo')) {
    return `Baseado na área de ${projectArea}m² do ${projectName}, posso calcular quantitativos precisos de materiais: concreto, aço, alvenaria, revestimentos. Todos com base em composições SINAPI.\n\n*Especialista em orçamentos temporariamente indisponível*`;
  }
  
  // Respostas sobre análise de custos
  if (lowerMessage.includes('análise') || lowerMessage.includes('comparar') || lowerMessage.includes('otimizar')) {
    return `Para análise de custos do ${projectName}, considero variações regionais de ${projectLocation}, alternativas de materiais e otimizações possíveis. Posso sugerir economias sem comprometer qualidade.\n\n*Especialista em orçamentos temporariamente indisponível*`;
  }
  
  // Resposta geral sobre orçamentos
  return `Como especialista em orçamentos SINAPI, posso ajudar com estimativas precisas para o ${projectName} (${projectArea}m²) em ${projectLocation}. Precisa de análise de custos, quantitativos ou comparação de alternativas?\n\n*Especialista em orçamentos temporariamente indisponível*`;
};
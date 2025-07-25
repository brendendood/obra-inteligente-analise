import { RichAgentContext } from '../agentTypes';

export const getGeneralFallback = (message: string, context: RichAgentContext): string => {
  const lowerMessage = message.toLowerCase();
  const userLocation = context.user_context?.location || 'Brasil';
  
  // Respostas sobre normas e regulamentação
  if (lowerMessage.includes('norma') || lowerMessage.includes('nbr') || lowerMessage.includes('código')) {
    return `As normas técnicas brasileiras são fundamentais para garantir segurança e qualidade. Para ${userLocation}, recomendo verificar as NBRs específicas e o código de obras local. Sobre qual norma específica você gostaria de saber mais?\n\n*Assistente temporariamente indisponível - resposta simulada*`;
  }
  
  // Respostas sobre materiais
  if (lowerMessage.includes('material') || lowerMessage.includes('concreto') || lowerMessage.includes('aço') || lowerMessage.includes('cimento')) {
    return `Para especificação de materiais em ${userLocation}, é importante considerar qualidade, disponibilidade local e conformidade com normas. Posso ajudar com características técnicas de materiais específicos.\n\n*Assistente temporariamente indisponível - resposta simulada*`;
  }
  
  // Respostas sobre custos
  if (lowerMessage.includes('custo') || lowerMessage.includes('preço') || lowerMessage.includes('orçamento')) {
    return `Para estimativas de custos precisas, considero dados do SINAPI, localização da obra e especificações técnicas. Posso ajudar com análises de custos detalhadas.\n\n*Assistente temporariamente indisponível - resposta simulada*`;
  }
  
  // Resposta geral
  const responses = [
    `Sou especialista em engenharia civil e arquitetura, focado em normas brasileiras e boas práticas para ${userLocation}. Como posso ajudar?`,
    `Posso orientar sobre estruturas, materiais, normas técnicas e regulamentações específicas para ${userLocation}. Qual sua dúvida?`,
    `Estou aqui para esclarecer questões técnicas sobre construção civil, considerando as especificidades de ${userLocation}. O que você precisa saber?`
  ];
  
  const selectedResponse = responses[Math.floor(Math.random() * responses.length)];
  return `${selectedResponse}\n\n*Assistente temporariamente indisponível - resposta simulada*`;
};
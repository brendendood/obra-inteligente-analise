import { RichAgentContext } from '../agentTypes';

export const getProjectFallback = (message: string, context: RichAgentContext): string => {
  const lowerMessage = message.toLowerCase();
  const projectName = context.project_context?.name || 'seu projeto';
  const projectType = context.project_context?.type || 'construção';
  const projectArea = context.project_context?.area || 0;
  
  // Respostas sobre estruturas
  if (lowerMessage.includes('estrutura') || lowerMessage.includes('concreto') || lowerMessage.includes('aço')) {
    return `Para o dimensionamento estrutural do ${projectName}, considero a área de ${projectArea}m² e tipo ${projectType}. É fundamental seguir a NBR 6118 (concreto) e NBR 8800 (aço). Precisa de cálculos específicos?\n\n*Assistente especializado temporariamente indisponível*`;
  }
  
  // Respostas sobre análise técnica
  if (lowerMessage.includes('área') || lowerMessage.includes('ambiente') || lowerMessage.includes('cômodo')) {
    const analysisData = context.project_context?.analysis_data;
    if (analysisData && analysisData.rooms) {
      const roomCount = analysisData.rooms.length || 0;
      return `No ${projectName}, identifiquei ${roomCount} ambientes principais. Posso detalhar áreas específicas e sugerir otimizações de layout.\n\n*Assistente especializado temporariamente indisponível*`;
    }
    return `Para análise de ambientes do ${projectName}, preciso dos dados técnicos completos. Posso ajudar com otimização de layout e distribuição de áreas.\n\n*Assistente especializado temporariamente indisponível*`;
  }
  
  // Respostas sobre materiais
  if (lowerMessage.includes('material') || lowerMessage.includes('especificação')) {
    return `Para especificações do ${projectName} (${projectArea}m²), recomendo materiais adequados ao tipo ${projectType} e localização. Posso detalhar quantitativos e especificações técnicas.\n\n*Assistente especializado temporariamente indisponível*`;
  }
  
  // Resposta geral contextualizada
  return `Analisando o ${projectName} (${projectType}, ${projectArea}m²), posso ajudar com análise técnica, especificações, cálculos estruturais e conformidade com normas. Qual aspecto específico você gostaria de discutir?\n\n*Assistente especializado temporariamente indisponível*`;
};
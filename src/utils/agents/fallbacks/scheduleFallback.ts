import { RichAgentContext } from '../agentTypes';

export const getScheduleFallback = (message: string, context: RichAgentContext): string => {
  const lowerMessage = message.toLowerCase();
  const projectName = context.project_context?.name || 'projeto';
  const projectArea = context.project_context?.area || 0;
  const projectType = context.project_context?.type || 'construção';
  
  // Respostas sobre cronograma e planejamento
  if (lowerMessage.includes('cronograma') || lowerMessage.includes('prazo') || lowerMessage.includes('tempo')) {
    return `Para o cronograma do ${projectName} (${projectArea}m²), considero a complexidade do ${projectType} e sequenciamento técnico adequado. Posso estimar prazos realistas para cada etapa.\n\n*Especialista em cronogramas temporariamente indisponível*`;
  }
  
  // Respostas sobre etapas e fases
  if (lowerMessage.includes('etapa') || lowerMessage.includes('fase') || lowerMessage.includes('sequência')) {
    return `O ${projectName} deve seguir sequência lógica: fundação → estrutura → alvenaria → instalações → acabamentos. Posso detalhar prazos e dependências entre atividades.\n\n*Especialista em cronogramas temporariamente indisponível*`;
  }
  
  // Respostas sobre recursos e otimização
  if (lowerMessage.includes('recurso') || lowerMessage.includes('equipe') || lowerMessage.includes('otimizar')) {
    return `Para otimização do cronograma do ${projectName}, analiso disponibilidade de recursos, sobreposição de atividades e caminho crítico. Posso sugerir estratégias para reduzir prazos.\n\n*Especialista em cronogramas temporariamente indisponível*`;
  }
  
  // Respostas sobre marcos e controle
  if (lowerMessage.includes('marco') || lowerMessage.includes('controle') || lowerMessage.includes('acompanhar')) {
    return `Estabeleço marcos importantes para o ${projectName}: conclusão da estrutura, instalações, acabamentos. Posso criar sistema de controle e acompanhamento de progresso.\n\n*Especialista em cronogramas temporariamente indisponível*`;
  }
  
  // Resposta geral sobre cronogramas
  return `Como especialista em planejamento de obras, posso criar cronograma detalhado para o ${projectName} (${projectType}, ${projectArea}m²). Precisa de estimativa de prazos, sequenciamento ou otimização?\n\n*Especialista em cronogramas temporariamente indisponível*`;
};
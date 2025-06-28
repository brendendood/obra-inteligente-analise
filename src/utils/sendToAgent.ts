
/**
 * Função para enviar mensagens para o agente de IA via N8N
 * 
 * TODO: Implementar integração real com N8N
 * - Substituir a simulação por chamada HTTP real
 * - Adicionar tratamento de erros específicos
 * - Implementar retry logic se necessário
 */

export const sendMessageToAgent = async (message: string): Promise<string> => {
  // Simular delay de processamento (1-3 segundos)
  const delay = 1500 + Math.random() * 1500;
  await new Promise(resolve => setTimeout(resolve, delay));

  // Respostas simuladas baseadas no contexto da mensagem
  const responses = getContextualResponse(message);
  
  return responses[Math.floor(Math.random() * responses.length)];
};

const getContextualResponse = (message: string): string[] => {
  const lowerMessage = message.toLowerCase();
  
  // Respostas sobre estruturas
  if (lowerMessage.includes('estrutura') || lowerMessage.includes('concreto') || lowerMessage.includes('aço')) {
    return [
      "Para dimensionamento estrutural, é fundamental seguir a NBR 6118 (estruturas de concreto) e NBR 8800 (estruturas de aço). Precisa de cálculos específicos para algum elemento?",
      "Em projetos estruturais, sempre considero a combinação de cargas conforme NBR 6120. Qual tipo de estrutura você está desenvolvendo?",
      "O dimensionamento adequado depende das cargas atuantes e do tipo de solo. Posso ajudar com cálculos de fundação ou superestrutura?"
    ];
  }
  
  // Respostas sobre arquitetura
  if (lowerMessage.includes('projeto') || lowerMessage.includes('planta') || lowerMessage.includes('arquitetura')) {
    return [
      "No desenvolvimento de projetos arquitetônicos, sempre priorizo funcionalidade, acessibilidade e conformidade com o código de obras local. Em que posso ajudar?",
      "Para elaboração de plantas, é importante considerar circulação, ventilação natural e orientação solar. Qual ambiente você está projetando?",
      "Cada projeto deve atender às necessidades específicas do cliente e às normas técnicas vigentes. Precisa de orientações sobre algum ambiente específico?"
    ];
  }
  
  // Respostas sobre normas
  if (lowerMessage.includes('norma') || lowerMessage.includes('nbr') || lowerMessage.includes('código')) {
    return [
      "As normas técnicas brasileiras são fundamentais para garantir segurança e qualidade. Sobre qual NBR específica você gostaria de saber?",
      "Sempre consulto as normas atualizadas da ABNT. Posso esclarecer dúvidas sobre aplicação de normas específicas no seu projeto.",
      "O cumprimento das normas técnicas é obrigatório. Qual aspecto normativo precisa esclarecer?"
    ];
  }
  
  // Respostas sobre materiais
  if (lowerMessage.includes('material') || lowerMessage.includes('tijolo') || lowerMessage.includes('bloco')) {
    return [
      "A escolha de materiais deve considerar durabilidade, custo-benefício e adequação ao clima local. Qual material você deseja especificar?",
      "Para alvenaria, recomendo blocos cerâmicos ou de concreto, dependendo da aplicação. Precisa de especificações técnicas?",
      "Cada material tem suas características e aplicações específicas. Posso ajudar na especificação adequada para seu projeto."
    ];
  }
  
  // Respostas gerais
  return [
    "Sou especialista em arquitetura e engenharia civil. Como posso ajudar com seu projeto?",
    "Posso auxiliar com cálculos estruturais, especificações técnicas, normas brasileiras e desenvolvimento de projetos. O que você precisa?",
    "Estou aqui para esclarecer dúvidas técnicas sobre construção civil. Qual sua pergunta específica?",
    "Com minha experiência em projetos, posso orientar sobre estruturas, instalações, materiais e normas técnicas. Como posso ajudar?"
  ];
};

// Função futura para integração real com N8N
export const sendToN8N = async (message: string): Promise<string> => {
  // TODO: Implementar quando N8N estiver configurado
  /*
  const response = await fetch('/api/n8n-webhook', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });
  
  if (!response.ok) {
    throw new Error('Erro na comunicação com o assistente');
  }
  
  const data = await response.json();
  return data.response;
  */
  
  return sendMessageToAgent(message);
};

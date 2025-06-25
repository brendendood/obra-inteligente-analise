
export const getIntelligentResponse = (question: string, projectData: any) => {
  const lowerQuestion = question.toLowerCase();
  const area = projectData.total_area || 100;
  const analysisData = projectData.analysis_data;
  
  // Análise de custos
  if (lowerQuestion.includes('custo') || lowerQuestion.includes('orçamento') || lowerQuestion.includes('preço')) {
    const costPerM2 = area > 200 ? 1200 : area > 100 ? 1000 : 800;
    const estimatedCost = area * costPerM2;
    
    return {
      message: `📊 **Análise de Custos para ${projectData.name}**\n\n` +
              `Para uma área de ${area}m², com base nos padrões atuais:\n\n` +
              `• **Custo estimado**: R$ ${estimatedCost.toLocaleString()}\n` +
              `• **Custo por m²**: R$ ${costPerM2}\n` +
              `• **Variação esperada**: ±15%\n\n` +
              `💡 Gostaria que eu gere um orçamento detalhado baseado na tabela SINAPI?`,
      metadata: { 
        type: 'calculation' as const,
        data: { estimatedCost, costPerM2, area }
      }
    };
  }
  
  // Análise de cronograma
  if (lowerQuestion.includes('tempo') || lowerQuestion.includes('prazo') || lowerQuestion.includes('cronograma') || lowerQuestion.includes('duração')) {
    const duration = area > 200 ? '8-10 meses' : area > 100 ? '5-7 meses' : '3-5 meses';
    const phases = [
      'Fundação e movimentação de terra',
      'Estrutura e lajes',
      'Alvenaria e vedação',
      'Instalações (hidráulica/elétrica)',
      'Acabamentos e pintura'
    ];
    
    return {
      message: `⏱️ **Análise de Cronograma para ${projectData.name}**\n\n` +
              `Para ${area}m², o prazo estimado é de **${duration}**\n\n` +
              `**Principais fases:**\n` +
              phases.map((phase, i) => `${i + 1}. ${phase}`).join('\n') + '\n\n' +
              `💡 Posso gerar um cronograma detalhado com datas específicas?`,
      metadata: { 
        type: 'timeline' as const,
        data: { duration, phases, area }
      }
    };
  }
  
  // Análise de materiais
  if (lowerQuestion.includes('material') || lowerQuestion.includes('insumo') || lowerQuestion.includes('concreto') || lowerQuestion.includes('aço')) {
    return {
      message: `🏗️ **Estimativa de Materiais para ${projectData.name}**\n\n` +
              `Para ${area}m²:\n\n` +
              `• **Concreto**: ~${(area * 0.15).toFixed(1)}m³\n` +
              `• **Aço**: ~${(area * 8).toFixed(0)}kg\n` +
              `• **Tijolos**: ~${(area * 45).toFixed(0)} unidades\n` +
              `• **Cimento**: ~${(area * 7).toFixed(0)} sacos\n\n` +
              `*Estimativas baseadas em padrões construtivos residenciais*\n\n` +
              `📋 Sobre qual material específico gostaria de mais detalhes?`,
      metadata: { 
        type: 'calculation' as const,
        data: { materials: true, area }
      }
    };
  }
  
  // Análise técnica baseada nos dados do projeto
  if (analysisData && (lowerQuestion.includes('análise') || lowerQuestion.includes('técnic'))) {
    return {
      message: `🔍 **Análise Técnica Detalhada**\n\n` +
              `Com base no PDF analisado do projeto "${projectData.name}":\n\n` +
              `• **Status**: ✅ Projeto processado com sucesso\n` +
              `• **Área total**: ${area}m²\n` +
              `• **Dados extraídos**: Plantas, especificações e detalhes técnicos\n\n` +
              `📄 Os dados foram processados pela nossa IA e estão prontos para gerar:\n` +
              `- Orçamento SINAPI detalhado\n` +
              `- Cronograma de execução\n` +
              `- Lista de materiais\n\n` +
              `Qual análise específica você gostaria de ver primeiro?`,
      metadata: { 
        type: 'suggestion' as const,
        data: { hasAnalysis: true }
      }
    };
  }
  
  // Resposta genérica inteligente
  return {
    message: `🤖 Entendi sua pergunta sobre "${question}"\n\n` +
            `Como especialista no projeto "${projectData.name}" (${area}m²), posso ajudar com:\n\n` +
            `📊 **Orçamento e custos** - Estimativas baseadas em SINAPI\n` +
            `⏱️ **Cronogramas** - Prazos realistas por etapa\n` +
            `🏗️ **Materiais** - Quantitativos e especificações\n` +
            `📋 **Normas técnicas** - NBRs aplicáveis\n` +
            `🔍 **Análise técnica** - Insights do seu projeto\n\n` +
            `Sobre qual aspecto específico você gostaria de conversar?`,
    metadata: { type: 'suggestion' as const }
  };
};

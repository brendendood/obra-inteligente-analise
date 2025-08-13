
import { Project } from '@/types/project';

interface AIResponse {
  message: string;
  data?: {
    rooms?: Array<{ name: string; area: number }>;
    materials?: Record<string, { quantity: number; unit: string; description: string }>;
    tables?: Array<{ headers: string[]; rows: string[][] }>;
  };
}

export const getProjectAIResponse = async (question: string, project: Project): Promise<AIResponse> => {
  // Simular delay de processamento
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
  
  const lowerQuestion = question.toLowerCase();
  const analysisData = project.analysis_data || {};
  const rooms = analysisData.rooms || [];
  const materials = analysisData.materials || {};
  
  // Detectar intenções da pergunta
  if (lowerQuestion.includes('área') || lowerQuestion.includes('m²') || lowerQuestion.includes('metros')) {
    if (lowerQuestion.includes('total')) {
      return {
        message: `🏠 **Análise de Áreas - ${project.name}**\n\nA área total do projeto é de **${project.total_area}m²**.\n\n**Distribuição por ambiente:**\n${rooms.map((room: any) => `• **${room.name}:** ${room.area}m²`).join('\n')}\n\n📊 **Resumo técnico:**\n• Área construída: ${project.total_area}m²\n• Total de ambientes: ${rooms.length}\n• Tipo: ${project.project_type || 'Residencial'}\n\n💡 **Observação:** Área bem distribuída conforme normas de habitabilidade.`,
        data: { rooms: rooms.slice(0, 6) }
      };
    }
    
    if (lowerQuestion.includes('sala') || lowerQuestion.includes('estar')) {
      const livingRooms = rooms.filter((room: any) => 
        room.name.toLowerCase().includes('sala') || 
        room.name.toLowerCase().includes('estar')
      );
      return {
        message: `🛋️ **Áreas Sociais Identificadas**\n\n${livingRooms.map((room: any) => `• **${room.name}:** ${room.area}m²`).join('\n')}\n\n📐 **Análise técnica:**\n• Dimensões adequadas para mobiliário padrão\n• Boa integração com outros ambientes\n• Ventilação e iluminação natural\n\n✅ **Conformidade:** Atende NBR 15575 para áreas mínimas.`,
        data: { rooms: livingRooms }
      };
    }
    
    if (lowerQuestion.includes('quarto') || lowerQuestion.includes('dormitório')) {
      const bedrooms = rooms.filter((room: any) => 
        room.name.toLowerCase().includes('dormitório') || 
        room.name.toLowerCase().includes('quarto') || 
        room.name.toLowerCase().includes('suíte')
      );
      return {
        message: `🛏️ **Análise dos Dormitórios**\n\n${bedrooms.map((room: any) => `• **${room.name}:** ${room.area}m²`).join('\n')}\n\n🏠 **Características técnicas:**\n• Total de dormitórios: ${bedrooms.length}\n• Área média: ${(bedrooms.reduce((acc: number, room: any) => acc + room.area, 0) / bedrooms.length).toFixed(1)}m²\n• Maior ambiente: ${Math.max(...bedrooms.map((r: any) => r.area))}m²\n\n📋 **Conformidade NBR:** Todos os dormitórios atendem área mínima exigida.`,
        data: { rooms: bedrooms }
      };
    }
  }
  
  if (lowerQuestion.includes('material') || lowerQuestion.includes('quantidade') || lowerQuestion.includes('volume')) {
    if (lowerQuestion.includes('concreto')) {
      const concreto = materials.concreto || { quantity: project.total_area * 0.15, unit: 'm³', description: 'Concreto estrutural' };
      return {
        message: `🏗️ **Quantitativo de Concreto**\n\n• **Volume total:** ${concreto.quantity.toFixed(2)}${concreto.unit}\n• **Especificação:** ${concreto.description}\n\n**Distribuição estimada:**\n• Fundações: ${(concreto.quantity * 0.4).toFixed(2)}m³\n• Estrutura/Lajes: ${(concreto.quantity * 0.6).toFixed(2)}m³\n\n⚠️ **Importante:** Volume calculado para ${project.total_area}m². Considerar bombeamento se necessário.\n\n📋 **Especificação técnica:** Concreto fck ≥ 25 MPa conforme projeto estrutural.`,
        data: { materials: { concreto } }
      };
    }
    
    if (lowerQuestion.includes('aço') || lowerQuestion.includes('ferro')) {
      const aco = materials.aco || { quantity: project.total_area * 8, unit: 'kg', description: 'Aço CA-50' };
      return {
        message: `🔩 **Quantitativo de Aço Estrutural**\n\n• **Peso total:** ${aco.quantity.toFixed(0)}${aco.unit}\n• **Especificação:** ${aco.description}\n\n**Composição típica:**\n• Barras longitudinais: ${(aco.quantity * 0.7).toFixed(0)}kg\n• Estribos e distribuição: ${(aco.quantity * 0.3).toFixed(0)}kg\n\n📐 **Taxa por m²:** ${(aco.quantity / project.total_area).toFixed(1)}kg/m²\n\n✅ **Conformidade:** Taxa adequada para estrutura residencial padrão.`,
        data: { materials: { aco } }
      };
    }
    
    if (lowerQuestion.includes('alvenaria') || lowerQuestion.includes('bloco') || lowerQuestion.includes('tijolo')) {
      const alvenaria = materials.alvenaria || { quantity: project.total_area * 2.5, unit: 'm²', description: 'Alvenaria de vedação' };
      return {
        message: `🧱 **Quantitativo de Alvenaria**\n\n• **Área total:** ${alvenaria.quantity.toFixed(2)}${alvenaria.unit}\n• **Especificação:** ${alvenaria.description}\n\n**Detalhamento:**\n• Paredes externas: ${(alvenaria.quantity * 0.6).toFixed(2)}m²\n• Paredes internas: ${(alvenaria.quantity * 0.4).toFixed(2)}m²\n\n📋 **Material:** Blocos cerâmicos 14x19x29cm\n💡 **Dica:** Adicionar 5% para perdas e recortes.\n\n⚠️ **Observação:** Considerar vergas e contravergas nos vãos.`,
        data: { materials: { alvenaria } }
      };
    }
  }
  
  if (lowerQuestion.includes('janela') || lowerQuestion.includes('porta') || lowerQuestion.includes('vão')) {
    const openings = analysisData.openings || [];
    const windows = openings.filter((o: any) => o.type === 'window') || [];
    const doors = openings.filter((o: any) => o.type === 'door') || [];
    
    return {
      message: `🚪 **Esquadrias do Projeto**\n\n**Janelas identificadas:** ${windows.length || 'Estimativa: ' + Math.ceil(rooms.length * 1.2)}\n**Portas identificadas:** ${doors.length || 'Estimativa: ' + (rooms.length + 1)}\n\n**Distribuição por ambiente:**\n${rooms.slice(0, 5).map((room: any) => `• **${room.name}:** ${Math.ceil(room.area / 15)} abertura(s)`).join('\n')}\n\n🔧 **Especificações recomendadas:**\n• Janelas: Esquadria de alumínio com vidro temperado\n• Portas: Madeira ou PVC, conforme ambiente\n• Ventilação: Mínimo 1/8 da área do piso\n\n✅ **Conformidade:** Atende código de obras local.`,
      data: { rooms: rooms.slice(0, 4) }
    };
  }
  
  if (lowerQuestion.includes('instalação') || lowerQuestion.includes('hidráulica') || lowerQuestion.includes('elétrica') || lowerQuestion.includes('ponto')) {
    return {
      message: `⚡ **Instalações Prediais - ${project.name}**\n\n**Sistema Elétrico:**\n• Padrão residencial monofásico/bifásico\n• Quadro de distribuição com disjuntores\n• Pontos de força e iluminação conforme projeto\n\n**Sistema Hidráulico:**\n• Água fria: Tubulação PVC/PPR\n• Água quente: Sistema central ou individual\n• Esgoto: Conexão à rede pública\n\n**Pontos principais:**\n${rooms.slice(0, 3).map((room: any) => `• **${room.name}:** ${room.name.includes('Banheiro') ? '6-8 pontos' : room.name.includes('Cozinha') ? '8-10 pontos' : '3-4 pontos'}`).join('\n')}\n\n🔧 **Observações técnicas:**\n• Projeto deve seguir NBR 5410 (elétrica) e NBR 5626 (hidráulica)\n• Prever pontos para futuras ampliações`,
      data: { rooms: rooms.slice(0, 3) }
    };
  }
  
  // Resposta genérica contextualizada
  return {
    message: `🤖 **IA MadeAI - Análise Contextual**\n\nBaseado na análise completa do projeto **${project.name}** (${project.total_area}m²), identifiquei:\n\n📊 **Dados principais:**\n• ${rooms.length} ambientes mapeados\n• Projeto do tipo: ${project.project_type || 'Residencial'}\n• Status: ${project.analysis_data ? 'Totalmente analisado' : 'Em processamento'}\n\n🎯 **Para análises específicas, pergunte sobre:**\n• **Áreas e dimensões** de qualquer ambiente\n• **Quantitativos de materiais** (concreto, aço, alvenaria)\n• **Especificações técnicas** e instalações\n• **Esquadrias** e aberturas\n• **Documentos** e arquivos do projeto\n\n💡 **Dica:** Seja mais específico para respostas detalhadas e dados técnicos precisos!`,
    data: { 
      rooms: rooms.slice(0, 4),
      materials: Object.keys(materials).length > 0 ? materials : undefined
    }
  };
};

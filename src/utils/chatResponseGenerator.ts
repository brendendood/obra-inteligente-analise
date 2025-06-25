
import { ChatMessage } from '@/types/chat';

interface ProjectAnalysisData {
  total_area?: number;
  project_type?: string;
  analysis_data?: any;
}

interface ResponseData {
  message: string;
  metadata: {
    type: 'suggestion' | 'calculation' | 'timeline';
    data?: any;
  };
}

export const getIntelligentResponse = (userMessage: string, project: ProjectAnalysisData): ResponseData => {
  const message = userMessage.toLowerCase();
  const area = project.total_area || 150;
  const projectType = project.project_type || 'residencial';
  
  // Detectar intenções do usuário
  if (message.includes('orçamento') || message.includes('custo') || message.includes('preço') || message.includes('valor')) {
    const estimatedCost = area * 1200; // R$ 1.200/m² estimativa base
    const costPerM2 = 1200;
    
    return {
      message: `Com base na análise do projeto, posso ajudar com o orçamento! Para um projeto ${projectType} de ${area}m², a estimativa inicial fica em torno de R$ ${estimatedCost.toLocaleString('pt-BR')} (R$ ${costPerM2}/m²).\n\nEsta estimativa considera:\n• Fundação e estrutura\n• Alvenaria e vedação\n• Instalações básicas\n• Acabamentos padrão\n\nGostaria que eu gere um orçamento detalhado baseado na tabela SINAPI?`,
      metadata: {
        type: 'calculation' as const,
        data: {
          estimatedCost,
          costPerM2,
          area
        }
      }
    };
  }
  
  if (message.includes('cronograma') || message.includes('prazo') || message.includes('tempo') || message.includes('etapa')) {
    const duration = area > 200 ? '8-12 meses' : area > 100 ? '6-8 meses' : '4-6 meses';
    const phases = [
      'Fundação e movimentação de terra',
      'Estrutura e lajes',
      'Alvenaria e vedação',
      'Instalações hidráulicas e elétricas',
      'Acabamentos finais'
    ];
    
    return {
      message: `Para um projeto de ${area}m², estimo um prazo de execução de ${duration}.\n\nAs principais etapas seriam:\n${phases.map((phase, i) => `${i + 1}. ${phase}`).join('\n')}\n\nPosso gerar um cronograma detalhado com as datas e dependências entre as atividades?`,
      metadata: {
        type: 'timeline' as const,
        data: {
          duration,
          phases,
          area,
          complexity: area > 200 ? 'alta' : area > 100 ? 'média' : 'baixa'
        }
      }
    };
  }
  
  if (message.includes('material') || message.includes('especificação') || message.includes('técnico')) {
    const materials = ['Concreto', 'Aço CA-50', 'Blocos cerâmicos', 'Argamassa', 'Revestimentos'];
    
    return {
      message: `Posso ajudar com especificações técnicas! Para seu projeto de ${area}m², alguns materiais principais seriam:\n\n${materials.map(mat => `• ${mat}`).join('\n')}\n\nPrecisa de especificações detalhadas de algum material específico? Posso consultar as normas técnicas e fornecer quantitativos.`,
      metadata: {
        type: 'suggestion' as const,
        data: {
          materials,
          area,
          hasAnalysis: !!project.analysis_data
        }
      }
    };
  }
  
  if (message.includes('documento') || message.includes('relatório') || message.includes('pdf')) {
    return {
      message: `Posso ajudar você a acessar todos os documentos do projeto! Tenho acesso a:\n\n• Projeto original em PDF\n• Relatórios de análise\n• Planilhas de orçamento\n• Cronogramas exportáveis\n\nQue tipo de documento você precisa? Posso gerar relatórios customizados também.`,
      metadata: {
        type: 'suggestion' as const,
        data: {
          documentTypes: ['PDF original', 'Relatórios', 'Planilhas', 'Cronogramas'],
          hasAnalysis: !!project.analysis_data
        }
      }
    };
  }
  
  // Resposta genérica inteligente
  const suggestions = [
    'Gerar orçamento SINAPI detalhado',
    'Criar cronograma de execução',
    'Analisar especificações técnicas',
    'Consultar documentos do projeto'
  ];
  
  return {
    message: `Entendi sua pergunta sobre o projeto ${projectType} de ${area}m². Como especialista em construção civil, posso ajudar você com:\n\n${suggestions.map(sug => `• ${sug}`).join('\n')}\n\nSobre o que gostaria de saber mais? Tenho acesso completo aos dados técnicos deste projeto.`,
    metadata: {
      type: 'suggestion' as const,
      data: {
        suggestions,
        projectArea: area,
        projectType,
        hasAnalysis: !!project.analysis_data
      }
    }
  };
};

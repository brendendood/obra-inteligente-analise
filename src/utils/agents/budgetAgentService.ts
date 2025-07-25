import { User } from '@supabase/supabase-js';
import { Project } from '@/types/project';
import { BudgetData } from '@/utils/budgetGenerator';
import { sendMessageToAgent } from './unifiedAgentService';

interface BudgetGenerationContext {
  user?: User | null;
  project: Project;
  requirements?: string;
  location?: string;
}

/**
 * Gera orçamento usando agente especializado N8N
 */
export const generateBudgetWithAgent = async (
  context: BudgetGenerationContext
): Promise<BudgetData> => {
  const message = `Gerar orçamento detalhado para o projeto ${context.project.name} com ${context.project.total_area}m². ${context.requirements || 'Incluir todos os itens necessários baseados na análise do projeto.'}`;

  try {
    const response = await sendMessageToAgent(message, 'budget', {
      user: context.user,
      project: context.project,
      intent: 'generate_budget'
    });

    // Tentar parsear resposta estruturada do agente
    try {
      const budgetData = JSON.parse(response);
      if (budgetData.items && budgetData.total) {
        return budgetData;
      }
    } catch (parseError) {
      console.log('Resposta não estruturada do agente, usando fallback');
    }

    // Fallback: usar gerador local
    const { generateAutomaticBudget } = await import('@/utils/budgetGenerator');
    return generateAutomaticBudget(context.project);

  } catch (error) {
    console.error('Erro na geração de orçamento via agente:', error);
    
    // Fallback: usar gerador local
    const { generateAutomaticBudget } = await import('@/utils/budgetGenerator');
    return generateAutomaticBudget(context.project);
  }
};

/**
 * Otimiza orçamento existente usando agente especializado
 */
export const optimizeBudgetWithAgent = async (
  budgetData: BudgetData,
  context: BudgetGenerationContext
): Promise<BudgetData> => {
  const message = `Analisar e otimizar o orçamento do projeto ${context.project.name}. Orçamento atual: R$ ${budgetData.total_com_bdi.toLocaleString('pt-BR')}. Sugerir economias sem comprometer qualidade.`;

  try {
    const response = await sendMessageToAgent(message, 'budget', {
      user: context.user,
      project: context.project,
      intent: 'optimize_budget'
    });

    // Retornar orçamento otimizado se disponível
    try {
      const optimizedBudget = JSON.parse(response);
      if (optimizedBudget.items && optimizedBudget.total) {
        return optimizedBudget;
      }
    } catch (parseError) {
      console.log('Otimização não estruturada do agente');
    }

    // Fallback: retornar orçamento original
    return budgetData;

  } catch (error) {
    console.error('Erro na otimização de orçamento via agente:', error);
    return budgetData;
  }
};
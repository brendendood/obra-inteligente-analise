import { User } from '@supabase/supabase-js';
import { Project, ScheduleData } from '@/types/project';
import { sendMessageToAgent } from './unifiedAgentService';

interface ScheduleGenerationContext {
  user?: User | null;
  project: Project;
  requirements?: string;
  constraints?: string;
}

/**
 * Gera cronograma usando agente especializado N8N
 */
export const generateScheduleWithAgent = async (
  context: ScheduleGenerationContext
): Promise<ScheduleData> => {
  const message = `Gerar cronograma detalhado para o projeto ${context.project.name} com ${context.project.total_area}m². ${context.requirements || 'Incluir todas as etapas necessárias com prazos realistas.'} ${context.constraints || ''}`;

  try {
    const response = await sendMessageToAgent(message, 'schedule', {
      user: context.user,
      project: context.project,
      intent: 'generate_schedule'
    });

    // Tentar parsear resposta estruturada do agente
    try {
      const scheduleData = JSON.parse(response);
      if (scheduleData.tasks && scheduleData.totalDuration) {
        return scheduleData;
      }
    } catch (parseError) {
      console.log('Resposta não estruturada do agente, usando fallback');
    }

    // Fallback: usar gerador local
    const { generateProjectSchedule } = await import('@/utils/scheduleGenerator');
    const tasks = generateProjectSchedule(context.project);
    
    return {
      projectId: context.project.id,
      projectName: context.project.name,
      totalArea: context.project.total_area || 0,
      totalDuration: tasks.reduce((acc, task) => acc + task.duration, 0),
      totalCost: tasks.reduce((acc, task) => acc + 1000, 0), // Estimativa padrão
      tasks: tasks.map(task => ({ 
        ...task, 
        cost: 1000, // Custo estimado padrão
        status: 'planned' as const,
        dependencies: task.dependencies || []
      })),
      criticalPath: tasks.map(task => task.id),
    };

  } catch (error) {
    console.error('Erro na geração de cronograma via agente:', error);
    
    // Fallback: usar gerador local
    const { generateProjectSchedule } = await import('@/utils/scheduleGenerator');
    const tasks = generateProjectSchedule(context.project);
    
    return {
      projectId: context.project.id,
      projectName: context.project.name,
      totalArea: context.project.total_area || 0,
      totalDuration: tasks.reduce((acc, task) => acc + task.duration, 0),
      totalCost: tasks.reduce((acc, task) => acc + 1000, 0), // Estimativa padrão
      tasks: tasks.map(task => ({ 
        ...task, 
        cost: 1000, // Custo estimado padrão
        status: 'planned' as const,
        dependencies: task.dependencies || []
      })),
      criticalPath: tasks.map(task => task.id),
    };
  }
};

/**
 * Otimiza cronograma existente usando agente especializado
 */
export const optimizeScheduleWithAgent = async (
  scheduleData: ScheduleData,
  context: ScheduleGenerationContext
): Promise<ScheduleData> => {
  const message = `Analisar e otimizar o cronograma do projeto ${context.project.name}. Duração atual: ${scheduleData.totalDuration} dias. Sugerir otimizações para reduzir prazos sem comprometer qualidade.`;

  try {
    const response = await sendMessageToAgent(message, 'schedule', {
      user: context.user,
      project: context.project,
      intent: 'optimize_schedule'
    });

    // Retornar cronograma otimizado se disponível
    try {
      const optimizedSchedule = JSON.parse(response);
      if (optimizedSchedule.tasks && optimizedSchedule.totalDuration) {
        return optimizedSchedule;
      }
    } catch (parseError) {
      console.log('Otimização não estruturada do agente');
    }

    // Fallback: retornar cronograma original
    return scheduleData;

  } catch (error) {
    console.error('Erro na otimização de cronograma via agente:', error);
    return scheduleData;
  }
};
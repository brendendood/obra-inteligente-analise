
import { Project } from '@/types/project';

export interface ScheduleTask {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  duration: number;
  color: string;
  category: string;
  progress: number;
  dependencies?: string[];
}

export const generateProjectSchedule = (project: Project): ScheduleTask[] => {
  const area = project.total_area || 100;
  const complexity = area > 200 ? 'alta' : area > 100 ? 'média' : 'baixa';
  
  const baseDurations = {
    baixa: { fundacao: 14, estrutura: 21, alvenaria: 18, instalacoes: 15, acabamento: 20 },
    média: { fundacao: 18, estrutura: 28, alvenaria: 24, instalacoes: 21, acabamento: 28 },
    alta: { fundacao: 25, estrutura: 35, alvenaria: 30, instalacoes: 28, acabamento: 35 }
  };
  
  const durations = baseDurations[complexity];
  let currentDate = new Date();
  
  const tasks: ScheduleTask[] = [];
  
  // Fundação
  const fundacaoStart = new Date(currentDate);
  const fundacaoEnd = new Date(currentDate.getTime() + durations.fundacao * 24 * 60 * 60 * 1000);
  tasks.push({
    id: '1',
    name: 'Fundação e Movimentação de Terra',
    startDate: fundacaoStart.toISOString().split('T')[0],
    endDate: fundacaoEnd.toISOString().split('T')[0],
    duration: durations.fundacao,
    color: 'bg-blue-500',
    category: 'estrutura',
    progress: 0
  });
  
  // Estrutura
  currentDate = new Date(fundacaoEnd);
  const estruturaEnd = new Date(currentDate.getTime() + durations.estrutura * 24 * 60 * 60 * 1000);
  tasks.push({
    id: '2',
    name: 'Estrutura e Lajes',
    startDate: currentDate.toISOString().split('T')[0],
    endDate: estruturaEnd.toISOString().split('T')[0],
    duration: durations.estrutura,
    color: 'bg-orange-500',
    category: 'estrutura',
    progress: 0,
    dependencies: ['1']
  });
  
  // Alvenaria
  currentDate = new Date(estruturaEnd);
  const alvenariaEnd = new Date(currentDate.getTime() + durations.alvenaria * 24 * 60 * 60 * 1000);
  tasks.push({
    id: '3',
    name: 'Alvenaria e Vedação',
    startDate: currentDate.toISOString().split('T')[0],
    endDate: alvenariaEnd.toISOString().split('T')[0],
    duration: durations.alvenaria,
    color: 'bg-red-500',
    category: 'alvenaria',
    progress: 0,
    dependencies: ['2']
  });
  
  // Instalações (pode começar quando alvenaria está 70% concluída)
  const instalacaoStart = new Date(currentDate.getTime() + (durations.alvenaria * 0.7) * 24 * 60 * 60 * 1000);
  const instalacaoEnd = new Date(instalacaoStart.getTime() + durations.instalacoes * 24 * 60 * 60 * 1000);
  tasks.push({
    id: '4',
    name: 'Instalações Hidráulicas e Elétricas',
    startDate: instalacaoStart.toISOString().split('T')[0],
    endDate: instalacaoEnd.toISOString().split('T')[0],
    duration: durations.instalacoes,
    color: 'bg-purple-500',
    category: 'instalacoes',
    progress: 0,
    dependencies: ['3']
  });
  
  // Acabamentos
  const acabamentoStart = new Date(Math.max(alvenariaEnd.getTime(), instalacaoEnd.getTime()));
  const acabamentoEnd = new Date(acabamentoStart.getTime() + durations.acabamento * 24 * 60 * 60 * 1000);
  tasks.push({
    id: '5',
    name: 'Acabamentos e Pintura',
    startDate: acabamentoStart.toISOString().split('T')[0],
    endDate: acabamentoEnd.toISOString().split('T')[0],
    duration: durations.acabamento,
    color: 'bg-green-500',
    category: 'acabamento',
    progress: 0,
    dependencies: ['3', '4']
  });
  
  return tasks;
};


import { ScheduleTask, ScheduleData } from '@/types/project';

// Fases do cronograma baseadas na lógica temporal consensual
export const SCHEDULE_PHASES = {
  PRELIMINARES: { order: 1, name: 'Preliminares e Serviços Iniciais', color: '#6B7280' },
  INFRAESTRUTURA: { order: 2, name: 'Infraestrutura', color: '#3B82F6' },
  SUPERESTRUTURA: { order: 3, name: 'Superestrutura', color: '#F97316' },
  ALVENARIA: { order: 4, name: 'Alvenaria e Vedações', color: '#EF4444' },
  COBERTURA: { order: 5, name: 'Cobertura', color: '#8B5CF6' },
  REVESTIMENTOS: { order: 6, name: 'Revestimentos Internos', color: '#10B981' },
  CONTRAPISOS: { order: 7, name: 'Contrapisos e Impermeabilizações', color: '#F59E0B' },
  ESQUADRIAS: { order: 8, name: 'Esquadrias', color: '#84CC16' },
  ACABAMENTOS: { order: 9, name: 'Instalações e Acabamentos', color: '#06B6D4' },
  LIMPEZA: { order: 10, name: 'Limpeza Final e Entrega', color: '#EC4899' }
};

// Mapear categorias para fases
const CATEGORY_TO_PHASE: Record<string, keyof typeof SCHEDULE_PHASES> = {
  'Estrutural': 'SUPERESTRUTURA',
  'Vedações': 'ALVENARIA',
  'Instalações': 'ACABAMENTOS',
  'Acabamentos': 'ACABAMENTOS',
  'Fundações': 'INFRAESTRUTURA',
  'Cobertura': 'COBERTURA',
  'Preliminares': 'PRELIMINARES'
};

// Dependências entre fases (uma fase só pode começar após conclusão da anterior)
const PHASE_DEPENDENCIES: Record<keyof typeof SCHEDULE_PHASES, (keyof typeof SCHEDULE_PHASES)[]> = {
  PRELIMINARES: [],
  INFRAESTRUTURA: ['PRELIMINARES'],
  SUPERESTRUTURA: ['INFRAESTRUTURA'],
  ALVENARIA: ['SUPERESTRUTURA'],
  COBERTURA: ['SUPERESTRUTURA'], // Pode ser paralela à alvenaria
  REVESTIMENTOS: ['ALVENARIA'],
  CONTRAPISOS: ['ALVENARIA'],
  ESQUADRIAS: ['REVESTIMENTOS'],
  ACABAMENTOS: ['REVESTIMENTOS', 'CONTRAPISOS'],
  LIMPEZA: ['ACABAMENTOS', 'ESQUADRIAS', 'COBERTURA']
};

// Sobreposições permitidas (percentual de conclusão necessário)
const ALLOWED_OVERLAPS: Record<string, number> = {
  'ALVENARIA_INSTALACOES': 0.7, // Instalações podem começar com 70% da alvenaria
  'SUPERESTRUTURA_COBERTURA': 0.8, // Cobertura pode começar com 80% da estrutura
  'REVESTIMENTOS_CONTRAPISOS': 0.5 // Contrapisos podem começar com 50% dos revestimentos
};

export interface RecalculationResult {
  tasks: ScheduleTask[];
  warnings: string[];
  totalDuration: number;
  criticalPath: string[];
}

export const validateTaskOrder = (tasks: ScheduleTask[]): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const taskPhases = new Map<string, keyof typeof SCHEDULE_PHASES>();
  
  // Mapear tarefas para fases
  tasks.forEach(task => {
    const phase = getTaskPhase(task);
    taskPhases.set(task.id, phase);
  });
  
  // Verificar dependências
  tasks.forEach((task, index) => {
    const currentPhase = taskPhases.get(task.id)!;
    const dependencies = PHASE_DEPENDENCIES[currentPhase];
    
    dependencies.forEach(depPhase => {
      const depPhaseOrder = SCHEDULE_PHASES[depPhase].order;
      const currentPhaseOrder = SCHEDULE_PHASES[currentPhase].order;
      
      // Verificar se existe alguma tarefa da fase dependente após a atual
      const hasLaterDependency = tasks.slice(index + 1).some(laterTask => {
        const laterPhase = taskPhases.get(laterTask.id)!;
        return SCHEDULE_PHASES[laterPhase].order === depPhaseOrder;
      });
      
      if (hasLaterDependency) {
        errors.push(`${task.name} (${SCHEDULE_PHASES[currentPhase].name}) não pode vir antes de ${SCHEDULE_PHASES[depPhase].name}`);
      }
    });
  });
  
  return { isValid: errors.length === 0, errors };
};

export const recalculateScheduleDates = (
  tasks: ScheduleTask[], 
  projectStartDate?: Date
): RecalculationResult => {
  const warnings: string[] = [];
  const startDate = projectStartDate || new Date();
  let currentDate = new Date(startDate);
  
  // Validar ordem antes de recalcular
  const validation = validateTaskOrder(tasks);
  if (!validation.isValid) {
    warnings.push(...validation.errors);
  }
  
  const recalculatedTasks: ScheduleTask[] = [];
  const phaseEndDates = new Map<keyof typeof SCHEDULE_PHASES, Date>();
  
  tasks.forEach((task, index) => {
    const phase = getTaskPhase(task);
    const dependencies = PHASE_DEPENDENCIES[phase];
    
    // Calcular data de início baseada nas dependências
    let taskStartDate = new Date(currentDate);
    
    dependencies.forEach(depPhase => {
      const depEndDate = phaseEndDates.get(depPhase);
      if (depEndDate && depEndDate > taskStartDate) {
        taskStartDate = new Date(depEndDate);
      }
    });
    
    // Verificar sobreposições permitidas
    const allowedOverlap = checkAllowedOverlap(task, tasks.slice(0, index));
    if (allowedOverlap.canOverlap) {
      const overlapStartDate = new Date(allowedOverlap.overlapDate!);
      if (overlapStartDate < taskStartDate) {
        taskStartDate = overlapStartDate;
        warnings.push(`${task.name} iniciada em paralelo com ${allowedOverlap.parallelTask}`);
      }
    }
    
    // Calcular data de fim
    const taskEndDate = new Date(taskStartDate.getTime() + (task.duration * 24 * 60 * 60 * 1000));
    
    // Atualizar data de fim da fase
    const currentPhaseEndDate = phaseEndDates.get(phase);
    if (!currentPhaseEndDate || taskEndDate > currentPhaseEndDate) {
      phaseEndDates.set(phase, taskEndDate);
    }
    
    // Criar tarefa recalculada
    const recalculatedTask: ScheduleTask = {
      ...task,
      startDate: taskStartDate.toISOString().split('T')[0],
      endDate: taskEndDate.toISOString().split('T')[0],
      color: SCHEDULE_PHASES[phase].color
    };
    
    recalculatedTasks.push(recalculatedTask);
    
    // Atualizar currentDate para próxima tarefa (se não houver paralelismo)
    if (taskEndDate > currentDate) {
      currentDate = new Date(taskEndDate);
    }
  });
  
  // Calcular duração total e caminho crítico
  const totalDuration = Math.ceil(
    (currentDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)
  );
  
  const criticalPath = calculateCriticalPath(recalculatedTasks);
  
  return {
    tasks: recalculatedTasks,
    warnings,
    totalDuration,
    criticalPath
  };
};

const getTaskPhase = (task: ScheduleTask): keyof typeof SCHEDULE_PHASES => {
  // Mapear baseado no nome da tarefa ou categoria
  const taskName = task.name.toLowerCase();
  const category = task.category || '';
  
  if (taskName.includes('fundação') || taskName.includes('escavação')) {
    return 'INFRAESTRUTURA';
  }
  if (taskName.includes('estrutura') || taskName.includes('laje') || taskName.includes('pilar')) {
    return 'SUPERESTRUTURA';
  }
  if (taskName.includes('alvenaria') || taskName.includes('vedação')) {
    return 'ALVENARIA';
  }
  if (taskName.includes('cobertura') || taskName.includes('telhado')) {
    return 'COBERTURA';
  }
  if (taskName.includes('revestimento') || taskName.includes('reboco')) {
    return 'REVESTIMENTOS';
  }
  if (taskName.includes('contrapiso') || taskName.includes('impermeabilização')) {
    return 'CONTRAPISOS';
  }
  if (taskName.includes('esquadria') || taskName.includes('batente')) {
    return 'ESQUADRIAS';
  }
  if (taskName.includes('acabamento') || taskName.includes('pintura') || taskName.includes('instalação')) {
    return 'ACABAMENTOS';
  }
  if (taskName.includes('limpeza') || taskName.includes('entrega')) {
    return 'LIMPEZA';
  }
  
  // Fallback baseado na categoria
  return CATEGORY_TO_PHASE[category] || 'ACABAMENTOS';
};

const checkAllowedOverlap = (
  task: ScheduleTask, 
  previousTasks: ScheduleTask[]
): { canOverlap: boolean; overlapDate?: Date; parallelTask?: string } => {
  const currentPhase = getTaskPhase(task);
  
  // Verificar se instalações podem começar com 70% da alvenaria
  if (currentPhase === 'ACABAMENTOS') {
    const alvenariaTasks = previousTasks.filter(t => getTaskPhase(t) === 'ALVENARIA');
    if (alvenariaTasks.length > 0) {
      const lastAlvenaria = alvenariaTasks[alvenariaTasks.length - 1];
      const overlapPoint = ALLOWED_OVERLAPS['ALVENARIA_INSTALACOES'];
      const alvenariaStart = new Date(lastAlvenaria.startDate);
      const alvenariaDuration = lastAlvenaria.duration;
      const overlapDate = new Date(alvenariaStart.getTime() + (alvenariaDuration * overlapPoint * 24 * 60 * 60 * 1000));
      
      return {
        canOverlap: true,
        overlapDate,
        parallelTask: lastAlvenaria.name
      };
    }
  }
  
  return { canOverlap: false };
};

const calculateCriticalPath = (tasks: ScheduleTask[]): string[] => {
  // Simplificado: caminho crítico são as tarefas que determinam a duração total
  return tasks
    .filter(task => {
      const phase = getTaskPhase(task);
      const dependencies = PHASE_DEPENDENCIES[phase];
      return dependencies.length > 0 || phase === 'PRELIMINARES';
    })
    .map(task => task.id);
};

export const getPhaseInfo = (task: ScheduleTask) => {
  const phase = getTaskPhase(task);
  return SCHEDULE_PHASES[phase];
};

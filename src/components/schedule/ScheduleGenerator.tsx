import { useState, useEffect } from 'react';
import { Project, ScheduleTask, ScheduleData } from '@/types/project';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useScheduleGenerator = ({ project }: { project: Project | null }) => {
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  // CARREGAR DADOS PERSISTIDOS DO BANCO
  useEffect(() => {
    if (project?.analysis_data?.schedule_data) {
      console.log('📅 CRONOGRAMA: Carregando dados persistidos do projeto:', project.name);
      
      const persistedData = project.analysis_data.schedule_data;
      const scheduleData: ScheduleData = {
        projectId: project.id,
        projectName: project.name,
        totalArea: persistedData.projectArea,
        totalDuration: persistedData.total_duration,
        totalCost: project.analysis_data.budget_data?.total_cost || 0,
        tasks: persistedData.tasks.map((task: any) => ({
          id: task.id,
          name: task.name,
          startDate: task.startDate,
          endDate: task.endDate,
          duration: task.duration,
          cost: 0, // Pode ser calculado se necessário
          status: task.progress > 0 ? 'in_progress' : 'planned' as 'planned' | 'in_progress' | 'completed',
          category: task.category,
          color: getTaskColor(task.category),
          dependencies: task.dependencies || [],
          progress: task.progress || 0
        })),
        criticalPath: persistedData.tasks.map((t: any) => t.id) // Simplificado
      };
      
      setScheduleData(scheduleData);
      console.log('✅ CRONOGRAMA: Dados carregados do banco:', {
        duration: persistedData.total_duration,
        tasks: persistedData.tasks?.length || 0
      });
    }
  }, [project]);

  const getTaskColor = (category: string): string => {
    const colorMap: Record<string, string> = {
      'estrutura': 'bg-blue-500',
      'alvenaria': 'bg-red-500',
      'instalacoes': 'bg-purple-500',
      'acabamento': 'bg-green-500',
      'default': 'bg-gray-500'
    };
    return colorMap[category] || colorMap.default;
  };

  const generateSchedule = async () => {
    if (!project) return;

    setIsGenerating(true);
    setProgress(0);

    // Simular progresso
    const steps = [20, 40, 60, 80, 100];
    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setProgress(steps[currentStep]);
        currentStep++;
      } else {
        clearInterval(interval);
        
        // Gerar cronograma automático
        const generatedSchedule = generateProjectSchedule(project);
        setScheduleData(generatedSchedule);
        
        // Persistir no banco
        saveScheduleToDatabase(generatedSchedule);
        
        setIsGenerating(false);
        
        toast({
          title: "✅ Cronograma gerado e salvo!",
          description: `Cronograma de ${generatedSchedule.totalDuration} dias criado para ${project.name}.`,
        });
      }
    }, 500);
  };

  const generateProjectSchedule = (project: Project): ScheduleData => {
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
      cost: 15000,
      status: 'planned',
      category: 'estrutura',
      color: 'bg-blue-500',
      dependencies: [],
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
      cost: 25000,
      status: 'planned',
      category: 'estrutura',
      color: 'bg-orange-500',
      dependencies: ['1'],
      progress: 0
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
      cost: 18000,
      status: 'planned',
      category: 'alvenaria',
      color: 'bg-red-500',
      dependencies: ['2'],
      progress: 0
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
      cost: 22000,
      status: 'planned',
      category: 'instalacoes',
      color: 'bg-purple-500',
      dependencies: ['3'],
      progress: 0
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
      cost: 30000,
      status: 'planned',
      category: 'acabamento',
      color: 'bg-green-500',
      dependencies: ['3', '4'],
      progress: 0
    });
    
    const totalDuration = Object.values(durations).reduce((sum, dur) => sum + dur, 0);
    const totalCost = project.analysis_data?.budget_data?.total_cost || 0;
    
    return {
      projectId: project.id,
      projectName: project.name,
      totalArea: area,
      totalDuration,
      totalCost,
      tasks,
      criticalPath: tasks.map(t => t.id)
    };
  };

  const saveScheduleToDatabase = async (schedule: ScheduleData) => {
    if (!project) return;
    
    try {
      console.log('💾 CRONOGRAMA: Salvando no banco de dados...');
      
      const scheduleDataForDB = {
        projectArea: schedule.totalArea,
        total_duration: schedule.totalDuration,
        start_date: schedule.tasks[0]?.startDate,
        end_date: schedule.tasks[schedule.tasks.length - 1]?.endDate,
        tasks: schedule.tasks.map(task => ({
          id: task.id,
          name: task.name,
          startDate: task.startDate,
          endDate: task.endDate,
          duration: task.duration,
          category: task.category,
          progress: task.progress,
          dependencies: task.dependencies
        })),
        phases: [
          { name: 'Fundação', duration: 14, status: 'planned' },
          { name: 'Estrutura', duration: 21, status: 'planned' },
          { name: 'Alvenaria', duration: 18, status: 'planned' },
          { name: 'Instalações', duration: 15, status: 'planned' },
          { name: 'Acabamentos', duration: 20, status: 'planned' }
        ]
      };

      const updatedAnalysisData = {
        ...project.analysis_data,
        schedule_data: scheduleDataForDB,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('projects')
        .update({ 
          analysis_data: updatedAnalysisData
        })
        .eq('id', project.id);

      if (error) {
        console.error('❌ Erro ao salvar cronograma:', error);
      } else {
        console.log('✅ Cronograma salvo no banco com sucesso');
      }
    } catch (error) {
      console.error('💥 Erro ao persistir cronograma:', error);
    }
  };

  const updateTask = (taskId: string, updates: Partial<ScheduleTask>) => {
    setScheduleData(prev => {
      if (!prev) return null;
      
      const updatedTasks = prev.tasks.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      );
      
      const updatedSchedule = { ...prev, tasks: updatedTasks };
      
      // Salvar no banco
      saveScheduleToDatabase(updatedSchedule);
      
      return updatedSchedule;
    });
  };

  const addTask = (newTask: ScheduleTask) => {
    setScheduleData(prev => {
      if (!prev) return null;
      
      const updatedTasks = [...prev.tasks, newTask];
      const updatedSchedule = { ...prev, tasks: updatedTasks };
      
      // Salvar no banco
      saveScheduleToDatabase(updatedSchedule);
      
      return updatedSchedule;
    });
  };

  return {
    scheduleData,
    isGenerating,
    progress,
    generateSchedule,
    updateTask,
    addTask
  };
};

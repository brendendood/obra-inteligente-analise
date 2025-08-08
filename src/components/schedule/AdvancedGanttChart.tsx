
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Trash2, User, Calendar, DollarSign, Clock, GripVertical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import { DropIndicator } from '@/components/ui/DropIndicator';
import { ScheduleTask } from '@/types/project';

interface AdvancedGanttChartProps {
  tasks: ScheduleTask[];
  onUpdateTask: (taskId: string, updates: Partial<ScheduleTask>) => void;
  onAddTask: (task: ScheduleTask) => void;
  criticalPath: string[];
  projectName: string;
}

export const AdvancedGanttChart = ({
  tasks: initialTasks,
  onUpdateTask,
  onAddTask,
  criticalPath,
  projectName
}: AdvancedGanttChartProps) => {
  const [tasks, setTasks] = useState<ScheduleTask[]>(initialTasks);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [newTaskName, setNewTaskName] = useState('');
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const { toast } = useToast();

  // Configurar drag & drop com recálculo automático
  const {
    isDragging,
    getDragItemProps,
    getDropZoneProps,
    getDropIndicatorProps,
    isValidDrop
  } = useDragAndDrop({
    items: tasks,
    onReorder: (reorderedTasks) => {
      setTasks(reorderedTasks);
      // Sincronizar com o componente pai
      reorderedTasks.forEach((task, index) => {
        onUpdateTask(task.id, { ...task });
      });
    },
    keyExtractor: (task) => task.id,
    enableRecalculation: true,
    onRecalculate: (recalculatedTasks, warnings) => {
      setTasks(recalculatedTasks);
      
      // Aplicar mudanças no componente pai
      recalculatedTasks.forEach(task => {
        onUpdateTask(task.id, task);
      });

      if (warnings.length > 0) {
        toast({
          title: "⚠️ Cronograma recalculado",
          description: `${warnings.length} aviso(s) sobre dependências.`,
        });
      }
    }
  });

  const getStatusColor = (status: string) => {
    const colors = {
      planned: 'bg-blue-500',
      in_progress: 'bg-yellow-500', 
      completed: 'bg-green-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      planned: 'Planejado',
      in_progress: 'Em Andamento',
      completed: 'Concluído'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const handleAddTask = () => {
    if (!newTaskName.trim()) return;

    const newTask: ScheduleTask = {
      id: Date.now().toString(),
      name: newTaskName,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      duration: 7,
      cost: 10000,
      status: 'planned',
      category: 'Nova Etapa',
      color: '#6B7280',
      dependencies: [],
      progress: 0,
      assignee: { name: 'Não atribuído', email: '' }
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    onAddTask(newTask);
    setNewTaskName('');
    
    toast({
      title: "✅ Etapa adicionada!",
      description: `${newTask.name} foi adicionada ao cronograma.`,
    });
  };

  const handleTaskClick = (e: React.MouseEvent, taskId: string) => {
    // Prevenir conflito com drag
    if (isDragging) return;
    e.stopPropagation();
    setSelectedTask(selectedTask === taskId ? null : taskId);
  };

  const handleStatusChange = (taskId: string, newStatus: 'planned' | 'in_progress' | 'completed') => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
    onUpdateTask(taskId, { status: newStatus });
    
    toast({
      title: "📊 Status atualizado",
      description: `Status da etapa alterado para ${getStatusLabel(newStatus)}.`,
    });
  };

  const handleProgressChange = (taskId: string, progress: number) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, progress } : task
    );
    setTasks(updatedTasks);
    onUpdateTask(taskId, { progress });
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    toast({
      title: "🗑️ Tarefa removida",
      description: "Tarefa removida do cronograma.",
    });
  };

  // Calculate timeline for visualization
  const startDates = tasks.map(task => new Date(task.startDate).getTime());
  const endDates = tasks.map(task => new Date(task.endDate).getTime());
  const projectStart = startDates.length > 0 ? Math.min(...startDates) : Date.now();
  const projectEnd = endDates.length > 0 ? Math.max(...endDates) : Date.now();
  const totalDays = Math.ceil((projectEnd - projectStart) / (24 * 60 * 60 * 1000)) || 1;
  const weeksCount = Math.ceil(totalDays / 7);

  return (
    <Card className="shadow-lg border-0 overflow-hidden -mx-6 sm:mx-0 rounded-none sm:rounded-xl">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg sm:text-2xl font-bold text-slate-900 flex items-center">
              <Calendar className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 text-blue-600 flex-shrink-0" />
              <span className="truncate">Cronograma - {projectName}</span>
            </CardTitle>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Arraste para reordenar • Clique para editar • {Math.ceil(totalDays / 30)} meses
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
        {/* Add New Task - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
          <Input
            placeholder="Nome da nova etapa..."
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            className="flex-1 h-10 sm:h-auto"
          />
          <Button 
            onClick={handleAddTask} 
            size="sm" 
            className="bg-blue-600 hover:bg-blue-700 h-10 sm:h-auto whitespace-nowrap"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>

        {/* Mobile-friendly timeline */}
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-12 gap-1 text-center text-xs text-slate-500 font-medium mb-4">
              {Array.from({ length: Math.min(12, weeksCount) }, (_, i) => (
                <div key={i} className="p-2 bg-slate-100 rounded">
                  Sem {i + 1}
                </div>
              ))}
            </div>

            {/* Tasks with Drag & Drop */}
            <div className="space-y-3">
              {tasks.map((task, index) => {
                const isSelected = selectedTask === task.id;
                const isCritical = criticalPath.includes(task.id);
                const taskStart = new Date(task.startDate).getTime();
                const taskEnd = new Date(task.endDate).getTime();
                const taskStartWeek = Math.floor((taskStart - projectStart) / (7 * 24 * 60 * 60 * 1000));
                const taskDurationWeeks = Math.max(1, Math.ceil((taskEnd - taskStart) / (7 * 24 * 60 * 60 * 1000)));

                return (
                  <div key={task.id} className="relative">
                    {/* Drop Indicator */}
                    <DropIndicator {...getDropIndicatorProps(index)} className="mb-2" />
                    
                    {/* Task Item */}
                    <div
                      {...getDragItemProps(task, index)}
                      {...getDropZoneProps(index)}
                      className={`space-y-3 p-4 border rounded-lg transition-all duration-200 group ${
                        isSelected 
                          ? 'bg-blue-50 border-blue-300 shadow-md' 
                          : 'bg-white border-gray-200 hover:shadow-sm'
                      } ${isCritical ? 'ring-2 ring-red-200' : ''} ${
                        isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
                      } ${!isValidDrop && isDragging ? 'border-red-300 bg-red-50' : ''}`}
                    >
                      {/* Task Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {/* Drag Handle */}
                          <div className="flex-shrink-0 opacity-40 group-hover:opacity-100 transition-opacity">
                            <GripVertical className="h-5 w-5 text-gray-400" />
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <div className={`w-4 h-4 rounded-full ${getStatusColor(task.status)}`}></div>
                            {isCritical && (
                              <Badge variant="destructive" className="text-xs">CRÍTICO</Badge>
                            )}
                          </div>
                          
                          <div>
                            <h4 
                              className="font-semibold text-slate-900 cursor-pointer"
                              onClick={(e) => handleTaskClick(e, task.id)}
                            >
                              {task.name}
                            </h4>
                            <div className="flex items-center space-x-4 text-xs text-slate-500 mt-1">
                              <span className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{task.duration} dias</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <DollarSign className="h-3 w-3" />
                                <span>R$ {task.cost.toLocaleString('pt-BR')}</span>
                              </span>
                              {task.assignee && (
                                <span className="flex items-center space-x-1">
                                  <User className="h-3 w-3" />
                                  <span>{task.assignee.name}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center space-x-2">
                          <select
                            value={task.status}
                            onChange={(e) => handleStatusChange(task.id, e.target.value as any)}
                            className="text-xs border rounded px-2 py-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <option value="planned">Planejado</option>
                            <option value="in_progress">Em Andamento</option>
                            <option value="completed">Concluído</option>
                          </select>

                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={task.progress || 0}
                            onChange={(e) => handleProgressChange(task.id, parseInt(e.target.value) || 0)}
                            className="w-16 h-8 text-xs"
                            placeholder="%"
                            onClick={(e) => e.stopPropagation()}
                          />

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTask(task.id);
                            }}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Gantt Bar */}
                      <div className="relative">
                        <div className="grid grid-cols-12 gap-1 h-8">
                          {Array.from({ length: 12 }, (_, weekIndex) => {
                            const isTaskInWeek = weekIndex >= taskStartWeek && weekIndex < (taskStartWeek + taskDurationWeeks);
                            
                            return (
                              <div
                                key={weekIndex}
                                className={`h-full rounded-sm border transition-colors ${
                                  isTaskInWeek 
                                    ? `${getStatusColor(task.status)} opacity-80 border-slate-300` 
                                    : 'bg-slate-100 border-slate-200'
                                }`}
                              >
                                {/* Progress overlay */}
                                {isTaskInWeek && task.progress && task.progress > 0 && (
                                  <div 
                                    className="h-full bg-green-600 rounded-sm opacity-75"
                                    style={{ width: `${task.progress}%` }}
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Task Details (when selected) */}
                      {isSelected && (
                        <div className="bg-slate-50 p-3 rounded border-t">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-slate-700">Início:</span>
                              <span className="ml-2">{new Date(task.startDate).toLocaleDateString('pt-BR')}</span>
                            </div>
                            <div>
                              <span className="font-medium text-slate-700">Fim:</span>
                              <span className="ml-2">{new Date(task.endDate).toLocaleDateString('pt-BR')}</span>
                            </div>
                            <div>
                              <span className="font-medium text-slate-700">Categoria:</span>
                              <span className="ml-2">{task.category}</span>
                            </div>
                            <div>
                              <span className="font-medium text-slate-700">Dependências:</span>
                              <span className="ml-2">{task.dependencies.length || 'Nenhuma'}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Drop Indicator no final */}
                    {index === tasks.length - 1 && (
                      <DropIndicator {...getDropIndicatorProps(tasks.length)} className="mt-2" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma etapa no cronograma</p>
            <p className="text-sm">Adicione a primeira etapa acima</p>
          </div>
        )}

        {/* Legend */}
        <div className="mt-8 p-4 bg-slate-50 rounded-lg">
          <h5 className="font-semibold text-slate-900 mb-3">Legenda</h5>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-blue-500"></div>
              <span className="text-sm text-slate-600">Planejado</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-yellow-500"></div>
              <span className="text-sm text-slate-600">Em Andamento</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-green-500"></div>
              <span className="text-sm text-slate-600">Concluído</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded border-2 border-red-300"></div>
              <span className="text-sm text-slate-600">Caminho Crítico</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

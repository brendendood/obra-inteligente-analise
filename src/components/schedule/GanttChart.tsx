
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Edit, Calendar, Download, FileSpreadsheet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { exportToExcel, exportToPDF } from '@/utils/exportUtils';
import { useToast } from '@/hooks/use-toast';

interface Task {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  duration: number;
  color: string;
  category: string;
  progress?: number;
  dependencies?: string[];
}

interface GanttChartProps {
  tasks: Task[];
  projectName: string;
  onExportPDF?: () => void;
  onExportExcel?: () => void;
}

const GanttChart = ({ tasks: initialTasks, projectName, onExportPDF, onExportExcel }: GanttChartProps) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [newTaskName, setNewTaskName] = useState('');
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const { toast } = useToast();

  const handleAddTask = () => {
    if (!newTaskName.trim()) return;

    const lastTask = tasks[tasks.length - 1];
    const startDate = lastTask 
      ? new Date(new Date(lastTask.endDate).getTime() + 24 * 60 * 60 * 1000)
      : new Date();
    const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);

    const newTask: Task = {
      id: Date.now().toString(),
      name: newTaskName,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      duration: 7,
      color: 'bg-blue-500',
      category: 'nova',
      progress: 0
    };

    setTasks([...tasks, newTask]);
    setNewTaskName('');
    
    toast({
      title: "✅ Tarefa adicionada",
      description: `Tarefa "${newTaskName}" adicionada ao cronograma.`,
    });
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast({
      title: "🗑️ Tarefa removida",
      description: "Tarefa removida do cronograma.",
    });
  };

  const handleUpdateProgress = (taskId: string, progress: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, progress } : task
    ));
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetTask: Task) => {
    e.preventDefault();
    
    if (!draggedTask || draggedTask.id === targetTask.id) return;

    const draggedIndex = tasks.findIndex(t => t.id === draggedTask.id);
    const targetIndex = tasks.findIndex(t => t.id === targetTask.id);

    const newTasks = [...tasks];
    const [removed] = newTasks.splice(draggedIndex, 1);
    newTasks.splice(targetIndex, 0, removed);

    setTasks(newTasks);
    setDraggedTask(null);
  };

  const categoryColors: Record<string, string> = {
    estrutura: 'bg-blue-500',
    alvenaria: 'bg-orange-500',
    instalacoes: 'bg-purple-500',
    acabamento: 'bg-green-500',
    nova: 'bg-gray-500'
  };

  const categoryLabels: Record<string, string> = {
    estrutura: 'Estrutura',
    alvenaria: 'Alvenaria',
    instalacoes: 'Instalações',
    acabamento: 'Acabamentos',
    nova: 'Nova Tarefa'
  };

  const handleExportToExcel = () => {
    try {
      // Converter dados do cronograma para formato de exportação
      const scheduleData = {
        data_referencia: new Date().toLocaleDateString('pt-BR'),
        total: 0,
        bdi: 0,
        total_com_bdi: 0,
        totalArea: 0,
        items: tasks.map((task, index) => ({
          id: task.id,
          codigo: `TASK-${String(index + 1).padStart(3, '0')}`,
          descricao: task.name,
          unidade: 'dias',
          quantidade: task.duration,
          preco_unitario: 0,
          total: 0,
          categoria: categoryLabels[task.category] || task.category,
          ambiente: 'Cronograma'
        }))
      };
      
      exportToExcel(scheduleData, `Cronograma_${projectName}`);
      toast({
        title: "📊 Cronograma exportado",
        description: "Arquivo Excel gerado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "❌ Erro na exportação",
        description: "Não foi possível exportar o cronograma.",
        variant: "destructive",
      });
    }
  };

  const getTotalDuration = () => {
    if (tasks.length === 0) return 0;
    const startDate = new Date(Math.min(...tasks.map(t => new Date(t.startDate).getTime())));
    const endDate = new Date(Math.max(...tasks.map(t => new Date(t.endDate).getTime())));
    return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getCompletionPercentage = () => {
    if (tasks.length === 0) return 0;
    const totalProgress = tasks.reduce((acc, task) => acc + (task.progress || 0), 0);
    return Math.round(totalProgress / tasks.length);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center text-xl text-gray-900">
              <Calendar className="h-6 w-6 mr-3 text-blue-600" />
              Cronograma - {projectName}
            </CardTitle>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
              <span>Duração total: {getTotalDuration()} dias</span>
              <span>Progresso: {getCompletionPercentage()}%</span>
              <span>{tasks.length} tarefas</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExportToExcel}
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Excel
            </Button>
            {onExportPDF && (
              <Button variant="outline" size="sm" onClick={onExportPDF}>
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Add New Task */}
        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
          <Input
            placeholder="Nome da nova tarefa..."
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            className="flex-1"
          />
          <Button onClick={handleAddTask} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>

        {/* Timeline Overview */}
        {tasks.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium mb-3">Visão Geral do Timeline</h4>
            <div className="space-y-2">
              {tasks.map((task) => {
                const totalDays = getTotalDuration();
                const taskStart = new Date(task.startDate);
                const taskEnd = new Date(task.endDate);
                const projectStart = new Date(Math.min(...tasks.map(t => new Date(t.startDate).getTime())));
                
                const startOffset = Math.max(0, (taskStart.getTime() - projectStart.getTime()) / (1000 * 60 * 60 * 24));
                const taskWidth = (task.duration / totalDays) * 100;
                const leftPosition = (startOffset / totalDays) * 100;
                
                return (
                  <div key={task.id} className="flex items-center space-x-3">
                    <div className="w-48 text-sm font-medium truncate">{task.name}</div>
                    <div className="flex-1 relative h-6 bg-gray-200 rounded">
                      <div 
                        className={`absolute h-full ${task.color} rounded flex items-center justify-center text-white text-xs font-medium`}
                        style={{ 
                          left: `${leftPosition}%`, 
                          width: `${taskWidth}%`,
                          minWidth: '60px'
                        }}
                      >
                        {task.duration}d
                      </div>
                      {task.progress !== undefined && task.progress > 0 && (
                        <div 
                          className="absolute h-full bg-green-600 rounded opacity-75"
                          style={{ 
                            left: `${leftPosition}%`, 
                            width: `${(taskWidth * task.progress) / 100}%`
                          }}
                        />
                      )}
                    </div>
                    <div className="w-20 text-sm text-gray-500">
                      {task.progress || 0}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tasks List */}
        <div className="space-y-3">
          {tasks.map((task, index) => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => handleDragStart(e, task)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, task)}
              className="flex items-center space-x-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 cursor-move group"
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-500 w-8">
                    {index + 1}
                  </span>
                  
                  <div className={`w-4 h-4 rounded ${categoryColors[task.category]} flex-shrink-0`}></div>
                  
                  <Badge variant="outline" className="text-xs">
                    {categoryLabels[task.category]}
                  </Badge>
                </div>

                <div className="flex-1 min-w-0">
                  {editingTask === task.id ? (
                    <Input
                      value={task.name}
                      onChange={(e) => {
                        const updatedTasks = tasks.map(t => 
                          t.id === task.id ? { ...t, name: e.target.value } : t
                        );
                        setTasks(updatedTasks);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') setEditingTask(null);
                        if (e.key === 'Escape') setEditingTask(null);
                      }}
                      onBlur={() => setEditingTask(null)}
                      autoFocus
                      className="text-sm"
                    />
                  ) : (
                    <h4 className="font-medium text-gray-900 truncate">
                      {task.name}
                    </h4>
                  )}
                  
                  <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                    <span>Início: {new Date(task.startDate).toLocaleDateString('pt-BR')}</span>
                    <span>Fim: {new Date(task.endDate).toLocaleDateString('pt-BR')}</span>
                    <span>{task.duration} dias</span>
                    {task.dependencies && task.dependencies.length > 0 && (
                      <span>Deps: {task.dependencies.join(', ')}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress Control */}
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={task.progress || 0}
                  onChange={(e) => handleUpdateProgress(task.id, parseInt(e.target.value) || 0)}
                  className="w-16 h-8 text-xs"
                  placeholder="%"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingTask(task.id)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteTask(task.id)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma tarefa no cronograma</p>
            <p className="text-sm">Adicione a primeira tarefa acima</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GanttChart;


import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Edit, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Task {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  duration: number;
  color: string;
  category: string;
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

  const handleAddTask = () => {
    if (!newTaskName.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      name: newTaskName,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      duration: 7,
      color: 'bg-blue-500',
      category: 'nova'
    };

    setTasks([...tasks, newTask]);
    setNewTaskName('');
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
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
    acabamentos: 'bg-green-500',
    nova: 'bg-gray-500'
  };

  const categoryLabels: Record<string, string> = {
    estrutura: 'Estrutura',
    alvenaria: 'Alvenaria',
    instalacoes: 'Instalações',
    acabamentos: 'Acabamentos',
    nova: 'Nova Tarefa'
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
            <p className="text-gray-600 mt-1">
              Arraste as tarefas para reorganizar
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            {onExportPDF && (
              <Button variant="outline" size="sm" onClick={onExportPDF}>
                PDF
              </Button>
            )}
            {onExportExcel && (
              <Button variant="outline" size="sm" onClick={onExportExcel}>
                Excel
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
                  </div>
                </div>
              </div>

              {/* Timeline Bar */}
              <div className="flex-1 max-w-xs">
                <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${categoryColors[task.category]} rounded-full flex items-center justify-center`}
                    style={{ width: `${Math.min(100, (task.duration / 30) * 100)}%` }}
                  >
                    <span className="text-xs text-white font-medium">
                      {task.duration}d
                    </span>
                  </div>
                </div>
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

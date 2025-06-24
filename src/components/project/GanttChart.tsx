
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Calendar } from 'lucide-react';

interface GanttTask {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  duration: number;
  color: string;
  category: string;
}

interface GanttChartProps {
  tasks: GanttTask[];
  projectName: string;
  onExportPDF?: () => void;
  onExportExcel?: () => void;
}

const GanttChart: React.FC<GanttChartProps> = ({
  tasks,
  projectName,
  onExportPDF,
  onExportExcel
}) => {
  // Calculate total project duration
  const totalDays = Math.max(...tasks.map(task => task.duration));
  
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'estrutura': 'bg-blue-500',
      'alvenaria': 'bg-orange-500',
      'instalacoes': 'bg-purple-500',
      'acabamentos': 'bg-green-500',
      'finalizacao': 'bg-indigo-500'
    };
    return colors[category.toLowerCase()] || 'bg-gray-500';
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-slate-900 flex items-center">
              <Calendar className="h-6 w-6 mr-3 text-blue-600" />
              Cronograma - {projectName}
            </CardTitle>
            <p className="text-slate-600 mt-1">
              Visualização temporal das etapas do projeto
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onExportPDF}
              className="flex items-center space-x-2"
            >
              <FileText className="h-4 w-4" />
              <span>PDF</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onExportExcel}
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Excel</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {/* Timeline Header */}
          <div className="grid grid-cols-12 gap-1 text-center text-xs text-slate-500 font-medium">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="p-2">
                Sem {i + 1}
              </div>
            ))}
          </div>
          
          {/* Tasks */}
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-semibold text-slate-900">{task.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {task.category}
                    </Badge>
                  </div>
                  <div className="text-sm text-slate-600">
                    {task.duration} dias
                  </div>
                </div>
                
                {/* Gantt Bar */}
                <div className="relative">
                  <div className="grid grid-cols-12 gap-1 h-8">
                    {Array.from({ length: 12 }, (_, weekIndex) => {
                      const weekStart = weekIndex * 7;
                      const weekEnd = (weekIndex + 1) * 7;
                      const taskStart = new Date(task.startDate).getTime();
                      const taskEnd = new Date(task.endDate).getTime();
                      const projectStart = new Date(tasks[0]?.startDate || task.startDate).getTime();
                      
                      const taskStartWeek = Math.floor((taskStart - projectStart) / (7 * 24 * 60 * 60 * 1000));
                      const taskEndWeek = Math.floor((taskEnd - projectStart) / (7 * 24 * 60 * 60 * 1000));
                      
                      const isTaskInWeek = weekIndex >= taskStartWeek && weekIndex <= taskEndWeek;
                      
                      return (
                        <div
                          key={weekIndex}
                          className={`
                            h-full rounded-sm border border-slate-200 
                            ${isTaskInWeek ? getCategoryColor(task.category) : 'bg-slate-100'}
                          `}
                        />
                      );
                    })}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Início: {new Date(task.startDate).toLocaleDateString('pt-BR')}</span>
                  <span>Fim: {new Date(task.endDate).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Legend */}
          <div className="mt-8 p-4 bg-slate-50 rounded-lg">
            <h5 className="font-semibold text-slate-900 mb-3">Legenda</h5>
            <div className="flex flex-wrap gap-4">
              {['estrutura', 'alvenaria', 'instalacoes', 'acabamentos', 'finalizacao'].map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded ${getCategoryColor(category)}`} />
                  <span className="text-sm text-slate-600 capitalize">{category}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GanttChart;

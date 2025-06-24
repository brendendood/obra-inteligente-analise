
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';

interface ScheduleTask {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  duration: number;
  status: 'completed' | 'in-progress' | 'pending';
  category: string;
}

interface GanttScheduleProps {
  tasks: ScheduleTask[];
  projectName: string;
}

const GanttSchedule: React.FC<GanttScheduleProps> = ({ tasks, projectName }) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'in-progress':
        return 'status-in-progress';
      case 'pending':
        return 'status-pending';
      default:
        return 'status-pending';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-blue-500';
      case 'pending':
        return 'bg-orange-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'in-progress':
        return 'Em Andamento';
      case 'pending':
        return 'Pendente';
      default:
        return 'Pendente';
    }
  };

  // Calculate the maximum duration for percentage calculations
  const maxDuration = Math.max(...tasks.map(task => task.duration));

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center">
          <Calendar className="h-6 w-6 mr-3 text-primary" />
          Cronograma - {projectName}
        </CardTitle>
        <p className="text-muted-foreground">
          Cronograma visual das etapas do projeto
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Timeline header */}
        <div className="grid grid-cols-4 gap-4 text-sm font-medium text-muted-foreground border-b border-border pb-2">
          <div>Etapa</div>
          <div>Duração</div>
          <div>Status</div>
          <div>Período</div>
        </div>

        {/* Tasks */}
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="space-y-3">
              {/* Task info */}
              <div className="grid grid-cols-4 gap-4 items-center">
                <div>
                  <h4 className="font-semibold text-foreground">{task.name}</h4>
                  <p className="text-sm text-muted-foreground capitalize">{task.category}</p>
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  {task.duration} dias
                </div>
                
                <div>
                  <Badge className={`${getStatusStyle(task.status)} border`}>
                    {getStatusText(task.status)}
                  </Badge>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <div>{new Date(task.startDate).toLocaleDateString('pt-BR')}</div>
                  <div>{new Date(task.endDate).toLocaleDateString('pt-BR')}</div>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="relative">
                <div className="w-full bg-muted rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${getStatusColor(task.status)} transition-all duration-300`}
                    style={{ 
                      width: `${(task.duration / maxDuration) * 100}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-8 p-4 rounded-lg bg-muted/50">
          <h5 className="font-semibold text-foreground mb-3">Legenda</h5>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-green-500" />
              <span className="text-sm text-muted-foreground">Concluído</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-blue-500" />
              <span className="text-sm text-muted-foreground">Em Andamento</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-orange-500" />
              <span className="text-sm text-muted-foreground">Pendente</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GanttSchedule;

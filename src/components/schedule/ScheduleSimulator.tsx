
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, AlertTriangle, Clock, DollarSign, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ScheduleTask {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  duration: number;
  cost: number;
  status: 'planned' | 'in_progress' | 'completed';
  category: string;
  color: string;
  dependencies: string[];
  assignee?: {
    name: string;
    email: string;
  };
}

interface ScheduleData {
  projectId: string;
  projectName: string;
  totalArea: number;
  totalDuration: number;
  totalCost: number;
  tasks: ScheduleTask[];
  criticalPath: string[];
}

interface SimulationResult {
  delayedTask: string;
  delayDays: number;
  impactedTasks: string[];
  additionalDays: number;
  additionalCosts: number;
  newEndDate: string;
  criticalPathChanged: boolean;
}

interface ScheduleSimulatorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scheduleData: ScheduleData;
}

export const ScheduleSimulator = ({ open, onOpenChange, scheduleData }: ScheduleSimulatorProps) => {
  const [selectedTask, setSelectedTask] = useState<string>('');
  const [delayDays, setDelayDays] = useState<number>(7);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const { toast } = useToast();

  const runSimulation = async () => {
    if (!selectedTask || delayDays <= 0) {
      toast({
        title: "❌ Dados incompletos",
        description: "Selecione uma tarefa e informe os dias de atraso.",
        variant: "destructive",
      });
      return;
    }

    setIsSimulating(true);

    try {
      // Simulate delay calculation
      await new Promise(resolve => setTimeout(resolve, 1500));

      const task = scheduleData.tasks.find(t => t.id === selectedTask);
      if (!task) return;

      // Calculate impacts (mock logic)
      const taskIndex = scheduleData.tasks.findIndex(t => t.id === selectedTask);
      const impactedTasks = scheduleData.tasks
        .slice(taskIndex + 1)
        .filter(t => t.dependencies.includes(selectedTask))
        .map(t => t.name);

      // Calculate additional costs (mock calculation)
      const dailyCost = task.cost / task.duration;
      const additionalCosts = dailyCost * delayDays * 0.3; // 30% overhead for delays

      // Calculate new end date
      const originalEndDate = new Date(scheduleData.tasks[scheduleData.tasks.length - 1].endDate);
      const newEndDate = new Date(originalEndDate.getTime() + delayDays * 24 * 60 * 60 * 1000);

      const result: SimulationResult = {
        delayedTask: task.name,
        delayDays,
        impactedTasks,
        additionalDays: impactedTasks.length > 0 ? delayDays : 0,
        additionalCosts,
        newEndDate: newEndDate.toISOString().split('T')[0],
        criticalPathChanged: scheduleData.criticalPath.includes(selectedTask)
      };

      setSimulationResult(result);

      toast({
        title: "📊 Simulação concluída!",
        description: `Impacto do atraso de ${delayDays} dias em "${task.name}" calculado.`,
      });

    } catch (error) {
      console.error('Erro na simulação:', error);
      toast({
        title: "❌ Erro na simulação",
        description: "Não foi possível simular o atraso. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSimulating(false);
    }
  };

  const resetSimulation = () => {
    setSimulationResult(null);
    setSelectedTask('');
    setDelayDays(7);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
            Simulador de Impacto de Atrasos
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!simulationResult ? (
            <>
              {/* Simulation Form */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="task-select">Selecionar Tarefa para Simular Atraso</Label>
                  <Select value={selectedTask} onValueChange={setSelectedTask}>
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha uma tarefa..." />
                    </SelectTrigger>
                    <SelectContent>
                      {scheduleData.tasks.map((task) => (
                        <SelectItem key={task.id} value={task.id}>
                          {task.name} ({task.duration} dias)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="delay-days">Dias de Atraso</Label>
                  <Input
                    id="delay-days"
                    type="number"
                    min="1"
                    max="90"
                    value={delayDays}
                    onChange={(e) => setDelayDays(parseInt(e.target.value) || 0)}
                    placeholder="Número de dias"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Entre 1 e 90 dias de atraso
                  </p>
                </div>

                <Button 
                  onClick={runSimulation} 
                  disabled={isSimulating || !selectedTask}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isSimulating ? (
                    <>
                      <TrendingUp className="h-4 w-4 mr-2 animate-spin" />
                      Simulando impactos...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Simular Impacto
                    </>
                  )}
                </Button>
              </div>

              {/* Info Card */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900">Como funciona a simulação?</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        A IA analisa as dependências entre tarefas, calcula impactos no caminho crítico 
                        e estima custos adicionais baseados em fatores como mão-de-obra parada e 
                        renegociação de contratos.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              {/* Simulation Results */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Resultado da Simulação</h3>
                  <Button variant="outline" size="sm" onClick={resetSimulation}>
                    Nova Simulação
                  </Button>
                </div>

                {/* Impact Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className={simulationResult.criticalPathChanged ? 'border-red-300 bg-red-50' : ''}>
                    <CardContent className="p-4 text-center">
                      <Clock className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <p className="text-2xl font-bold text-gray-900">{simulationResult.additionalDays}</p>
                      <p className="text-sm text-gray-600">Dias adicionais no projeto</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <p className="text-2xl font-bold text-gray-900">
                        R$ {simulationResult.additionalCosts.toLocaleString('pt-BR')}
                      </p>
                      <p className="text-sm text-gray-600">Custos adicionais</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <Calendar className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                      <p className="text-sm font-bold text-gray-900">
                        {new Date(simulationResult.newEndDate).toLocaleDateString('pt-BR')}
                      </p>
                      <p className="text-sm text-gray-600">Nova data de conclusão</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Detailed Impact */}
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Detalhes do Impacto</h4>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">Tarefa com atraso:</span>
                        <Badge variant="outline">{simulationResult.delayedTask}</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">Dias de atraso simulado:</span>
                        <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                          {simulationResult.delayDays} dias
                        </Badge>
                      </div>

                      {simulationResult.criticalPathChanged && (
                        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                          <span className="text-sm">Impacto no caminho crítico:</span>
                          <Badge variant="destructive">CRÍTICO</Badge>
                        </div>
                      )}

                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium">Tarefas impactadas:</span>
                        <div className="mt-2 space-y-1">
                          {simulationResult.impactedTasks.length > 0 ? (
                            simulationResult.impactedTasks.map((taskName, index) => (
                              <Badge key={index} variant="outline" className="mr-2 mb-1">
                                {taskName}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-sm text-gray-500">Nenhuma tarefa dependente</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-yellow-900 mb-2">🤖 Recomendações da IA</h4>
                    <ul className="text-sm text-yellow-800 space-y-1">
                      <li>• Considere alocar recursos adicionais para a tarefa atrasada</li>
                      <li>• Revise as dependências para encontrar tarefas que podem ser paralelizadas</li>
                      <li>• Negocie prazos com fornecedores das tarefas impactadas</li>
                      {simulationResult.criticalPathChanged && (
                        <li>• <strong>Atenção:</strong> Este atraso afeta o caminho crítico do projeto</li>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

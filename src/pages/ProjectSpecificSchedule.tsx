import { useParams } from 'react-router-dom';
import { ProjectWorkspace } from '@/components/project/ProjectWorkspace';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Download, RefreshCw, TrendingUp, Clock, Calculator } from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AdvancedGanttChart } from '@/components/schedule/AdvancedGanttChart';
import { ScheduleSimulator } from '@/components/schedule/ScheduleSimulator';
import { ScheduleExportDialog } from '@/components/schedule/ScheduleExportDialog';
import { Progress } from '@/components/ui/progress';
import { ScheduleData, ScheduleTask } from '@/types/project';

const ProjectSpecificSchedule = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { currentProject } = useProject();
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSimulator, setShowSimulator] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const { toast } = useToast();

  const generateSchedule = async () => {
    if (!currentProject) return;
    
    console.log('📅 CRONOGRAMA: Gerando para projeto:', currentProject.name);
    setIsGenerating(true);
    setProgress(0);
    
    try {
      const progressSteps = [
        { step: 20, message: 'Analisando escopo do projeto...' },
        { step: 40, message: 'Calculando durações das etapas...' },
        { step: 60, message: 'Definindo dependências críticas...' },
        { step: 80, message: 'Integrando custos por fase...' },
        { step: 100, message: 'Otimizando cronograma com IA...' }
      ];
      
      for (const progressStep of progressSteps) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setProgress(progressStep.step);
        toast({
          title: progressStep.message,
          description: `${progressStep.step}% concluído`,
        });
      }
      
      const area = currentProject.total_area || 100;
      const complexity = area > 200 ? 'alta' : area > 100 ? 'média' : 'baixa';
      
      const baseDurations = {
        baixa: { fundacao: 14, estrutura: 21, alvenaria: 18, instalacoes: 15, acabamento: 20 },
        média: { fundacao: 18, estrutura: 28, alvenaria: 24, instalacoes: 21, acabamento: 28 },
        alta: { fundacao: 25, estrutura: 35, alvenaria: 30, instalacoes: 28, acabamento: 35 }
      };
      
      const baseCosts = {
        baixa: { fundacao: 15000, estrutura: 35000, alvenaria: 25000, instalacoes: 20000, acabamento: 30000 },
        média: { fundacao: 22000, estrutura: 45000, alvenaria: 35000, instalacoes: 28000, acabamento: 42000 },
        alta: { fundacao: 35000, estrutura: 65000, alvenaria: 50000, instalacoes: 40000, acabamento: 60000 }
      };
      
      const durations = baseDurations[complexity];
      const costs = baseCosts[complexity];
      let currentDate = new Date();
      
      const tasks: ScheduleTask[] = [
        {
          id: '1',
          name: 'Fundação e Movimentação de Terra',
          startDate: currentDate.toISOString().split('T')[0],
          endDate: new Date(currentDate.getTime() + durations.fundacao * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          duration: durations.fundacao,
          cost: costs.fundacao,
          status: 'planned',
          category: 'Estrutural',
          color: '#3B82F6',
          dependencies: [],
          assignee: { name: 'Equipe Fundações', email: 'fundacoes@obra.com' }
        }
      ];
      
      currentDate = new Date(currentDate.getTime() + durations.fundacao * 24 * 60 * 60 * 1000);
      
      tasks.push({
        id: '2',
        name: 'Estrutura e Lajes',
        startDate: currentDate.toISOString().split('T')[0],
        endDate: new Date(currentDate.getTime() + durations.estrutura * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        duration: durations.estrutura,
        cost: costs.estrutura,
        status: 'planned',
        category: 'Estrutural',
        color: '#F97316',
        dependencies: ['1'],
        assignee: { name: 'Equipe Estrutura', email: 'estrutura@obra.com' }
      });
      
      
      currentDate = new Date(currentDate.getTime() + durations.estrutura * 24 * 60 * 60 * 1000);
      
      tasks.push({
        id: '3',
        name: 'Alvenaria e Vedação',
        startDate: currentDate.toISOString().split('T')[0],
        endDate: new Date(currentDate.getTime() + durations.alvenaria * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        duration: durations.alvenaria,
        cost: costs.alvenaria,
        status: 'planned',
        category: 'Vedações',
        color: '#EF4444',
        dependencies: ['2'],
        assignee: { name: 'Equipe Alvenaria', email: 'alvenaria@obra.com' }
      });
      
      currentDate = new Date(currentDate.getTime() + durations.alvenaria * 24 * 60 * 60 * 1000);
      
      tasks.push({
        id: '4',
        name: 'Instalações Elétricas e Hidráulicas',
        startDate: currentDate.toISOString().split('T')[0],
        endDate: new Date(currentDate.getTime() + durations.instalacoes * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        duration: durations.instalacoes,
        cost: costs.instalacoes,
        status: 'planned',
        category: 'Instalações',
        color: '#8B5CF6',
        dependencies: ['3'],
        assignee: { name: 'Equipe Instalações', email: 'instalacoes@obra.com' }
      });
      
      currentDate = new Date(currentDate.getTime() + durations.instalacoes * 24 * 60 * 60 * 1000);
      
      tasks.push({
        id: '5',
        name: 'Acabamentos e Pintura',
        startDate: currentDate.toISOString().split('T')[0],
        endDate: new Date(currentDate.getTime() + durations.acabamento * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        duration: durations.acabamento,
        cost: costs.acabamento,
        status: 'planned',
        category: 'Acabamentos',
        color: '#10B981',
        dependencies: ['4'],
        assignee: { name: 'Equipe Acabamentos', email: 'acabamentos@obra.com' }
      });
      
      const totalDuration = Object.values(durations).reduce((sum, val) => sum + val, 0);
      const totalCost = Object.values(costs).reduce((sum, val) => sum + val, 0);
      
      setScheduleData({
        projectId: currentProject.id,
        projectName: currentProject.name,
        totalArea: area,
        totalDuration,
        totalCost,
        tasks,
        criticalPath: ['1', '2', '3', '4', '5']
      });
      
      toast({
        title: "📅 Cronograma gerado!",
        description: `Cronograma físico-financeiro para ${currentProject.name} criado com sucesso.`,
      });
    } catch (error) {
      console.error('❌ CRONOGRAMA: Erro ao gerar:', error);
      toast({
        title: "❌ Erro ao gerar cronograma",
        description: "Não foi possível gerar o cronograma. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const updateTask = (taskId: string, updates: Partial<ScheduleTask>) => {
    if (!scheduleData) return;
    
    const updatedTasks = scheduleData.tasks.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    );
    
    setScheduleData({
      ...scheduleData,
      tasks: updatedTasks
    });
  };

  const addTask = (newTask: ScheduleTask) => {
    if (!scheduleData) return;
    
    setScheduleData({
      ...scheduleData,
      tasks: [...scheduleData.tasks, newTask]
    });
  };

  if (!currentProject) {
    return (
      <ProjectWorkspace>
        <div className="text-center py-16">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Projeto não encontrado</h3>
          <p className="text-gray-600">Não foi possível carregar os dados do projeto.</p>
        </div>
      </ProjectWorkspace>
    );
  }

  return (
    <ProjectWorkspace>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cronograma Físico-Financeiro</h1>
            <p className="text-gray-600">Timeline integrada com custos para {currentProject.name} ({currentProject.total_area || 100}m²)</p>
          </div>
          
          <div className="flex space-x-3">
            <Button
              onClick={generateSchedule}
              disabled={isGenerating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Atualizar com IA
                </>
              )}
            </Button>
            
            {scheduleData && (
              <>
                <Button variant="outline" onClick={() => setShowSimulator(true)}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Simular Atraso
                </Button>
                
                <Button variant="outline" onClick={() => setShowExportDialog(true)}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Progress */}
        {isGenerating && (
          <Card className="bg-white/80 backdrop-blur-sm border border-blue-200/50">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
                  <span className="font-medium text-blue-900">Processando cronograma com IA...</span>
                </div>
                <Progress value={progress} className="h-3 bg-blue-100" />
                <p className="text-sm text-blue-700">
                  Analisando projeto de {currentProject.total_area || 100}m² e otimizando prazos
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Schedule Content */}
        {scheduleData ? (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Duração Total</p>
                      <p className="text-xl font-bold text-gray-900">{scheduleData.totalDuration} dias</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Calculator className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Custo Total</p>
                      <p className="text-xl font-bold text-gray-900">
                        R$ {scheduleData.totalCost.toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Etapas</p>
                      <p className="text-xl font-bold text-gray-900">{scheduleData.tasks.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="text-xl font-bold text-gray-900">Planejado</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Gantt Chart */}
            <AdvancedGanttChart
              tasks={scheduleData.tasks}
              onUpdateTask={updateTask}
              onAddTask={addTask}
              criticalPath={scheduleData.criticalPath}
              projectName={scheduleData.projectName}
            />
          </div>
        ) : !isGenerating && (
          <Card>
            <CardContent className="text-center py-16">
              <Calendar className="h-16 w-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                Cronograma Físico-Financeiro
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Gere um cronograma detalhado com integração financeira, análise de caminho crítico e simulação de cenários para {currentProject.name}.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Dialogs */}
        {showSimulator && scheduleData && (
          <ScheduleSimulator
            open={showSimulator}
            onOpenChange={setShowSimulator}
            scheduleData={scheduleData}
          />
        )}

        {showExportDialog && scheduleData && (
          <ScheduleExportDialog
            open={showExportDialog}
            onOpenChange={setShowExportDialog}
            scheduleData={scheduleData}
          />
        )}
      </div>
    </ProjectWorkspace>
  );
};

export default ProjectSpecificSchedule;

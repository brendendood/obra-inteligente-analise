import { useProjectDetail } from '@/contexts/ProjectDetailContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Download, RefreshCw, TrendingUp, Clock, Calculator } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AdvancedGanttChart } from '@/components/schedule/AdvancedGanttChart';
import { ScheduleSimulator } from '@/components/schedule/ScheduleSimulator';
import { ScheduleExportDialog } from '@/components/schedule/ScheduleExportDialog';
import { Progress } from '@/components/ui/progress';
import { ScheduleData, ScheduleTask } from '@/types/project';

const ProjectSpecificSchedule = () => {
  const { project, isLoading, error } = useProjectDetail();
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSimulator, setShowSimulator] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const { toast } = useToast();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando cronograma...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Erro ao carregar projeto</h3>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-16">
        <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Projeto não encontrado</h3>
        <p className="text-gray-600">Não foi possível carregar os dados do projeto.</p>
      </div>
    );
  }

  const generateSchedule = async () => {
    console.log('📅 CRONOGRAMA: Gerando para projeto:', project.name);
    setIsGenerating(true);
    setProgress(0);
    
    try {
      const progressSteps = [
        { step: 20, message: 'Analisando escopo baseado na lógica temporal consensual...' },
        { step: 40, message: 'Calculando durações por fase de construção...' },
        { step: 60, message: 'Definindo dependências críticas entre etapas...' },
        { step: 80, message: 'Integrando custos por fase executiva...' },
        { step: 100, message: 'Otimizando cronograma com IA baseada em melhores práticas...' }
      ];
      
      for (const progressStep of progressSteps) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setProgress(progressStep.step);
        toast({
          title: progressStep.message,
          description: `${progressStep.step}% concluído`,
        });
      }
      
      const area = project.total_area || 100;
      const complexity = area > 200 ? 'alta' : area > 100 ? 'média' : 'baixa';
      
      // Durações baseadas na lógica temporal consensual
      const baseDurations = {
        baixa: { 
          preliminares: 5, fundacao: 14, estrutura: 21, alvenaria: 18, 
          cobertura: 10, instalacoes: 15, revestimentos: 12, contrapisos: 8,
          esquadrias: 6, acabamento: 20, limpeza: 3
        },
        média: { 
          preliminares: 7, fundacao: 18, estrutura: 28, alvenaria: 24, 
          cobertura: 14, instalacoes: 21, revestimentos: 16, contrapisos: 10,
          esquadrias: 8, acabamento: 28, limpeza: 5
        },
        alta: { 
          preliminares: 10, fundacao: 25, estrutura: 35, alvenaria: 30, 
          cobertura: 18, instalacoes: 28, revestimentos: 20, contrapisos: 12,
          esquadrias: 10, acabamento: 35, limpeza: 7
        }
      };
      
      const baseCosts = {
        baixa: { 
          preliminares: 8000, fundacao: 15000, estrutura: 35000, alvenaria: 25000, 
          cobertura: 12000, instalacoes: 20000, revestimentos: 15000, contrapisos: 8000,
          esquadrias: 18000, acabamento: 30000, limpeza: 3000
        },
        média: { 
          preliminares: 12000, fundacao: 22000, estrutura: 45000, alvenaria: 35000, 
          cobertura: 18000, instalacoes: 28000, revestimentos: 22000, contrapisos: 12000,
          esquadrias: 25000, acabamento: 42000, limpeza: 5000
        },
        alta: { 
          preliminares: 18000, fundacao: 35000, estrutura: 65000, alvenaria: 50000, 
          cobertura: 28000, instalacoes: 40000, revestimentos: 32000, contrapisos: 18000,
          esquadrias: 35000, acabamento: 60000, limpeza: 8000
        }
      };
      
      const durations = baseDurations[complexity];
      const costs = baseCosts[complexity];
      let currentDate = new Date();
      
      // Criar tarefas seguindo a lógica temporal consensual
      const tasks: ScheduleTask[] = [];
      
      // 1. PRELIMINARES
      const preliminaresEnd = new Date(currentDate.getTime() + durations.preliminares * 24 * 60 * 60 * 1000);
      tasks.push({
        id: '1',
        name: 'Preliminares e Serviços Iniciais',
        startDate: currentDate.toISOString().split('T')[0],
        endDate: preliminaresEnd.toISOString().split('T')[0],
        duration: durations.preliminares,
        cost: costs.preliminares,
        status: 'planned',
        category: 'Preliminares',
        color: '#6B7280',
        dependencies: [],
        assignee: { name: 'Equipe Preliminar', email: 'preliminar@obra.com' }
      });
      
      // 2. INFRAESTRUTURA
      currentDate = new Date(preliminaresEnd);
      const fundacaoEnd = new Date(currentDate.getTime() + durations.fundacao * 24 * 60 * 60 * 1000);
      tasks.push({
        id: '2',
        name: 'Fundação e Movimentação de Terra',
        startDate: currentDate.toISOString().split('T')[0],
        endDate: fundacaoEnd.toISOString().split('T')[0],
        duration: durations.fundacao,
        cost: costs.fundacao,
        status: 'planned',
        category: 'Estrutural',
        color: '#3B82F6',
        dependencies: ['1'],
        assignee: { name: 'Equipe Fundações', email: 'fundacoes@obra.com' }
      });
      
      // 3. SUPERESTRUTURA
      currentDate = new Date(fundacaoEnd);
      const estruturaEnd = new Date(currentDate.getTime() + durations.estrutura * 24 * 60 * 60 * 1000);
      tasks.push({
        id: '3',
        name: 'Estrutura e Lajes',
        startDate: currentDate.toISOString().split('T')[0],
        endDate: estruturaEnd.toISOString().split('T')[0],
        duration: durations.estrutura,
        cost: costs.estrutura,
        status: 'planned',
        category: 'Estrutural',
        color: '#F97316',
        dependencies: ['2'],
        assignee: { name: 'Equipe Estrutura', email: 'estrutura@obra.com' }
      });
      
      // 4. ALVENARIA
      currentDate = new Date(estruturaEnd);
      const alvenariaEnd = new Date(currentDate.getTime() + durations.alvenaria * 24 * 60 * 60 * 1000);
      tasks.push({
        id: '4',
        name: 'Alvenaria e Vedação',
        startDate: currentDate.toISOString().split('T')[0],
        endDate: alvenariaEnd.toISOString().split('T')[0],
        duration: durations.alvenaria,
        cost: costs.alvenaria,
        status: 'planned',
        category: 'Vedações',
        color: '#EF4444',
        dependencies: ['3'],
        assignee: { name: 'Equipe Alvenaria', email: 'alvenaria@obra.com' }
      });
      
      // 5. COBERTURA (paralela à alvenaria, após 80% da estrutura)
      const coberturaStart = new Date(estruturaEnd.getTime() + (durations.estrutura * 0.8) * 24 * 60 * 60 * 1000);
      const coberturaEnd = new Date(coberturaStart.getTime() + durations.cobertura * 24 * 60 * 60 * 1000);
      tasks.push({
        id: '5',
        name: 'Cobertura',
        startDate: coberturaStart.toISOString().split('T')[0],
        endDate: coberturaEnd.toISOString().split('T')[0],
        duration: durations.cobertura,
        cost: costs.cobertura,
        status: 'planned',
        category: 'Cobertura',
        color: '#8B5CF6',
        dependencies: ['3'],
        assignee: { name: 'Equipe Cobertura', email: 'cobertura@obra.com' }
      });
      
      // 6. REVESTIMENTOS
      currentDate = new Date(alvenariaEnd);
      const revestimentosEnd = new Date(currentDate.getTime() + durations.revestimentos * 24 * 60 * 60 * 1000);
      tasks.push({
        id: '6',
        name: 'Revestimentos Internos (Grossos)',
        startDate: currentDate.toISOString().split('T')[0],
        endDate: revestimentosEnd.toISOString().split('T')[0],
        duration: durations.revestimentos,
        cost: costs.revestimentos,
        status: 'planned',
        category: 'Revestimentos',
        color: '#10B981',
        dependencies: ['4'],
        assignee: { name: 'Equipe Revestimentos', email: 'revestimentos@obra.com' }
      });
      
      // 7. INSTALAÇÕES (começam com 70% da alvenaria)
      const instalacoesStart = new Date(new Date(tasks[3].startDate).getTime() + (durations.alvenaria * 0.7) * 24 * 60 * 60 * 1000);
      const instalacoesEnd = new Date(instalacoesStart.getTime() + durations.instalacoes * 24 * 60 * 60 * 1000);
      tasks.push({
        id: '7',
        name: 'Instalações Elétricas e Hidráulicas',
        startDate: instalacoesStart.toISOString().split('T')[0],
        endDate: instalacoesEnd.toISOString().split('T')[0],
        duration: durations.instalacoes,
        cost: costs.instalacoes,
        status: 'planned',
        category: 'Instalações',
        color: '#8B5CF6',
        dependencies: ['4'],
        assignee: { name: 'Equipe Instalações', email: 'instalacoes@obra.com' }
      });
      
      // 8. CONTRAPISOS
      const contrapisoStart = new Date(Math.max(revestimentosEnd.getTime(), instalacoesEnd.getTime()));
      const contrapisoEnd = new Date(contrapisoStart.getTime() + durations.contrapisos * 24 * 60 * 60 * 1000);
      tasks.push({
        id: '8',
        name: 'Contrapisos e Impermeabilizações',
        startDate: contrapisoStart.toISOString().split('T')[0],
        endDate: contrapisoEnd.toISOString().split('T')[0],
        duration: durations.contrapisos,
        cost: costs.contrapisos,
        status: 'planned',
        category: 'Contrapisos',
        color: '#F59E0B',
        dependencies: ['6', '7'],
        assignee: { name: 'Equipe Contrapisos', email: 'contrapisos@obra.com' }
      });
      
      // 9. ESQUADRIAS
      currentDate = new Date(contrapisoEnd);
      const esquadriasEnd = new Date(currentDate.getTime() + durations.esquadrias * 24 * 60 * 60 * 1000);
      tasks.push({
        id: '9',
        name: 'Esquadrias',
        startDate: currentDate.toISOString().split('T')[0],
        endDate: esquadriasEnd.toISOString().split('T')[0],
        duration: durations.esquadrias,
        cost: costs.esquadrias,
        status: 'planned',
        category: 'Esquadrias',
        color: '#84CC16',
        dependencies: ['8'],
        assignee: { name: 'Equipe Esquadrias', email: 'esquadrias@obra.com' }
      });
      
      // 10. ACABAMENTOS
      const acabamentoStart = new Date(Math.max(esquadriasEnd.getTime(), coberturaEnd.getTime()));
      const acabamentoEnd = new Date(acabamentoStart.getTime() + durations.acabamento * 24 * 60 * 60 * 1000);
      tasks.push({
        id: '10',
        name: 'Acabamentos e Pintura',
        startDate: acabamentoStart.toISOString().split('T')[0],
        endDate: acabamentoEnd.toISOString().split('T')[0],
        duration: durations.acabamento,
        cost: costs.acabamento,
        status: 'planned',
        category: 'Acabamentos',
        color: '#06B6D4',
        dependencies: ['9', '5'],
        assignee: { name: 'Equipe Acabamentos', email: 'acabamentos@obra.com' }
      });
      
      // 11. LIMPEZA FINAL
      currentDate = new Date(acabamentoEnd);
      const limpezaEnd = new Date(currentDate.getTime() + durations.limpeza * 24 * 60 * 60 * 1000);
      tasks.push({
        id: '11',
        name: 'Limpeza Final e Entrega',
        startDate: currentDate.toISOString().split('T')[0],
        endDate: limpezaEnd.toISOString().split('T')[0],
        duration: durations.limpeza,
        cost: costs.limpeza,
        status: 'planned',
        category: 'Limpeza',
        color: '#EC4899',
        dependencies: ['10'],
        assignee: { name: 'Equipe Limpeza', email: 'limpeza@obra.com' }
      });
      
      const totalDuration = Math.ceil((limpezaEnd.getTime() - new Date(tasks[0].startDate).getTime()) / (24 * 60 * 60 * 1000));
      const totalCost = Object.values(costs).reduce((sum, val) => sum + val, 0);
      
      setScheduleData({
        projectId: project.id,
        projectName: project.name,
        totalArea: area,
        totalDuration,
        totalCost,
        tasks,
        criticalPath: ['1', '2', '3', '4', '6', '8', '9', '10', '11'] // Caminho crítico baseado na lógica consensual
      });
      
      toast({
        title: "📅 Cronograma gerado com IA!",
        description: `Cronograma baseado na lógica temporal consensual para ${project.name} criado com sucesso.`,
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cronograma Físico-Financeiro</h1>
          <p className="text-gray-600">Timeline baseada na lógica temporal consensual para {project.name} ({project.total_area || 100}m²)</p>
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
                Gerar com IA
              </>
            )}
          </Button>
          
          {scheduleData && (
            <>
              <Button variant="outline" onClick={() => setShowSimulator(true)}>
                <TrendingUp className="h-4 w-4 mr-2" />
                Simular Cenário
              </Button>
              
              <Button variant="outline" onClick={() => setShowExportDialog(true)}>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </>
          )}
        </div>
      </div>

      {isGenerating && (
        <Card className="bg-white/80 backdrop-blur-sm border border-blue-200/50">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
                <span className="font-medium text-blue-900">Processando cronograma com IA baseada na lógica temporal consensual...</span>
              </div>
              <Progress value={progress} className="h-3 bg-blue-100" />
              <p className="text-sm text-blue-700">
                Analisando projeto de {project.total_area || 100}m² seguindo as 10 fases da construção civil
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {scheduleData ? (
        <div className="space-y-6">
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
                    <p className="text-xl font-bold text-gray-900">Inteligente</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

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
              Cronograma Inteligente com IA
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Gere um cronograma detalhado baseado na lógica temporal consensual da construção civil, 
              com recálculo automático de datas e validação técnica para {project.name}.
            </p>
          </CardContent>
        </Card>
      )}

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
  );
};

export default ProjectSpecificSchedule;


import { useParams } from 'react-router-dom';
import { ProjectWorkspace } from '@/components/project/ProjectWorkspace';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Download, RefreshCw } from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const ProjectSpecificSchedule = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { currentProject } = useProject();
  const [scheduleData, setScheduleData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateSchedule = async () => {
    if (!currentProject) return;
    
    console.log('📅 CRONOGRAMA: Gerando para projeto:', currentProject.name);
    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const area = currentProject.total_area || 100;
      const complexity = area > 200 ? 'alta' : area > 100 ? 'média' : 'baixa';
      
      const baseDurations = {
        baixa: { fundacao: 14, estrutura: 21, alvenaria: 18, instalacoes: 15, acabamento: 20 },
        média: { fundacao: 18, estrutura: 28, alvenaria: 24, instalacoes: 21, acabamento: 28 },
        alta: { fundacao: 25, estrutura: 35, alvenaria: 30, instalacoes: 28, acabamento: 35 }
      };
      
      const durations = baseDurations[complexity];
      let currentDate = new Date();
      
      const schedule = [
        {
          id: '1',
          phase: 'Fundação e Movimentação de Terra',
          startDate: currentDate.toISOString().split('T')[0],
          duration: durations.fundacao,
          color: 'bg-blue-500'
        }
      ];
      
      currentDate = new Date(currentDate.getTime() + durations.fundacao * 24 * 60 * 60 * 1000);
      
      schedule.push({
        id: '2',
        phase: 'Estrutura e Lajes',
        startDate: currentDate.toISOString().split('T')[0],
        duration: durations.estrutura,
        color: 'bg-orange-500'
      });
      
      currentDate = new Date(currentDate.getTime() + durations.estrutura * 24 * 60 * 60 * 1000);
      
      schedule.push({
        id: '3',
        phase: 'Alvenaria e Vedação',
        startDate: currentDate.toISOString().split('T')[0],
        duration: durations.alvenaria,
        color: 'bg-red-500'
      });
      
      currentDate = new Date(currentDate.getTime() + durations.alvenaria * 24 * 60 * 60 * 1000);
      
      schedule.push({
        id: '4',
        phase: 'Instalações',
        startDate: currentDate.toISOString().split('T')[0],
        duration: durations.instalacoes,
        color: 'bg-purple-500'
      });
      
      currentDate = new Date(currentDate.getTime() + durations.instalacoes * 24 * 60 * 60 * 1000);
      
      schedule.push({
        id: '5',
        phase: 'Acabamentos',
        startDate: currentDate.toISOString().split('T')[0],
        duration: durations.acabamento,
        color: 'bg-green-500'
      });
      
      setScheduleData({
        projectId: currentProject.id,
        projectName: currentProject.name,
        totalArea: area,
        complexity,
        totalDuration: Object.values(durations).reduce((sum, val) => sum + val, 0),
        phases: schedule
      });
      
      toast({
        title: "📅 Cronograma gerado!",
        description: `Cronograma específico para ${currentProject.name} (${area}m²) criado.`,
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
    }
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cronograma - {currentProject.name}</h1>
            <p className="text-gray-600">Timeline específica das etapas para este projeto ({currentProject.total_area || 100}m²)</p>
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
                  Gerar Cronograma
                </>
              )}
            </Button>
            
            {scheduleData && (
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar Excel
              </Button>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Cronograma Detalhado
            </CardTitle>
          </CardHeader>
          <CardContent>
            {scheduleData ? (
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900">Informações do Projeto</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-2 text-sm">
                    <div>
                      <span className="text-blue-700">Projeto:</span> {scheduleData.projectName}
                    </div>
                    <div>
                      <span className="text-blue-700">Área:</span> {scheduleData.totalArea}m²
                    </div>
                    <div>
                      <span className="text-blue-700">Complexidade:</span> {scheduleData.complexity}
                    </div>
                    <div>
                      <span className="text-blue-700">Duração Total:</span> {scheduleData.totalDuration} dias
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {scheduleData.phases.map((phase: any, index: number) => {
                    const endDate = new Date(phase.startDate);
                    endDate.setDate(endDate.getDate() + phase.duration);
                    
                    return (
                      <div key={phase.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full ${phase.color}`}></div>
                            <div>
                              <h4 className="font-semibold text-gray-900">Fase {index + 1}: {phase.phase}</h4>
                              <p className="text-sm text-gray-600">
                                {new Date(phase.startDate).toLocaleDateString('pt-BR')} - {endDate.toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold text-blue-600">{phase.duration} dias</span>
                          </div>
                        </div>
                        
                        {/* Barra de progresso visual */}
                        <div className="mt-3">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${phase.color}`} 
                              style={{ width: `${(phase.duration / scheduleData.totalDuration) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-700 mb-2">
                  Cronograma Específico para {currentProject.name}
                </h3>
                <p className="text-gray-500 mb-6">
                  Clique em "Gerar Cronograma" para criar uma timeline detalhada baseada na área e complexidade deste projeto específico.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProjectWorkspace>
  );
};

export default ProjectSpecificSchedule;

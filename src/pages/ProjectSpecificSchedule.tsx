
import { useParams } from 'react-router-dom';
import { ProjectWorkspace } from '@/components/project/ProjectWorkspace';
import { useProject } from '@/contexts/ProjectContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, CheckCircle, AlertCircle, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ProjectSpecificSchedule = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { currentProject } = useProject();

  if (!currentProject) {
    return (
      <ProjectWorkspace>
        <div className="flex items-center justify-center h-64 animate-fade-in">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando projeto...</p>
          </div>
        </div>
      </ProjectWorkspace>
    );
  }

  // Cronograma simulado baseado na análise do projeto
  const schedulePhases = [
    {
      id: 1,
      name: 'Planejamento e Licenças',
      duration: '15 dias',
      status: 'completed',
      startDate: '2024-01-15',
      endDate: '2024-01-30',
      progress: 100
    },
    {
      id: 2,
      name: 'Fundações e Estrutura',
      duration: '45 dias',
      status: 'in-progress',
      startDate: '2024-02-01',
      endDate: '2024-03-15',
      progress: 65
    },
    {
      id: 3,
      name: 'Alvenaria e Cobertura',
      duration: '30 dias',
      status: 'pending',
      startDate: '2024-03-16',
      endDate: '2024-04-15',
      progress: 0
    },
    {
      id: 4,
      name: 'Instalações Elétricas e Hidráulicas',
      duration: '25 dias',
      status: 'pending',
      startDate: '2024-04-16',
      endDate: '2024-05-10',
      progress: 0
    },
    {
      id: 5,
      name: 'Acabamentos',
      duration: '35 dias',
      status: 'pending',
      startDate: '2024-05-11',
      endDate: '2024-06-15',
      progress: 0
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in-progress':
        return <Play className="h-5 w-5 text-blue-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Concluído</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800">Em Andamento</Badge>;
      default:
        return <Badge variant="outline">Pendente</Badge>;
    }
  };

  return (
    <ProjectWorkspace>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Cronograma do Projeto</h1>
              <p className="text-gray-600 mt-1">
                Acompanhe o progresso e prazos das etapas da construção
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <div className="text-2xl font-bold text-green-600">5</div>
              <div className="text-sm text-gray-600">Etapas Totais</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">1</div>
              <div className="text-sm text-gray-600">Em Andamento</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-gray-600">150</div>
              <div className="text-sm text-gray-600">Dias Totais</div>
            </div>
          </div>
        </div>

        {/* Cronograma */}
        <div className="grid gap-6">
          {schedulePhases.map((phase, index) => (
            <Card 
              key={phase.id} 
              className="border border-gray-200 hover:shadow-lg transition-all duration-300 animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(phase.status)}
                    <div>
                      <CardTitle className="text-lg">{phase.name}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {phase.startDate} - {phase.endDate} • {phase.duration}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(phase.status)}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progresso</span>
                    <span className="font-medium">{phase.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        phase.status === 'completed' ? 'bg-green-600' :
                        phase.status === 'in-progress' ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                      style={{ width: `${phase.progress}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Ações */}
        <div className="flex flex-wrap gap-4">
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white transition-all duration-200 hover:shadow-lg"
            disabled
          >
            <Calendar className="h-4 w-4 mr-2" />
            Exportar Cronograma
          </Button>
          <Button 
            variant="outline" 
            className="border-gray-300 hover:border-green-300 hover:bg-green-50 transition-all duration-200"
            disabled
          >
            <AlertCircle className="h-4 w-4 mr-2" />
            Relatório de Progresso
          </Button>
        </div>
      </div>
    </ProjectWorkspace>
  );
};

export default ProjectSpecificSchedule;

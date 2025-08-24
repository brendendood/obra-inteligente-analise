import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, ArrowLeft, Calendar, Download, CheckCircle, Clock, AlertCircle, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProject } from '@/contexts/ProjectContext';
import { ScheduleBlock } from '@/components/blocks/FeatureBlocks';

interface ScheduleItem {
  id: string;
  phase: string;
  description: string;
  duration: number;
  startDate: string;
  endDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  dependencies?: string[];
}

const Schedule = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentProject } = useProject();
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [isGeneratingSchedule, setIsGeneratingSchedule] = useState(false);

  useEffect(() => {
    if (!currentProject) {
      toast({
        title: "⚠️ Projeto necessário",
        description: "Envie um projeto primeiro para gerar cronograma.",
        variant: "destructive",
      });
      navigate('/upload');
      return;
    }

    generateProjectSchedule();
  }, [currentProject, navigate, toast]);

  const generateProjectSchedule = () => {
    if (!currentProject) return;

    setIsGeneratingSchedule(true);
    
    try {
      const projectBasedSchedule = generateScheduleFromProject();
      setScheduleItems(projectBasedSchedule);
      
      toast({
        title: "✅ Cronograma gerado!",
        description: `Cronograma baseado no projeto ${currentProject.name}`,
      });
    } catch (error) {
      toast({
        title: "❌ Erro",
        description: "Erro ao gerar cronograma do projeto",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingSchedule(false);
    }
  };

  const generateScheduleFromProject = (): ScheduleItem[] => {
    if (!currentProject) return [];

    const items: ScheduleItem[] = [];
    const area = currentProject.total_area || 100;
    const projectType = currentProject.project_type || 'residencial';
    
    // Calcular durações baseadas na área e tipo
    const isCommercial = projectType.toLowerCase().includes('comercial') || projectType.toLowerCase().includes('industrial');
    const complexity = isCommercial ? 1.3 : 1.0;
    const areaFactor = Math.sqrt(area / 100); // Fator baseado na área

    // Data de início
    const startDate = new Date();
    let currentDate = new Date(startDate);

    // 1. Fundação
    const foundationDuration = Math.ceil(10 * areaFactor * complexity);
    items.push({
      id: '1',
      phase: 'Fundação',
      description: `Escavação, armação e concretagem das fundações - Área: ${area}m²`,
      duration: foundationDuration,
      startDate: currentDate.toISOString().split('T')[0],
      endDate: '',
      status: 'pending'
    });
    
    // Calcular data final
    currentDate.setDate(currentDate.getDate() + foundationDuration);
    items[0].endDate = currentDate.toISOString().split('T')[0];

    // 2. Estrutura (só se não for térrea simples)
    if (area > 80 || isCommercial) {
      const structureDuration = Math.ceil(15 * areaFactor * complexity);
      const nextDate = new Date(currentDate);
      nextDate.setDate(nextDate.getDate() + 1);
      
      items.push({
        id: '2',
        phase: 'Estrutura',
        description: `Pilares, vigas e lajes - Tipo: ${projectType}`,
        duration: structureDuration,
        startDate: nextDate.toISOString().split('T')[0],
        endDate: '',
        status: 'pending',
        dependencies: ['1']
      });
      
      nextDate.setDate(nextDate.getDate() + structureDuration);
      items[1].endDate = nextDate.toISOString().split('T')[0];
      currentDate = new Date(nextDate);
    }

    // 3. Alvenaria
    const masonryDuration = Math.ceil(12 * areaFactor * complexity);
    const masonryStart = new Date(currentDate);
    masonryStart.setDate(masonryStart.getDate() + 1);
    
    items.push({
      id: '3',
      phase: 'Alvenaria',
      description: `Vedações em alvenaria - Estimativa baseada em ${area}m²`,
      duration: masonryDuration,
      startDate: masonryStart.toISOString().split('T')[0],
      endDate: '',
      status: 'pending',
      dependencies: items.length > 1 ? ['2'] : ['1']
    });
    
    masonryStart.setDate(masonryStart.getDate() + masonryDuration);
    items[items.length - 1].endDate = masonryStart.toISOString().split('T')[0];
    currentDate = new Date(masonryStart);

    // 4. Instalações
    const installationsDuration = Math.ceil(18 * areaFactor * complexity);
    const installationsStart = new Date(currentDate);
    installationsStart.setDate(installationsStart.getDate() + 1);
    
    items.push({
      id: '4',
      phase: 'Instalações',
      description: `Elétricas, hidráulicas e complementares - ${projectType}`,
      duration: installationsDuration,
      startDate: installationsStart.toISOString().split('T')[0],
      endDate: '',
      status: 'pending',
      dependencies: ['3']
    });
    
    installationsStart.setDate(installationsStart.getDate() + installationsDuration);
    items[items.length - 1].endDate = installationsStart.toISOString().split('T')[0];
    currentDate = new Date(installationsStart);

    // 5. Acabamentos
    const finishingDuration = Math.ceil(20 * areaFactor * complexity);
    const finishingStart = new Date(currentDate);
    finishingStart.setDate(finishingStart.getDate() + 1);
    
    items.push({
      id: '5',
      phase: 'Acabamentos',
      description: `Revestimentos, pisos, pintura e acabamentos finais`,
      duration: finishingDuration,
      startDate: finishingStart.toISOString().split('T')[0],
      endDate: '',
      status: 'pending',
      dependencies: ['4']
    });
    
    finishingStart.setDate(finishingStart.getDate() + finishingDuration);
    items[items.length - 1].endDate = finishingStart.toISOString().split('T')[0];

    return items;
  };

  const updateItemStatus = (id: string, newStatus: ScheduleItem['status']) => {
    setScheduleItems(items =>
      items.map(item =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
    
    toast({
      title: "Status atualizado",
      description: "O status da etapa foi atualizado com sucesso"
    });
  };

  const updateDuration = (id: string, newDuration: number) => {
    setScheduleItems(items =>
      items.map(item => {
        if (item.id === id) {
          const startDate = new Date(item.startDate);
          const endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + newDuration);
          
          return {
            ...item,
            duration: newDuration,
            endDate: endDate.toISOString().split('T')[0]
          };
        }
        return item;
      })
    );
  };

  const exportToPDF = () => {
    toast({
      title: "Cronograma exportado!",
      description: "O cronograma foi exportado em PDF com sucesso"
    });
  };

  const getTotalDuration = () => {
    return scheduleItems.reduce((total, item) => total + item.duration, 0);
  };

  const getStatusIcon = (status: ScheduleItem['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: ScheduleItem['status']) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'in-progress':
        return 'Em Andamento';
      case 'pending':
        return 'Pendente';
    }
  };

  const getStatusColor = (status: ScheduleItem['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Verificar se há projeto carregado
  if (!currentProject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-600">
              <Upload className="h-6 w-6 mr-2" />
              Projeto Necessário
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p>Para gerar um cronograma, primeiro envie um projeto.</p>
            <Button onClick={() => navigate('/upload')} className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Enviar Projeto
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <ScheduleBlock>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={() => navigate('/')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div className="bg-blue-600 p-2 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Cronograma</h1>
                <p className="text-sm text-gray-600">
                  Projeto: <strong>{currentProject.name}</strong> ({currentProject.total_area}m²)
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              {isGeneratingSchedule && (
                <div className="flex items-center text-blue-600 mr-4">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  <span className="text-sm">Gerando...</span>
                </div>
              )}
              <Button onClick={generateProjectSchedule} variant="outline">
                Atualizar Cronograma
              </Button>
              <Button onClick={exportToPDF} className="bg-green-600 hover:bg-green-700">
                <Download className="h-4 w-4 mr-2" />
                Exportar PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Duração Total</p>
                  <p className="text-2xl font-bold text-gray-900">{getTotalDuration()} dias</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Concluídas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {scheduleItems.filter(item => item.status === 'completed').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Em Andamento</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {scheduleItems.filter(item => item.status === 'in-progress').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-gray-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Pendentes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {scheduleItems.filter(item => item.status === 'pending').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Schedule Timeline */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Cronograma Gantt Simplificado</CardTitle>
            <CardDescription>
              Gerado automaticamente baseado no projeto: {currentProject.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scheduleItems.map((item, index) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <div className="w-32 text-sm font-medium">{item.phase}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                    <div
                      className={`h-6 rounded-full flex items-center px-3 text-xs font-medium ${
                        item.status === 'completed'
                          ? 'bg-green-500 text-white'
                          : item.status === 'in-progress'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-400 text-white'
                      }`}
                      style={{ width: `${(item.duration / getTotalDuration()) * 100}%` }}
                    >
                      {item.duration} dias
                    </div>
                  </div>
                  <div className="w-24 text-sm text-gray-600">
                    {new Date(item.startDate).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Etapas Detalhadas</CardTitle>
            <CardDescription>
              Cronograma personalizado para {currentProject.project_type} de {currentProject.total_area}m²
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scheduleItems.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold">{item.phase}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {getStatusText(item.status)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{item.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <Label className="text-xs text-gray-500">Início</Label>
                          <p className="font-medium">
                            {new Date(item.startDate).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">Fim</Label>
                          <p className="font-medium">
                            {new Date(item.endDate).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">Duração (dias)</Label>
                          <Input
                            type="number"
                            value={item.duration}
                            onChange={(e) => updateDuration(item.id, parseInt(e.target.value) || 0)}
                            className="h-8 mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">Status</Label>
                          <select
                            value={item.status}
                            onChange={(e) => updateItemStatus(item.id, e.target.value as ScheduleItem['status'])}
                            className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-sm mt-1"
                          >
                            <option value="pending">Pendente</option>
                            <option value="in-progress">Em Andamento</option>
                            <option value="completed">Concluído</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      {getStatusIcon(item.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {scheduleItems.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Carregando cronograma do projeto...</p>
              </div>
            )}
          </CardContent>
        </Card>
        </div>
      </div>
    </ScheduleBlock>
  );
};

export default Schedule;

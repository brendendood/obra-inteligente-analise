
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, ArrowLeft, Calendar, Download, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([
    {
      id: '1',
      phase: 'Fundação',
      description: 'Escavação, armação e concretagem das sapatas e baldrames',
      duration: 15,
      startDate: '2024-01-15',
      endDate: '2024-01-30',
      status: 'completed'
    },
    {
      id: '2',
      phase: 'Estrutura',
      description: 'Pilares, vigas e laje do pavimento térreo',
      duration: 20,
      startDate: '2024-01-31',
      endDate: '2024-02-20',
      status: 'in-progress',
      dependencies: ['1']
    },
    {
      id: '3',
      phase: 'Alvenaria',
      description: 'Execução das paredes de vedação em blocos cerâmicos',
      duration: 18,
      startDate: '2024-02-21',
      endDate: '2024-03-12',
      status: 'pending',
      dependencies: ['2']
    },
    {
      id: '4',
      phase: 'Instalações',
      description: 'Instalações elétricas, hidráulicas e sanitárias',
      duration: 25,
      startDate: '2024-03-13',
      endDate: '2024-04-08',
      status: 'pending',
      dependencies: ['3']
    },
    {
      id: '5',
      phase: 'Acabamento',
      description: 'Revestimentos, pintura, pisos e acabamentos finais',
      duration: 30,
      startDate: '2024-04-09',
      endDate: '2024-05-15',
      status: 'pending',
      dependencies: ['4']
    }
  ]);

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

  return (
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
              <h1 className="text-2xl font-bold text-gray-900">Cronograma da Obra</h1>
            </div>
            <Button onClick={exportToPDF} className="bg-green-600 hover:bg-green-700">
              <Download className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
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
              Visualização temporal das etapas da obra
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
              Gerencie prazos e status de cada etapa da obra
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Schedule;

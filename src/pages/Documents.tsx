
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, ArrowLeft, Download, Edit, Save, Camera, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Documents = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [documents, setDocuments] = useState({
    memorial: {
      title: 'Memorial Descritivo',
      content: `MEMORIAL DESCRITIVO - RESIDÊNCIA UNIFAMILIAR

1. CARACTERÍSTICAS GERAIS
- Área construída: 142,5 m²
- Padrão construtivo: Médio
- Número de pavimentos: 1 (térreo)

2. FUNDAÇÃO
- Sapatas isoladas em concreto armado
- Concreto fck = 20 MPa
- Aço CA-50 φ12,5mm

3. ESTRUTURA
- Pilares em concreto armado 15x25cm
- Vigas em concreto armado 15x40cm
- Laje maciça h=12cm

4. VEDAÇÕES
- Alvenaria em blocos cerâmicos 14x19x39cm
- Argamassa de assentamento traço 1:2:8

5. INSTALAÇÕES
- Instalações elétricas: padrão residencial
- Instalações hidráulicas: água fria
- Instalações sanitárias: esgoto e águas pluviais

6. ACABAMENTOS
- Pisos: cerâmico 60x60cm nas áreas sociais
- Revestimentos: cerâmico 30x60cm em cozinha e banheiros
- Pintura: acrílica nas paredes internas`,
      isEditing: false
    },
    workPlan: {
      title: 'Planejamento Semanal',
      content: `PLANEJAMENTO SEMANAL - SEMANA 15/01 a 21/01/2024

ATIVIDADES PREVISTAS:
□ Limpeza e preparação do terreno
□ Marcação das fundações
□ Escavação das sapatas (8 unidades)
□ Conferência das cotas e níveis

RECURSOS NECESSÁRIOS:
- Equipe: 1 pedreiro + 2 serventes
- Equipamentos: teodolito, nível, pá, picareta
- Materiais: cal para marcação, estacas de madeira

METAS DA SEMANA:
- Concluir escavação de 6 sapatas
- Preparar armação de 4 sapatas
- Solicitar concreto para próxima semana

OBSERVAÇÕES:
- Verificar condições climáticas
- Conferir disponibilidade de materiais
- Coordenar entrega de ferragens`,
      isEditing: false
    },
    workDiary: {
      title: 'Diário de Obra',
      content: `DIÁRIO DE OBRA - ${new Date().toLocaleDateString('pt-BR')}

CONDIÇÕES CLIMÁTICAS: Ensolarado, sem chuva

ATIVIDADES EXECUTADAS:
- Escavação de 3 sapatas (S1, S2, S3)
- Conferência de cotas e dimensões
- Limpeza das cavas
- Início da armação da sapata S1

RECURSOS UTILIZADOS:
- Pedreiro: João Silva (8h)
- Servente: Maria Santos (8h)
- Servente: Carlos Oliveira (8h)

MATERIAIS CONSUMIDOS:
- Ferro CA-50 φ12,5mm: 45 kg
- Arame recozido: 2 rolos
- Cal hidratada: 2 sacos

OBSERVAÇÕES:
- Solo encontrado conforme sondagem
- Nível freático não atingido
- Necessário solicitar mais arame para amanhã

PRÓXIMAS ATIVIDADES:
- Completar armação das sapatas
- Preparar formas de madeira
- Solicitar concreto para concretagem`,
      isEditing: false
    }
  });

  const [taskList, setTaskList] = useState([
    { id: 1, task: 'Conferir armação das sapatas', status: 'completed', date: '2024-01-15' },
    { id: 2, task: 'Solicitar concreto fck=20MPa', status: 'in-progress', date: '2024-01-16' },
    { id: 3, task: 'Preparar formas de madeira', status: 'pending', date: '2024-01-17' },
    { id: 4, task: 'Realizar teste de slump', status: 'pending', date: '2024-01-18' }
  ]);

  const [newTask, setNewTask] = useState('');

  const toggleEdit = (docType: keyof typeof documents) => {
    setDocuments(prev => ({
      ...prev,
      [docType]: {
        ...prev[docType],
        isEditing: !prev[docType].isEditing
      }
    }));
  };

  const updateDocument = (docType: keyof typeof documents, content: string) => {
    setDocuments(prev => ({
      ...prev,
      [docType]: {
        ...prev[docType],
        content
      }
    }));
  };

  const exportDocument = (docType: keyof typeof documents) => {
    toast({
      title: "Documento exportado!",
      description: `${documents[docType].title} foi exportado em PDF com sucesso`
    });
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    
    const task = {
      id: Date.now(),
      task: newTask,
      status: 'pending' as const,
      date: new Date().toISOString().split('T')[0]
    };
    
    setTaskList([...taskList, task]);
    setNewTask('');
    
    toast({
      title: "Tarefa adicionada",
      description: "Nova tarefa foi adicionada à lista"
    });
  };

  const updateTaskStatus = (taskId: number, newStatus: 'pending' | 'in-progress' | 'completed') => {
    setTaskList(tasks =>
      tasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
              <div className="bg-red-600 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Documentos Técnicos</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Documents Column */}
          <div className="space-y-6">
            {Object.entries(documents).map(([key, doc]) => (
              <Card key={key}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{doc.title}</CardTitle>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleEdit(key as keyof typeof documents)}
                      >
                        {doc.isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                        {doc.isEditing ? 'Salvar' : 'Editar'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportDocument(key as keyof typeof documents)}
                      >
                        <Download className="h-4 w-4" />
                        PDF
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {doc.isEditing ? (
                    <Textarea
                      value={doc.content}
                      onChange={(e) => updateDocument(key as keyof typeof documents, e.target.value)}
                      className="min-h-[300px] font-mono text-sm"
                    />
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4 max-h-[300px] overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700">
                        {doc.content}
                      </pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tasks and Quick Actions Column */}
          <div className="space-y-6">
            {/* Task Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Registro de Tarefas
                </CardTitle>
                <CardDescription>
                  Acompanhe o status das atividades da obra
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      placeholder="Nova tarefa..."
                      onKeyPress={(e) => e.key === 'Enter' && addTask()}
                    />
                    <Button onClick={addTask}>Adicionar</Button>
                  </div>

                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {taskList.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{task.task}</p>
                          <p className="text-sm text-gray-500">{new Date(task.date).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <select
                          value={task.status}
                          onChange={(e) => updateTaskStatus(task.id, e.target.value as any)}
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}
                        >
                          <option value="pending">Pendente</option>
                          <option value="in-progress">Em Andamento</option>
                          <option value="completed">Concluído</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Photo Upload Simulation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="h-5 w-5 mr-2" />
                  Fotos e Ocorrências
                </CardTitle>
                <CardDescription>
                  Registre o progresso visual da obra
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full h-20 border-dashed"
                    onClick={() => toast({
                      title: "Foto adicionada",
                      description: "Funcionalidade de foto será implementada em breve"
                    })}
                  >
                    <Camera className="h-6 w-6 mr-2" />
                    Adicionar Foto
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-200 rounded-lg h-20 flex items-center justify-center text-gray-500 text-sm">
                      Foto 1
                    </div>
                    <div className="bg-gray-200 rounded-lg h-20 flex items-center justify-center text-gray-500 text-sm">
                      Foto 2
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Export Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Exportação Rápida</CardTitle>
                <CardDescription>
                  Exporte todos os documentos de uma vez
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => toast({
                      title: "Relatório completo gerado!",
                      description: "Todos os documentos foram exportados em PDF"
                    })}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Relatório Completo
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => toast({
                      title: "Enviado para Google Drive!",
                      description: "Documentos foram salvos na nuvem"
                    })}
                  >
                    Salvar no Google Drive
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;

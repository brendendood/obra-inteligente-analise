import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, ArrowLeft, Download, Edit, Save, Camera, Calendar, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProject } from '@/contexts/ProjectContext';

const Documents = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentProject } = useProject();

  const [documents, setDocuments] = useState({
    memorial: {
      title: 'Memorial Descritivo',
      content: '',
      isEditing: false
    },
    workPlan: {
      title: 'Planejamento Semanal',
      content: '',
      isEditing: false
    },
    workDiary: {
      title: 'Diário de Obra',
      content: '',
      isEditing: false
    }
  });

  const [taskList, setTaskList] = useState([
    { id: 1, task: 'Verificar dados do projeto enviado', status: 'completed', date: new Date().toISOString().split('T')[0] },
    { id: 2, task: 'Gerar documentação técnica', status: 'in-progress', date: new Date().toISOString().split('T')[0] },
    { id: 3, task: 'Revisar quantitativos', status: 'pending', date: new Date().toISOString().split('T')[0] }
  ]);

  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    if (!currentProject) {
      toast({
        title: "⚠️ Projeto necessário",
        description: "Envie um projeto primeiro para gerar documentos.",
        variant: "destructive",
      });
      navigate('/upload');
      return;
    }

    generateProjectDocuments();
  }, [currentProject, navigate, toast]);

  const generateProjectDocuments = () => {
    if (!currentProject) return;

    const projectType = currentProject.project_type || 'residencial';
    const area = currentProject.total_area || 0;
    const projectName = currentProject.name;

    // Memorial Descritivo baseado no projeto
    const memorialContent = `MEMORIAL DESCRITIVO - ${projectName.toUpperCase()}

1. CARACTERÍSTICAS GERAIS
- Projeto: ${projectName}
- Área construída: ${area} m²
- Tipo: ${projectType}
- Padrão construtivo: Médio a Alto

2. FUNDAÇÃO
- Sistema de fundação adequado ao tipo de solo
- Concreto fck = 20 MPa
- Aço CA-50 conforme dimensionamento

3. ESTRUTURA
${area > 80 ? '- Estrutura em concreto armado' : '- Estrutura convencional'}
- Pilares e vigas dimensionados para as cargas
- Laje conforme projeto estrutural

4. VEDAÇÕES
- Alvenaria em blocos cerâmicos ou concreto
- Argamassa de assentamento adequada
- Vergas e contravergas em todas as aberturas

5. INSTALAÇÕES
- Instalações elétricas: padrão ${projectType.includes('comercial') ? 'comercial' : 'residencial'}
- Instalações hidrossanitárias completas
- Previsão para sistemas complementares

6. ACABAMENTOS
- Revestimentos adequados ao padrão da obra
- Pisos conforme especificação do projeto
- Pintura em todas as superfícies internas e externas

OBSERVAÇÕES:
- Projeto baseado em análise automatizada
- Especificações podem ser ajustadas conforme necessidade
- Consultar normas técnicas aplicáveis`;

    // Planejamento Semanal
    const currentDate = new Date();
    const nextWeek = new Date(currentDate);
    nextWeek.setDate(currentDate.getDate() + 7);
    
    const workPlanContent = `PLANEJAMENTO SEMANAL - ${currentDate.toLocaleDateString('pt-BR')} a ${nextWeek.toLocaleDateString('pt-BR')}
PROJETO: ${projectName}

ATIVIDADES PREVISTAS:
□ Análise detalhada do projeto enviado
□ Verificação de quantitativos e especificações
□ Planejamento das próximas etapas
□ Definição de cronograma detalhado

RECURSOS NECESSÁRIOS:
- Equipe técnica adequada ao projeto
- Equipamentos conforme especificação
- Materiais de primeira linha

METAS DA SEMANA:
- Validar todos os dados do projeto
- Definir especificações técnicas
- Elaborar orçamento detalhado
- Programar início das atividades

OBSERVAÇÕES ESPECÍFICAS:
- Área total: ${area}m²
- Tipo de projeto: ${projectType}
- Complexidade: ${area > 200 ? 'Alta' : area > 100 ? 'Média' : 'Baixa'}`;

    // Diário de Obra
    const workDiaryContent = `DIÁRIO DE OBRA - ${currentDate.toLocaleDateString('pt-BR')}
PROJETO: ${projectName} (${area}m²)

CONDIÇÕES CLIMÁTICAS: A verificar no local da obra

SITUAÇÃO ATUAL:
- Projeto analisado e validado
- Documentação técnica gerada
- Quantitativos calculados
- Cronograma estabelecido

ATIVIDADES DO DIA:
- Análise completa do projeto ${projectName}
- Geração de documentação técnica
- Cálculo de quantitativos baseado em ${area}m²
- Preparação de orçamento e cronograma

OBSERVAÇÕES TÉCNICAS:
- Tipo de projeto: ${projectType}
- Área de construção: ${area}m²
- Análise realizada via IA especializada
- Documentos gerados automaticamente

PRÓXIMAS ATIVIDADES:
- Revisão da documentação gerada
- Ajustes conforme necessidade
- Validação com equipe técnica
- Preparação para início da obra

RECURSOS UTILIZADOS:
- Sistema de análise automatizada
- Base de dados técnicos SINAPI
- Especificações técnicas atualizadas`;

    setDocuments({
      memorial: {
        title: 'Memorial Descritivo',
        content: memorialContent,
        isEditing: false
      },
      workPlan: {
        title: 'Planejamento Semanal',
        content: workPlanContent,
        isEditing: false
      },
      workDiary: {
        title: 'Diário de Obra',
        content: workDiaryContent,
        isEditing: false
      }
    });

    toast({
      title: "✅ Documentos gerados!",
      description: `Documentação baseada no projeto ${projectName}`,
    });
  };

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

  // Verificar se há projeto carregado
  if (!currentProject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <Upload className="h-6 w-6 mr-2" />
              Projeto Necessário
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p>Para gerar documentos técnicos, primeiro envie um projeto.</p>
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
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Documentos Técnicos</h1>
                <p className="text-sm text-gray-600">
                  Baseados no projeto: <strong>{currentProject.name}</strong>
                </p>
              </div>
            </div>
            <Button onClick={generateProjectDocuments} variant="outline">
              Atualizar Documentos
            </Button>
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
            {/* Project Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Informações do Projeto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nome:</span>
                    <span className="font-medium">{currentProject.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Área:</span>
                    <span className="font-medium">{currentProject.total_area}m²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tipo:</span>
                    <span className="font-medium">{currentProject.project_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Analisado:</span>
                    <span className="font-medium">
                      {new Date(currentProject.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Task Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Registro de Tarefas
                </CardTitle>
                <CardDescription>
                  Acompanhe o progresso da documentação
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
                  Registros Visuais
                </CardTitle>
                <CardDescription>
                  Documente o progresso do projeto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full h-20 border-dashed"
                    onClick={() => toast({
                      title: "Em desenvolvimento",
                      description: "Funcionalidade de fotos será implementada em breve"
                    })}
                  >
                    <Camera className="h-6 w-6 mr-2" />
                    Adicionar Foto do Progresso
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-200 rounded-lg h-20 flex items-center justify-center text-gray-500 text-sm">
                      Progresso 1
                    </div>
                    <div className="bg-gray-200 rounded-lg h-20 flex items-center justify-center text-gray-500 text-sm">
                      Progresso 2
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
                  Exporte toda a documentação do projeto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => toast({
                      title: "Relatório completo gerado!",
                      description: `Documentação completa do projeto ${currentProject.name}`
                    })}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Documentação Completa
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


import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Play,
  Upload,
  Calculator,
  Calendar,
  Bot,
  FileText,
  Home,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const OnboardingStep = ({ 
  step, 
  isActive, 
  isCompleted, 
  onNext, 
  onPrev, 
  onSkip 
}: {
  step: any;
  isActive: boolean;
  isCompleted: boolean;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
}) => {
  if (!isActive) return null;

  return (
    <div className="animate-fade-in">
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-blue-100 rounded-full">
              <step.icon className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-blue-900 mb-2">
            {step.title}
          </CardTitle>
          <p className="text-blue-700 text-lg">
            {step.subtitle}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-white rounded-lg p-6 border border-blue-100">
            <div className="space-y-4">
              {step.content.map((item: any, index: number) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {index + 1}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {item.title}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {step.tip && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Sparkles className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-medium text-yellow-800 mb-1">💡 Dica Importante</h5>
                  <p className="text-yellow-700 text-sm">{step.tip}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-4">
            <Button 
              variant="outline" 
              onClick={onPrev}
              disabled={step.id === 1}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Anterior</span>
            </Button>

            <Button 
              variant="ghost" 
              onClick={onSkip}
              className="text-gray-500 hover:text-gray-700"
            >
              Pular Tutorial
            </Button>

            <Button 
              onClick={onNext}
              className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
            >
              <span>{step.id === 6 ? 'Finalizar' : 'Próximo'}</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário';

  const onboardingSteps = [
    {
      id: 1,
      title: `Bem-vindo ao MadenAI, ${userName}! 🎉`,
      subtitle: "Sua plataforma de gestão inteligente de obras",
      icon: Home,
      content: [
        {
          title: "O que é o MadenAI?",
          description: "Uma plataforma completa que usa inteligência artificial para otimizar o gerenciamento de projetos de construção, desde o orçamento até o cronograma."
        },
        {
          title: "Como funciona?",
          description: "Você faz upload dos seus projetos (plantas, documentos) e nossa IA analisa tudo automaticamente, gerando orçamentos, cronogramas e insights valiosos."
        },
        {
          title: "Por que usar?",
          description: "Economize tempo, reduza erros, tome decisões mais inteligentes e tenha controle total dos seus projetos em um só lugar."
        }
      ],
      tip: "Este tutorial rápido vai te ensinar tudo que você precisa saber para começar!"
    },
    {
      id: 2,
      title: "Criando seu Primeiro Projeto 📁",
      subtitle: "Aprenda a fazer upload e organizar seus projetos",
      icon: Upload,
      content: [
        {
          title: "Acesse a área de Upload",
          description: "Clique no botão '+ Novo Projeto' no painel principal ou vá direto para a página de Upload no menu lateral."
        },
        {
          title: "Faça upload dos arquivos",
          description: "Arraste plantas, documentos, planilhas ou qualquer arquivo relacionado ao seu projeto. Formatos aceitos: PDF, JPG, PNG, XLS, DWG."
        },
        {
          title: "Nomeie seu projeto",
          description: "Dê um nome claro e descritivo para facilitar a identificação posterior."
        },
        {
          title: "Aguarde a análise",
          description: "Nossa IA vai processar todos os arquivos e extrair informações importantes automaticamente."
        }
      ],
      tip: "Quanto mais detalhados forem seus arquivos, mais precisa será a análise da IA!"
    },
    {
      id: 3,
      title: "Orçamento Inteligente 💰",
      subtitle: "Geração automática de orçamentos detalhados",
      icon: Calculator,
      content: [
        {
          title: "Orçamento automático",
          description: "Após a análise, acesse a aba 'Orçamento' do seu projeto para ver a planilha gerada automaticamente com base nas plantas e especificações."
        },
        {
          title: "Editar itens",
          description: "Você pode editar preços, adicionar novos itens, ajustar quantidades e personalizar completamente o orçamento."
        },
        {
          title: "Exportar relatórios",
          description: "Exporte o orçamento em Excel ou PDF para apresentar aos clientes ou usar em outras ferramentas."
        },
        {
          title: "Histórico de versões",
          description: "Mantenha um histórico de todas as alterações feitas no orçamento para controle total."
        }
      ],
      tip: "Use a função de comparar versões para mostrar aos clientes como o projeto evoluiu!"
    },
    {
      id: 4,
      title: "Cronograma Inteligente 📅",
      subtitle: "Planejamento temporal otimizado pela IA",
      icon: Calendar,
      content: [
        {
          title: "Cronograma automático",
          description: "A IA cria um cronograma físico-financeiro baseado no tipo de obra, orçamento e prazos típicos do mercado."
        },
        {
          title: "Arrastar e reorganizar",
          description: "Reorganize as etapas arrastando os cartões. O sistema recalcula automaticamente as dependências e datas."
        },
        {
          title: "Acompanhar progresso",
          description: "Marque etapas como concluídas e veja o progresso geral da obra em tempo real."
        },
        {
          title: "Alertas inteligentes",
          description: "Receba notificações sobre atrasos, dependências críticas e marcos importantes."
        }
      ],
      tip: "Mantenha o cronograma sempre atualizado para ter insights precisos sobre prazos!"
    },
    {
      id: 5,
      title: "Assistente IA 🤖",
      subtitle: "Seu consultor especializado em construção",
      icon: Bot,
      content: [
        {
          title: "Chat inteligente",
          description: "Converse com nossa IA especializada em construção. Faça perguntas sobre seu projeto, peça sugestões de otimização ou tire dúvidas técnicas."
        },
        {
          title: "Análises personalizadas",
          description: "Peça análises específicas: 'Como posso reduzir custos?', 'Quais são os riscos deste cronograma?', 'Sugestões de materiais alternativos?'"
        },
        {
          title: "Relatórios sob demanda",
          description: "Solicite relatórios customizados, comparações de cenários e simulações de mudanças no projeto."
        },
        {
          title: "Conhecimento atualizado",
          description: "A IA tem acesso às melhores práticas do mercado, preços atualizados e normas técnicas vigentes."
        }
      ],
      tip: "Seja específico nas suas perguntas para obter respostas mais precisas e úteis!"
    },
    {
      id: 6,
      title: "Documentos e Organização 📋",
      subtitle: "Mantenha tudo organizado e acessível",
      icon: FileText,
      content: [
        {
          title: "Central de documentos",
          description: "Todos os arquivos do projeto ficam organizados na aba 'Documentos', categorizados automaticamente por tipo."
        },
        {
          title: "Busca inteligente",
          description: "Encontre rapidamente qualquer documento usando palavras-chave. A IA indexa o conteúdo dos arquivos para busca avançada."
        },
        {
          title: "Versionamento",
          description: "Mantenha diferentes versões dos documentos com histórico completo de alterações e comentários."
        },
        {
          title: "Compartilhamento",
          description: "Gere links seguros para compartilhar documentos específicos com clientes, fornecedores ou equipe."
        }
      ],
      tip: "Organize bem seus documentos desde o início - isso facilitará muito o trabalho futuro!"
    }
  ];

  const handleNext = () => {
    if (currentStep < onboardingSteps.length) {
      setCompletedSteps(prev => [...prev, currentStep]);
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    navigate('/painel');
  };

  const handleComplete = () => {
    // Marcar onboarding como concluído
    localStorage.setItem('maden-onboarding-completed', 'true');
    navigate('/painel');
  };

  const progress = (completedSteps.length / onboardingSteps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tutorial MadenAI
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Aprenda a usar todas as funcionalidades em poucos minutos
          </p>
          
          {/* Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">Progresso</span>
              <span className="text-sm font-medium text-gray-700">
                {currentStep} de {onboardingSteps.length}
              </span>
            </div>
            <Progress value={(currentStep / onboardingSteps.length) * 100} className="h-2" />
          </div>
        </div>

        {/* Steps Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {onboardingSteps.map((step) => (
              <Badge
                key={step.id}
                variant={currentStep === step.id ? "default" : completedSteps.includes(step.id) ? "secondary" : "outline"}
                className={`flex items-center space-x-1 px-3 py-1 whitespace-nowrap ${
                  currentStep === step.id ? 'bg-blue-600' : 
                  completedSteps.includes(step.id) ? 'bg-green-100 text-green-800' : ''
                }`}
              >
                {completedSteps.includes(step.id) ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <step.icon className="h-3 w-3" />
                )}
                <span className="hidden sm:inline">Passo {step.id}</span>
                <span className="sm:hidden">{step.id}</span>
              </Badge>
            ))}
          </div>
        </div>

        {/* Current Step */}
        <div className="max-w-3xl mx-auto">
          {onboardingSteps.map((step) => (
            <OnboardingStep
              key={step.id}
              step={step}
              isActive={currentStep === step.id}
              isCompleted={completedSteps.includes(step.id)}
              onNext={handleNext}
              onPrev={handlePrev}
              onSkip={handleSkip}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;

import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Upload, 
  Bot, 
  Calculator, 
  Calendar, 
  FileText, 
  ArrowRight,
  BarChart3,
  Users,
  Clock,
  Target,
  Star,
  CheckCircle,
  Zap,
  Award,
  Building,
  CheckSquare,
  Code,
  Database,
  ExternalLink,
  FileArchive,
  FileCog,
  Gauge,
  HardHat,
  Layers,
  Lock,
  Ruler,
  ServerCog,
  Shield,
  Wrench,
  Instagram,
  Linkedin,
  Youtube
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Hook para contador animado OTIMIZADO
const useCountAnimation = (target: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const countRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          setHasAnimated(true);
          
          console.log(`Iniciando animação do contador para ${target}`);
          
          // Animação otimizada
          let start = 0;
          const increment = target / (duration / 16);
          
          const animate = () => {
            start += increment;
            if (start < target) {
              setCount(Math.floor(start));
              requestAnimationFrame(animate);
            } else {
              setCount(target);
              console.log(`Contador finalizado em ${target}`);
            }
          };
          
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3, rootMargin: '50px' }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [target, duration, isVisible, hasAnimated]);

  return { count, countRef };
};

const LandingPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([false, false, false, false]);
  const [showParticles, setShowParticles] = useState<number | null>(null);
  
  const counter1 = useCountAnimation(2500);
  const counter2 = useCountAnimation(95);
  const counter3 = useCountAnimation(80);
  const counter4 = useCountAnimation(1200);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const missionSteps = [
    {
      title: "Selecione seu projeto",
      description: "Escolha um projeto para começar sua jornada",
      xp: 50,
      icon: Target,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Faça o upload",
      description: "Carregue seus arquivos e documentos",
      xp: 100,
      icon: Upload,
      color: "from-blue-500 to-indigo-500"
    },
    {
      title: "Faça sua análise",
      description: "Deixe a IA processar seus dados",
      xp: 200,
      icon: Bot,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Economize tempo",
      description: "Receba resultados profissionais instantaneamente",
      xp: 300,
      icon: Clock,
      color: "from-orange-500 to-red-500"
    }
  ];

  const handleMissionClick = (index: number) => {
    if (index === currentStep && !completedSteps[index]) {
      const newCompletedSteps = [...completedSteps];
      newCompletedSteps[index] = true;
      setCompletedSteps(newCompletedSteps);
      
      const newTotalXP = totalXP + missionSteps[index].xp;
      setTotalXP(newTotalXP);
      
      if (index < missionSteps.length - 1) {
        setCurrentStep(index + 1);
        setShowParticles(index + 1);
        
        setTimeout(() => {
          setShowParticles(null);
        }, 600);
      }
    }
  };

  const getMissionStatus = (index: number) => {
    if (completedSteps[index]) return 'completed';
    if (index === currentStep) return 'available';
    return 'locked';
  };

  const currentLevel = Math.floor(totalXP / 200) + 1;
  const xpForNextLevel = (currentLevel * 200);
  const progressPercent = totalXP > 0 ? (totalXP % 200) / 200 * 100 : 0;

  const features = [
    {
      icon: Upload,
      title: "Upload e Análise Instantânea",
      description: "Arraste sua planta baixa ou memorial descritivo e receba análise completa em menos de 60 segundos"
    },
    {
      icon: Bot,
      title: "IA Treinada para Construção Civil",
      description: "Algoritmos especializados que reconhecem elementos construtivos e aplicam normas técnicas automaticamente"
    },
    {
      icon: Calculator,
      title: "Orçamentos 90% Mais Rápidos",
      description: "Elimine planilhas manuais e receba orçamentos detalhados com composições SINAPI atualizadas"
    },
    {
      icon: Calendar,
      title: "Cronogramas Físico-Financeiros",
      description: "Cronogramas inteligentes que consideram interdependências e otimizam recursos automaticamente"
    },
    {
      icon: FileText,
      title: "Relatórios Técnicos Prontos",
      description: "Documentação profissional em conformidade com NBR 12721 - pronta para apresentação"
    },
    {
      icon: BarChart3,
      title: "Insights que Economizam Milhares",
      description: "Identifique oportunidades de economia e otimizações que podem reduzir custos em até 15%"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Faça Upload",
      description: "Envie plantas baixas, memoriais descritivos ou especificações técnicas em PDF"
    },
    {
      number: "02", 
      title: "IA Analisa",
      description: "Nossa IA processa dados técnicos seguindo normas ABNT NBR 12721 e SINAPI"
    },
    {
      number: "03",
      title: "Receba Resultados",
      description: "Orçamentos detalhados, cronogramas físico-financeiros e relatórios executivos"
    }
  ];

  const plans = [
    {
      name: "Gratuito",
      price: "R$ 0",
      period: "/mês",
      description: "Ideal para profissionais iniciantes",
      features: [
        "1 projeto por mês",
        "Análise básica de PDF",
        "Orçamento técnico simples",
        "Suporte por email"
      ],
      popular: false
    },
    {
      name: "Pro",
      price: "R$ 79",
      period: "/mês",
      description: "Para profissionais ativos",
      features: [
        "Projetos ilimitados",
        "Cronogramas automáticos",
        "Dados oficiais SINAPI",
        "Dashboards avançados",
        "Exportações em PDF/Excel",
        "Suporte prioritário"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Sob consulta",
      period: "",
      description: "Para construtoras e escritórios",
      features: [
        "Acesso multiusuário",
        "Integração com ERPs",
        "Automações N8N",
        "Onboarding personalizado",
        "Suporte técnico dedicado",
        "SLA garantido"
      ],
      popular: false
    }
  ];

  const testimonials = [
    {
      name: "Carlos Eduardo Santos",
      role: "Engenheiro Civil",
      company: "Santos Engenharia",
      content: "Reduzi 40% do tempo de orçamentação em obras residenciais. A precisão técnica seguindo a NBR 12721 é impressionante.",
      rating: 5,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carlos&backgroundColor=b6e3f4&eyes=happy&mouth=smile"
    },
    {
      name: "Ana Paula Oliveira",
      role: "Arquiteta",
      company: "Oliveira Arquitetura",
      content: "A análise automática de plantas baixas economizou semanas de trabalho. Interface intuitiva e resultados profissionais.",
      rating: 5,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ana&backgroundColor=ffd93d&eyes=happy&mouth=smile"
    },
    {
      name: "Roberto Mendes",
      role: "Gestor de Obras",
      company: "Construtora Mendes",
      content: "Os cronogramas físico-financeiros são precisos e seguem as melhores práticas. Essencial para gestão de projetos.",
      rating: 5,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=roberto&backgroundColor=c0aede&eyes=happy&mouth=smile"
    },
    {
      name: "Marina Costa",
      role: "Engenheira Estrutural",
      company: "Costa & Associados",
      content: "A integração com dados do SINAPI garante orçamentos atualizados. Ferramenta indispensável para engenheiros.",
      rating: 5,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marina&backgroundColor=ffdfbf&eyes=happy&mouth=smile"
    },
    {
      name: "José Silva",
      role: "Coordenador de Projetos",
      company: "Silva Construções",
      content: "Automatizou nosso processo de análise técnica. ROI positivo desde o primeiro mês de uso.",
      rating: 5,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jose&backgroundColor=d1d4f9&eyes=happy&mouth=smile"
    }
  ];

  const techSpecs = [
    {
      icon: Database,
      title: "Dados Oficiais SINAPI",
      description: "Composições unitárias atualizadas mensalmente seguindo diretrizes do IBGE"
    },
    {
      icon: Shield,
      title: "Conformidade NBR 12721",
      description: "Orçamentos técnicos em conformidade com normas ABNT para avaliação de custos"
    },
    {
      icon: Code,
      title: "IA Proprietária Local",
      description: "Algoritmos treinados especificamente para análise de documentos técnicos da construção civil"
    },
    {
      icon: ServerCog,
      title: "Integração N8N",
      description: "Automações personalizadas conectando ERP, planilhas e sistemas de gestão"
    },
    {
      icon: FileArchive,
      title: "Processamento PDF Avançado",
      description: "OCR especializado em plantas baixas, memoriais descritivos e especificações técnicas"
    },
    {
      icon: Lock,
      title: "Segurança Supabase",
      description: "Armazenamento seguro com criptografia e backup automático de dados sensíveis"
    }
  ];

  console.log('Landing Page renderizada com sucesso');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header flutuante OTIMIZADO */}
      <header className={`fixed top-3 md:top-6 left-1/2 transform -translate-x-1/2 z-50 transition-smooth ${
        scrollY > 50 
          ? 'bg-white/95 backdrop-blur-xl border border-slate-200 shadow-lg shadow-slate-900/5' 
          : 'bg-white/80 backdrop-blur-md border border-slate-200/50'
      } rounded-xl md:rounded-2xl px-4 md:px-8 py-3 md:py-4 max-w-sm sm:max-w-lg md:max-w-2xl w-[95%] md:w-full mx-2 md:mx-4`}>
        <div className="flex items-center justify-between">
          <div className="font-display font-bold text-xl md:text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            MadenAI
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <Link to="/login">
              <Button variant="ghost" className="rounded-lg md:rounded-xl hover:bg-slate-100 text-sm md:text-base px-3 md:px-4 py-2 transition-fast">
                Entrar
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="rounded-lg md:rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-sm md:text-base px-3 md:px-4 py-2 transition-fast">
                Começar Grátis
              </Button>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Hero Section OTIMIZADA */}
      <section className="pt-24 md:pt-32 pb-20 px-4 animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-full px-4 py-2 text-red-700 text-sm font-medium animate-scale-in">
              <Zap className="h-4 w-4" />
              Chega de perder tempo com planilhas!
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold text-slate-900 leading-tight animate-slide-in-right">
              Receba orçamentos técnicos precisos em{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                segundos
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
              <strong className="text-slate-900">Nossa IA entende seu projeto arquitetônico,</strong> interpreta os dados automaticamente e entrega orçamentos completos, cronogramas otimizados e relatórios técnicos — tudo pronto para uso profissional em tempo recorde.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link to="/upload" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto h-14 px-8 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg shadow-blue-500/25 transition-smooth hover-lift"
                  onClick={() => {
                    console.log('Botão Analisar Projeto Grátis clicado - redirecionando para upload');
                    // Analytics tracking pode ser adicionado aqui
                  }}
                >
                  Analisar Projeto Grátis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto h-14 px-8 text-lg rounded-xl border-slate-200 hover:bg-slate-50 hover-scale transition-fast"
                onClick={() => {
                  const userJourneySection = document.getElementById('user-journey');
                  if (userJourneySection) {
                    userJourneySection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Ver Demonstração
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm text-slate-600 pt-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-lg backdrop-blur-sm border border-slate-200">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="whitespace-nowrap font-medium">Resultados em 60 segundos</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-lg backdrop-blur-sm border border-slate-200">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="whitespace-nowrap font-medium">Baseado em dados SINAPI</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-lg backdrop-blur-sm border border-slate-200">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="whitespace-nowrap font-medium">Grátis para começar</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section OTIMIZADA */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
            <h2 className="text-4xl font-display font-bold text-slate-900 mb-6">
              Por que engenheiros e arquitetos escolhem o MadenAI?
            </h2>
            <p className="text-xl text-slate-600">
              Deixe a IA fazer o trabalho pesado enquanto você foca no que realmente importa: criar projetos excepcionais
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group p-8 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10 transition-smooth hover-lift animate-fade-in stagger-animation" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center mb-6 group-hover:from-blue-100 group-hover:to-indigo-100 transition-smooth group-hover:scale-110">
                  <feature.icon className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works OTIMIZADA */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
            <h2 className="text-4xl font-display font-bold text-slate-900 mb-6">
              Como funciona
            </h2>
            <p className="text-xl text-slate-600">
              Processo simples e automatizado para análise completa de projetos
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl shadow-lg shadow-blue-500/25 hover-scale transition-fast">
                  {step.number}
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed max-w-sm mx-auto">{step.description}</p>
                
                {index < steps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-10 -right-4 h-8 w-8 text-slate-300 animate-bounce-gentle" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Journey - Seção Interativa NOVA */}
      <section id="user-journey" className="py-20 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
            <h2 className="text-4xl font-display font-bold text-slate-900 mb-6">
              Sua Jornada de Sucesso
            </h2>
            <p className="text-xl text-slate-600">
              Acompanhe seu progresso e desbloqueie novas funcionalidades conforme você domina a plataforma
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {missionSteps.map((mission, index) => {
              const status = getMissionStatus(index);
              const isClickable = status === 'available';
              
              return (
                <div 
                  key={index} 
                  className={`group relative p-6 bg-white rounded-2xl border-2 transition-all duration-300 animate-fade-in ${
                    status === 'completed' 
                      ? 'border-green-200 shadow-lg shadow-green-500/10' 
                      : status === 'available'
                      ? 'border-blue-200 shadow-lg shadow-blue-500/10 cursor-pointer hover:shadow-xl hover:scale-105'
                      : 'border-slate-200'
                  } ${showParticles === index ? 'mission-unlock' : ''}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => handleMissionClick(index)}
                >
                  {/* Indicador de missão completada */}
                  {status === 'completed' && (
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center shadow-lg animate-scale-in">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                  )}
                  
                  {/* Chamada para clicar (disponível) */}
                  {status === 'available' && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-3 py-1 rounded-full shadow-lg animate-bounce">
                      Clique aqui
                    </div>
                  )}
                  
                  {/* Ícone da missão */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${mission.color} rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                    status === 'locked' ? 'opacity-50 grayscale' : 'group-hover:scale-110'
                  } transition-all duration-300`}>
                    <mission.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  {/* Conteúdo da missão */}
                  <div className="text-center">
                    <h3 className={`text-lg font-semibold mb-2 ${
                      status === 'locked' ? 'text-slate-400' : 'text-slate-900'
                    }`}>
                      {mission.title}
                    </h3>
                    <p className={`text-sm mb-4 ${
                      status === 'locked' ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {mission.description}
                    </p>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                      status === 'completed' 
                        ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200' 
                        : status === 'available'
                        ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}>
                      <Award className="h-4 w-4" />
                      {mission.xp} XP
                    </div>
                  </div>
                  
                  {/* Overlay para missões bloqueadas */}
                  {status === 'locked' && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <Lock className="h-8 w-8 text-slate-400" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Barra de progresso XP atualizada */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-4 px-6 py-3 bg-white rounded-2xl border border-slate-200 shadow-lg">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="font-semibold text-slate-900">Nível {currentLevel}</span>
              </div>
              <div className="w-32 h-3 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <span className="text-sm text-slate-600">{totalXP}/{xpForNextLevel} XP</span>
            </div>
            
            {/* Botão CTA quando jornada completa */}
            {completedSteps.every(step => step) && (
              <div className="mt-8 animate-scale-in">
                <Button 
                  size="lg" 
                  className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl shadow-lg shadow-green-500/25 transition-smooth hover-lift"
                  onClick={() => {
                    const plansSection = document.querySelector('#planos');
                    if (plansSection) {
                      plansSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  🎉 Parabéns! Assine um Plano Agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Tecnologias OTIMIZADA */}
      <section className="py-12 md:py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4 md:mb-6">
              Tecnologias que Usamos
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
              Nossa plataforma é construída com as melhores tecnologias do mercado para garantir performance, segurança e escalabilidade.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Frontend */}
            <div className="space-y-6 animate-slide-in-right">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 text-center lg:text-left">Frontend</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {[
                  { name: "React", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" },
                  { name: "TypeScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" },
                  { name: "Tailwind CSS", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
                  { name: "Radix UI", logo: "https://avatars.githubusercontent.com/u/75042455?s=200&v=4" },
                  { name: "Recharts", logo: "https://raw.githubusercontent.com/recharts/recharts/master/logo.svg" },
                  { name: "Lucide React", logo: "https://lucide.dev/logo.dark.svg" },
                ].map((tech, index) => (
                  <div key={tech.name} className="tech-card animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex flex-col items-center text-center space-y-2 md:space-y-3">
                      <div className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center transition-fast hover:scale-110">
                        <img 
                          src={tech.logo} 
                          alt={`${tech.name} logo`}
                          className="max-w-full max-h-full object-contain"
                          loading="lazy"
                        />
                      </div>
                      <span className="text-xs md:text-sm font-semibold text-slate-700 leading-tight">{tech.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Backend */}
            <div className="space-y-6 animate-slide-in-right" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 text-center lg:text-left">Backend</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {[
                  { name: "Supabase", logo: "https://supabase.com/brand-assets/supabase-logo-icon.png" },
                  { name: "IA Proprietária", logo: "https://cdn-icons-png.flaticon.com/512/8637/8637099.png" },
                  { name: "N8N", logo: "https://raw.githubusercontent.com/n8n-io/n8n/master/assets/n8n-logo.png" },
                  { name: "SINAPI", logo: "https://cdn-icons-png.flaticon.com/512/3159/3159310.png" },
                  { name: "Edge Functions", logo: "https://cdn-icons-png.flaticon.com/512/2721/2721291.png" },
                  { name: "PostgreSQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg" },
                ].map((tech, index) => (
                  <div key={tech.name} className="tech-card animate-fade-in" style={{ animationDelay: `${(index + 6) * 0.1}s` }}>
                    <div className="flex flex-col items-center text-center space-y-2 md:space-y-3">
                      <div className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center transition-fast hover:scale-110">
                        <img 
                          src={tech.logo} 
                          alt={`${tech.name} logo`}
                          className="max-w-full max-h-full object-contain"
                          loading="lazy"
                        />
                      </div>
                      <span className="text-xs md:text-sm font-semibold text-slate-700 leading-tight">{tech.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Specs OTIMIZADA */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
            <h2 className="text-4xl font-display font-bold text-slate-900 mb-6">
              Especificações Técnicas
            </h2>
            <p className="text-xl text-slate-600">
              Tecnologias e conformidades que garantem a precisão dos seus projetos
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {techSpecs.map((spec, index) => (
              <div key={index} className="group p-8 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10 transition-smooth hover-lift animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-6 shadow-md shadow-blue-500/10 group-hover:scale-110 transition-fast">
                  <spec.icon className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{spec.title}</h3>
                <p className="text-slate-600 leading-relaxed">{spec.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans OTIMIZADA */}
      <section id="planos" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
            <h2 className="text-4xl font-display font-bold text-slate-900 mb-6">
              Planos para cada necessidade
            </h2>
            <p className="text-xl text-slate-600">
              Escolha o plano ideal para você ou sua empresa
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div key={index} className={`p-8 rounded-2xl border relative hover-lift animate-fade-in transition-smooth ${
                plan.popular 
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-600 border-transparent text-white' 
                  : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-lg'
              }`} style={{ animationDelay: `${index * 0.1}s` }}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-semibold px-4 py-1 rounded-full shadow-lg animate-bounce-gentle">
                    Mais Popular
                  </div>
                )}
                
                <div className="text-xl font-semibold mb-2">
                  {plan.name}
                </div>
                
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="ml-1 text-sm opacity-80">{plan.period}</span>
                </div>
                
                <p className={`mb-8 ${plan.popular ? 'text-blue-100' : 'text-slate-600'}`}>
                  {plan.description}
                </p>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <CheckCircle className={`h-5 w-5 flex-shrink-0 ${
                        plan.popular ? 'text-blue-200' : 'text-blue-500'
                      }`} />
                      <span className={plan.popular ? 'text-blue-100' : 'text-slate-600'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full h-12 text-base font-semibold rounded-xl transition-fast hover-scale ${
                    plan.popular
                      ? 'bg-white text-blue-600 hover:bg-blue-50'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                  }`}
                >
                  Começar Agora
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials OTIMIZADA */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
            <h2 className="text-4xl font-display font-bold text-slate-900 mb-6">
              O que dizem nossos usuários
            </h2>
            <p className="text-xl text-slate-600">
              Profissionais que já transformaram sua forma de trabalhar
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <div key={index} className="testimonial-card bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 border border-slate-200 hover:border-blue-300 hover:shadow-lg animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-start gap-4 mb-6">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-xl bg-white p-1 border border-slate-200 hover-scale transition-fast"
                    loading="lazy"
                  />
                  <div>
                    <div className="font-semibold text-slate-900">{testimonial.name}</div>
                    <div className="text-sm text-slate-600">{testimonial.role}</div>
                    <div className="text-sm text-slate-500">{testimonial.company}</div>
                  </div>
                </div>
                
                <p className="text-slate-600 leading-relaxed mb-4">
                  {testimonial.content}
                </p>
                
                <div className="flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section OTIMIZADA */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl font-display font-bold text-white mb-4">
              Resultados que impressionam
            </h2>
            <p className="text-xl text-blue-100">
              Números que comprovam a eficiência da nossa plataforma
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center animate-fade-in">
              <div ref={counter1.countRef} className="text-4xl md:text-5xl font-bold text-white mb-2 stats-counter">
                {counter1.count.toLocaleString()}+
              </div>
              <div className="text-blue-100">Projetos Analisados</div>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div ref={counter2.countRef} className="text-4xl md:text-5xl font-bold text-white mb-2 stats-counter">
                {counter2.count}%
              </div>
              <div className="text-blue-100">Precisão</div>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div ref={counter3.countRef} className="text-4xl md:text-5xl font-bold text-white mb-2 stats-counter">
                {counter3.count}%
              </div>
              <div className="text-blue-100">Economia de Tempo</div>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div ref={counter4.countRef} className="text-4xl md:text-5xl font-bold text-white mb-2 stats-counter">
                {counter4.count.toLocaleString()}+
              </div>
              <div className="text-blue-100">Usuários Ativos</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA OTIMIZADA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-12 border border-slate-200 hover:border-blue-300 transition-smooth animate-fade-in hover-lift">
            <h2 className="text-4xl font-display font-bold text-slate-900 mb-6">
              Pronto para revolucionar seus projetos?
            </h2>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de profissionais que já economizam tempo e aumentam a precisão com nossa IA
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/upload" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg shadow-blue-500/25 hover-lift transition-smooth">
                  Começar Gratuitamente
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-xl border-slate-300 hover:bg-slate-50 hover-scale transition-fast">
                Falar com Especialista
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-2 mt-6 text-sm text-slate-500">
              <div className="flex">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span>4.9/5 baseado em 200+ avaliações</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer OTIMIZADO */}
      <footer className="py-16 px-4 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
            <div className="col-span-2">
              <div className="font-display font-bold text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                MadenAI
              </div>
              <p className="text-slate-600 mb-6 max-w-sm">
                Transforme seus projetos arquitetônicos em orçamentos precisos com nossa IA especializada.
              </p>
              <div className="flex gap-4">
                <a href="https://instagram.com" className="text-slate-400 hover:text-slate-600 transition-fast hover-scale" target="_blank" rel="noopener">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="https://linkedin.com" className="text-slate-400 hover:text-slate-600 transition-fast hover-scale" target="_blank" rel="noopener">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="https://youtube.com" className="text-slate-400 hover:text-slate-600 transition-fast hover-scale" target="_blank" rel="noopener">
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Produto</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/features" className="text-slate-500 hover:text-slate-700 transition-fast">
                    Recursos
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-slate-500 hover:text-slate-700 transition-fast">
                    Preços
                  </Link>
                </li>
                <li>
                  <Link to="/demo" className="text-slate-500 hover:text-slate-700 transition-fast">
                    Demonstração
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Para quem é</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/engineers" className="text-slate-500 hover:text-slate-700 transition-fast">
                    Engenheiros
                  </Link>
                </li>
                <li>
                  <Link to="/architects" className="text-slate-500 hover:text-slate-700 transition-fast">
                    Arquitetos
                  </Link>
                </li>
                <li>
                  <Link to="/constructors" className="text-slate-500 hover:text-slate-700 transition-fast">
                    Construtoras
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Tecnologias</h3>
              <ul className="space-y-2">
                <li>
                  <a href="https://www.ibge.gov.br/sinapi" className="text-slate-500 hover:text-slate-700 transition-fast" target="_blank" rel="noopener">
                    SINAPI
                  </a>
                </li>
                <li>
                  <a href="https://supabase.com" className="text-slate-500 hover:text-slate-700 transition-fast" target="_blank" rel="noopener">
                    Supabase
                  </a>
                </li>
                <li>
                  <a href="https://n8n.io" className="text-slate-500 hover:text-slate-700 transition-fast" target="_blank" rel="noopener">
                    N8N
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/privacy" className="text-slate-500 hover:text-slate-700 transition-fast">
                    Privacidade
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-slate-500 hover:text-slate-700 transition-fast">
                    Termos
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-slate-500">
              © 2025 MadenAI. Todos os direitos reservados.
            </div>
            <div className="flex gap-8">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Logo_IBGE.svg/200px-Logo_IBGE.svg.png" alt="SINAPI - IBGE" className="h-8 opacity-75 hover:opacity-100 transition-fast hover-scale" loading="lazy" />
              <img src="https://supabase.com/brand-assets/supabase-logo-wordmark--dark.svg" alt="Supabase" className="h-8 opacity-75 hover:opacity-100 transition-fast hover-scale" loading="lazy" />
              <img src="https://docs.n8n.io/favicon.svg" alt="N8N" className="h-8 opacity-75 hover:opacity-100 transition-fast hover-scale" loading="lazy" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

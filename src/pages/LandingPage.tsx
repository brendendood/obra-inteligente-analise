
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
  Youtube,
  Mail,
  Phone
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-indigo-600/20"></div>
      
      {/* Header flutuante modernizado */}
      <header className={`fixed top-3 md:top-6 left-1/2 transform -translate-x-1/2 z-50 transition-smooth ${
        scrollY > 50 
          ? 'bg-slate-900/95 backdrop-blur-xl border border-slate-700 shadow-xl' 
          : 'bg-slate-900/80 backdrop-blur-md border border-slate-700/50'
      } rounded-xl md:rounded-2xl px-4 md:px-8 py-3 md:py-4 max-w-sm sm:max-w-lg md:max-w-2xl w-[95%] md:w-full mx-2 md:mx-4`}>
        <div className="flex items-center justify-between">
          <div className="font-display font-bold text-xl md:text-2xl bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
            MadenAI
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <Link to="/login">
              <Button variant="ghost" className="rounded-lg md:rounded-xl hover:bg-slate-800 text-slate-200 text-sm md:text-base px-3 md:px-4 py-2 transition-fast">
                Entrar
              </Button>
            </Link>
            <Link to="/cadastro">
              <Button className="rounded-lg md:rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm md:text-base px-3 md:px-4 py-2 transition-fast shadow-lg">
                Começar Grátis
              </Button>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Hero Section Modernizada */}
      <section className="pt-24 md:pt-32 pb-20 px-4 relative">
        {/* Elementos decorativos de fundo */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-indigo-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-5xl mx-auto space-y-10">
            {/* Badge de alerta */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-md border border-orange-400/30 rounded-full px-6 py-3 text-orange-200 text-sm font-medium animate-scale-in shadow-lg">
              <Zap className="h-5 w-5 text-orange-400" />
              <span className="font-semibold">Pare de perder tempo com planilhas manuais!</span>
            </div>
            
            {/* Título principal com gradiente e sombra */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-8xl font-display font-black leading-[0.9] text-white animate-slide-in-right">
                A IA que{' '}
                <span className="relative">
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent animate-pulse">
                    transforma
                  </span>
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"></div>
                </span>
                {' '}seus projetos
              </h1>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-blue-100 opacity-90">
                em orçamentos técnicos precisos
              </h2>
            </div>
            
            {/* Descrição melhorada */}
            <p className="text-lg md:text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed font-medium">
              Nossa <strong className="text-white">inteligência artificial especializada</strong> analisa plantas baixas, memoriais descritivos e especificações técnicas, gerando orçamentos completos com dados oficiais SINAPI em <strong className="text-blue-300">menos de 60 segundos</strong>.
            </p>
            
            {/* CTAs modernizados */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
              <Link to="/cadastro" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="group w-full sm:w-auto h-16 px-10 text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-2xl shadow-2xl shadow-blue-500/25 transition-all duration-300 hover:scale-105 border border-blue-400/20"
                  onClick={() => {
                    console.log('Botão Analisar Projeto Grátis clicado');
                  }}
                >
                  <Zap className="mr-3 h-6 w-6 group-hover:animate-pulse" />
                  ANALISAR PROJETO GRÁTIS
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto h-16 px-10 text-lg font-semibold rounded-2xl border-2 border-slate-400/30 bg-slate-800/50 backdrop-blur-md text-slate-200 hover:bg-slate-700/50 hover:border-slate-300 transition-all duration-300 hover:scale-105"
                onClick={() => {
                  const userJourneySection = document.getElementById('user-journey');
                  if (userJourneySection) {
                    userJourneySection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <Building className="mr-2 h-5 w-5" />
                Ver Demonstração
              </Button>
            </div>
            
            {/* Badges de credibilidade */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-8">
              <div className="flex items-center gap-3 px-6 py-3 bg-slate-800/60 backdrop-blur-md rounded-xl border border-slate-600/30 shadow-lg">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-slate-200 font-semibold">Resultados em 60s</span>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 bg-slate-800/60 backdrop-blur-md rounded-xl border border-slate-600/30 shadow-lg">
                <Shield className="h-5 w-5 text-blue-400" />
                <span className="text-slate-200 font-semibold">Dados SINAPI Oficiais</span>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 bg-slate-800/60 backdrop-blur-md rounded-xl border border-slate-600/30 shadow-lg">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-slate-200 font-semibold">95% de Precisão</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section Modernizada */}
      <section className="py-20 px-4 bg-white relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-20 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200 rounded-full px-6 py-2 text-blue-700 text-sm font-semibold mb-6">
              <Award className="h-4 w-4" />
              Por que somos a escolha #1 no Brasil
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-black text-slate-900 mb-6 leading-tight">
              Engenheiros e arquitetos{' '}
              <span className="relative">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  confiam na nossa IA
                </span>
                <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
              </span>
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed font-medium">
              Deixe nossa inteligência artificial fazer o trabalho técnico pesado enquanto você foca no que realmente importa: <strong className="text-slate-900">criar projetos excepcionais</strong>
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group relative p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/50 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-indigo-50/0 group-hover:from-blue-50/50 group-hover:to-indigo-50/50 rounded-3xl transition-all duration-300"></div>
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/25 group-hover:shadow-xl group-hover:shadow-blue-500/40 group-hover:scale-110 transition-all duration-300">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-900 transition-colors">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors">{feature.description}</p>
                </div>
                
                {/* Decorative corner */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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

      {/* User Journey - Seção Interativa */}
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
                  { name: "Recharts", logo: "https://recharts.org/images/recharts-logo.png" },
                  { name: "Lucide React", logo: "https://lucide.dev/logo.light.svg" },
                ].map((tech, index) => (
                  <div key={tech.name} className="tech-card animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex flex-col items-center text-center space-y-2 md:space-y-3">
                      <div className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center transition-fast hover:scale-110">
                        <img 
                          src={tech.logo} 
                          alt={`${tech.name} logo`}
                          className="max-w-full max-h-full object-contain"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
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
                  { name: "N8N", logo: "https://docs.n8n.io/favicon.svg" },
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
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
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

      {/* Especificações Técnicas Modernizada */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-20 left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-20 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 backdrop-blur-md border border-blue-400/30 rounded-full px-6 py-3 text-blue-200 text-sm font-semibold mb-8">
              <Shield className="h-5 w-5 text-blue-400" />
              Tecnologia de ponta para resultados profissionais
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-6 leading-tight">
              Especificações{' '}
              <span className="relative">
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
                  Técnicas
                </span>
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"></div>
              </span>
            </h2>
            <p className="text-xl text-slate-300 leading-relaxed font-medium">
              Conformidades e tecnologias que garantem a <strong className="text-white">máxima precisão</strong> e confiabilidade técnica em cada análise
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {techSpecs.map((spec, index) => (
              <div key={index} className="group relative p-8 bg-slate-800/60 backdrop-blur-md rounded-3xl border border-slate-700/50 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-3 animate-fade-in" style={{ animationDelay: `${index * 0.15}s` }}>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-indigo-500/0 group-hover:from-blue-500/10 group-hover:to-indigo-500/10 rounded-3xl transition-all duration-500"></div>
                
                <div className="relative z-10">
                  {/* Icon with enhanced design */}
                  <div className="relative mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/25 group-hover:shadow-blue-500/50 group-hover:scale-110 transition-all duration-300">
                      <spec.icon className="h-10 w-10 text-white" />
                    </div>
                    {/* Decorative ring */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-sm transition-all duration-300"></div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-100 transition-colors duration-300">
                    {spec.title}
                  </h3>
                  <p className="text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors duration-300">
                    {spec.description}
                  </p>
                </div>
                
                {/* Subtle accent lines */}
                <div className="absolute top-4 right-4 w-12 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-4 w-12 h-px bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Corner accent */}
                <div className="absolute top-6 right-6 w-2 h-2 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse"></div>
              </div>
            ))}
          </div>
          
          {/* CTA bottom */}
          <div className="text-center mt-16 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-600/50 shadow-xl">
              <CheckCircle className="h-6 w-6 text-green-400" />
              <span className="text-slate-200 font-semibold text-lg">
                Todas as especificações atendem rigorosamente às normas ABNT e IBGE
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Modernizada */}
      <section id="planos" className="py-20 px-4 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 relative">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-indigo-500/5 rounded-full blur-2xl"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-20 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 rounded-full px-6 py-2 text-green-700 text-sm font-semibold mb-6">
              <Award className="h-4 w-4" />
              Transparência total nos preços
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-black text-slate-900 mb-6 leading-tight">
              Planos para cada{' '}
              <span className="relative">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  necessidade
                </span>
                <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
              </span>
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed font-medium">
              Do profissional autônomo à grande construtora - temos a solução perfeita para <strong className="text-slate-900">acelerar seus projetos</strong>
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
                
                <Link to="/cadastro">
                  <Button 
                    className={`w-full h-12 text-base font-semibold rounded-xl transition-fast hover-scale ${
                      plan.popular
                        ? 'bg-white text-blue-600 hover:bg-blue-50'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                    }`}
                  >
                    Começar Agora
                  </Button>
                </Link>
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

      {/* Stats Section Modernizada */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-md border border-green-400/30 rounded-full px-6 py-3 text-green-200 text-sm font-semibold mb-8">
              <BarChart3 className="h-5 w-5 text-green-400" />
              Dados reais de performance
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-6 leading-tight">
              Resultados que{' '}
              <span className="relative">
                <span className="bg-gradient-to-r from-green-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent">
                  impressionam
                </span>
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-teal-400 rounded-full"></div>
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium">
              Números reais que comprovam a <strong className="text-white">eficiência revolucionária</strong> da nossa plataforma
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="group text-center p-6 bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 animate-fade-in">
              <div className="relative mb-4">
                <div ref={counter1.countRef} className="text-4xl md:text-5xl font-black text-white mb-2 stats-counter group-hover:text-blue-300 transition-colors">
                  {counter1.count.toLocaleString()}+
                </div>
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div className="text-slate-300 font-semibold group-hover:text-slate-200 transition-colors">Projetos Analisados</div>
            </div>
            
            <div className="group text-center p-6 bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-700/50 hover:border-green-500/50 transition-all duration-300 hover:scale-105 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="relative mb-4">
                <div ref={counter2.countRef} className="text-4xl md:text-5xl font-black text-white mb-2 stats-counter group-hover:text-green-300 transition-colors">
                  {counter2.count}%
                </div>
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
              </div>
              <div className="text-slate-300 font-semibold group-hover:text-slate-200 transition-colors">Precisão Técnica</div>
            </div>
            
            <div className="group text-center p-6 bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-700/50 hover:border-orange-500/50 transition-all duration-300 hover:scale-105 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="relative mb-4">
                <div ref={counter3.countRef} className="text-4xl md:text-5xl font-black text-white mb-2 stats-counter group-hover:text-orange-300 transition-colors">
                  {counter3.count}%
                </div>
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
              </div>
              <div className="text-slate-300 font-semibold group-hover:text-slate-200 transition-colors">Economia de Tempo</div>
            </div>
            
            <div className="group text-center p-6 bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="relative mb-4">
                <div ref={counter4.countRef} className="text-4xl md:text-5xl font-black text-white mb-2 stats-counter group-hover:text-purple-300 transition-colors">
                  {counter4.count.toLocaleString()}+
                </div>
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
              </div>
              <div className="text-slate-300 font-semibold group-hover:text-slate-200 transition-colors">Usuários Ativos</div>
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
              <Link to="/cadastro" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg shadow-blue-500/25 hover-lift transition-smooth">
                  Começar Gratuitamente
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto h-14 px-8 text-lg rounded-xl border-slate-300 hover:bg-slate-50 hover-scale transition-fast"
                onClick={() => {
                  window.open('mailto:contato@maden.ai?subject=Falar com Especialista', '_blank');
                }}
              >
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
                <a href="mailto:contato@maden.ai" className="text-slate-400 hover:text-slate-600 transition-fast hover-scale" target="_blank" rel="noopener">
                  <Mail className="h-5 w-5" />
                </a>
                <a href="tel:+5511999999999" className="text-slate-400 hover:text-slate-600 transition-fast hover-scale" target="_blank" rel="noopener">
                  <Phone className="h-5 w-5" />
                </a>
                <a href="https://linkedin.com/company/maden-ai" className="text-slate-400 hover:text-slate-600 transition-fast hover-scale" target="_blank" rel="noopener">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Produto</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => {
                      const featuresSection = document.querySelector('section');
                      if (featuresSection) {
                        featuresSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="text-slate-500 hover:text-slate-700 transition-fast text-left"
                  >
                    Recursos
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      const plansSection = document.querySelector('#planos');
                      if (plansSection) {
                        plansSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="text-slate-500 hover:text-slate-700 transition-fast text-left"
                  >
                    Preços
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      const userJourneySection = document.getElementById('user-journey');
                      if (userJourneySection) {
                        userJourneySection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="text-slate-500 hover:text-slate-700 transition-fast text-left"
                  >
                    Demonstração
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Para quem é</h3>
              <ul className="space-y-2">
                <li>
                  <span className="text-slate-500">Engenheiros</span>
                </li>
                <li>
                  <span className="text-slate-500">Arquitetos</span>
                </li>
                <li>
                  <span className="text-slate-500">Construtoras</span>
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

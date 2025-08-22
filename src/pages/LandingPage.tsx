import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { UnifiedLogo } from '@/components/ui/UnifiedLogo';
import VideoPlaceholder from '@/components/ui/VideoPlaceholder';
import ToolsIntegrationSection from '@/components/ui/ToolsIntegrationSection';
import RotatingText from '@/components/ui/RotatingText';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Upload, Bot, Calculator, Calendar, FileText, ArrowRight, BarChart3, Users, Clock, Target, Star, CheckCircle, Zap, Award, Building, CheckSquare, Code, Database, ExternalLink, FileArchive, FileCog, Gauge, HardHat, Layers, Lock, Ruler, ServerCog, Shield, Wrench, Instagram, Linkedin, Youtube, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

// Hook para contador animado OTIMIZADO
const useCountAnimation = (target: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const countRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (hasAnimated) return;
    const observer = new IntersectionObserver(([entry]) => {
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
    }, {
      threshold: 0.3,
      rootMargin: '50px'
    });
    if (countRef.current) {
      observer.observe(countRef.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [target, duration, isVisible, hasAnimated]);
  return {
    count,
    countRef
  };
};
const LandingPage = () => {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    loading: authLoading
  } = useAuth();
  const [scrollY, setScrollY] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([false, false, false, false]);
  const [showParticles, setShowParticles] = useState<number | null>(null);

  // Cálculo de contadores em tempo real baseado na data atual
  const calculateRealTimeStats = () => {
    const baseDate = new Date('2025-07-25'); // Data base: hoje
    const currentDate = new Date();
    const daysDifference = Math.floor((currentDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
    return {
      activeUsers: 8 + daysDifference * 5,
      // Começar com 8, +5 por dia
      analyzedProjects: 80 + daysDifference * 12,
      // Começar com 80, +12 por dia
      precision: 95,
      // Valor fixo
      timeSaved: 80 // Valor fixo
    };
  };
  const realTimeStats = calculateRealTimeStats();
  const counter1 = useCountAnimation(realTimeStats.analyzedProjects);
  const counter2 = useCountAnimation(realTimeStats.precision);
  const counter3 = useCountAnimation(realTimeStats.timeSaved);
  const counter4 = useCountAnimation(realTimeStats.activeUsers);

  // Redirecionamento automático para usuários autenticados
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/painel', {
        replace: true
      });
    }
  }, [isAuthenticated, authLoading, navigate]);
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, {
      passive: true
    });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const missionSteps = [{
    title: "Selecione seu projeto",
    description: "Escolha um projeto para começar sua jornada",
    xp: 50,
    icon: Target,
    color: "from-green-500 to-emerald-500"
  }, {
    title: "Faça o upload",
    description: "Carregue seus arquivos e documentos",
    xp: 100,
    icon: Upload,
    color: "from-blue-500 to-indigo-500"
  }, {
    title: "Faça sua análise",
    description: "Deixe a IA processar seus dados",
    xp: 200,
    icon: Bot,
    color: "from-purple-500 to-pink-500"
  }, {
    title: "Economize tempo",
    description: "Receba resultados profissionais instantaneamente",
    xp: 300,
    icon: Clock,
    color: "from-orange-500 to-red-500"
  }];
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
  const xpForNextLevel = currentLevel * 200;
  const progressPercent = totalXP > 0 ? totalXP % 200 / 200 * 100 : 0;
  const features = [{
    icon: Upload,
    title: "Upload e Análise Instantânea",
    description: "Arraste sua planta baixa ou memorial descritivo e receba análise completa em menos de 60 segundos"
  }, {
    icon: Bot,
    title: "IA Treinada para Construção Civil",
    description: "Algoritmos especializados que reconhecem elementos construtivos e aplicam normas técnicas automaticamente"
  }, {
    icon: Calculator,
    title: "Orçamentos 90% Mais Rápidos",
    description: "Elimine planilhas manuais e receba orçamentos detalhados com composições SINAPI atualizadas"
  }, {
    icon: Calendar,
    title: "Cronogramas Físico-Financeiros",
    description: "Cronogramas inteligentes que consideram interdependências e otimizam recursos automaticamente"
  }, {
    icon: FileText,
    title: "Relatórios Técnicos Prontos",
    description: "Documentação profissional em conformidade com NBR 12721 - pronta para apresentação"
  }, {
    icon: BarChart3,
    title: "Insights que Economizam Milhares",
    description: "Identifique oportunidades de economia e otimizações que podem reduzir custos em até 15%"
  }];
  const steps = [{
    number: "01",
    title: "Faça Upload",
    description: "Envie plantas baixas, memoriais descritivos ou especificações técnicas em PDF"
  }, {
    number: "02",
    title: "IA Analisa",
    description: "Nossa IA processa dados técnicos seguindo normas ABNT NBR 12721 e SINAPI"
  }, {
    number: "03",
    title: "Receba Resultados",
    description: "Orçamentos detalhados, cronogramas físico-financeiros e relatórios executivos"
  }];
  const plans = [{
    name: "Gratuito",
    price: "R$ 0",
    period: "/mês",
    description: "Ideal para profissionais iniciantes",
    features: ["1 projeto por mês", "Análise básica de PDF", "Orçamento técnico simples", "Suporte por email"],
    popular: false
  }, {
    name: "Pro",
    price: "R$ 79",
    period: "/mês",
    description: "Para profissionais ativos",
    features: ["Projetos ilimitados", "Cronogramas automáticos", "Dados oficiais SINAPI", "Dashboards avançados", "Exportações em PDF/Excel", "Suporte prioritário"],
    popular: true
  }, {
    name: "Enterprise",
    price: "Sob consulta",
    period: "",
    description: "Para construtoras e escritórios",
    features: ["Acesso multiusuário", "Integração com ERPs", "Automações N8N", "Onboarding personalizado", "Suporte técnico dedicado", "SLA garantido"],
    popular: false
  }];
  const testimonials = [{
    name: "Carlos Eduardo Santos",
    role: "Engenheiro Civil",
    company: "Santos Engenharia",
    content: "Reduzi 40% do tempo de orçamentação em obras residenciais. A precisão técnica seguindo a NBR 12721 é impressionante.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carlos&backgroundColor=b6e3f4&eyes=happy&mouth=smile"
  }, {
    name: "Ana Paula Oliveira",
    role: "Arquiteta",
    company: "Oliveira Arquitetura",
    content: "A análise automática de plantas baixas economizou semanas de trabalho. Interface intuitiva e resultados profissionais.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ana&backgroundColor=ffd93d&eyes=happy&mouth=smile"
  }, {
    name: "Roberto Mendes",
    role: "Gestor de Obras",
    company: "Construtora Mendes",
    content: "Os cronogramas físico-financeiros são precisos e seguem as melhores práticas. Essencial para gestão de projetos.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=roberto&backgroundColor=c0aede&eyes=happy&mouth=smile"
  }, {
    name: "Marina Costa",
    role: "Engenheira Estrutural",
    company: "Costa & Associados",
    content: "A integração com dados do SINAPI garante orçamentos atualizados. Ferramenta indispensável para engenheiros.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marina&backgroundColor=ffdfbf&eyes=happy&mouth=smile"
  }, {
    name: "José Silva",
    role: "Coordenador de Projetos",
    company: "Silva Construções",
    content: "Automatizou nosso processo de análise técnica. ROI positivo desde o primeiro mês de uso.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jose&backgroundColor=d1d4f9&eyes=happy&mouth=smile"
  }];
  const techSpecs = [{
    icon: Database,
    title: "Dados Oficiais SINAPI",
    description: "Composições unitárias atualizadas mensalmente seguindo diretrizes do IBGE"
  }, {
    icon: Shield,
    title: "Conformidade NBR 12721",
    description: "Orçamentos técnicos em conformidade com normas ABNT para avaliação de custos"
  }, {
    icon: Code,
    title: "IA Proprietária Local",
    description: "Algoritmos treinados especificamente para análise de documentos técnicos da construção civil"
  }, {
    icon: ServerCog,
    title: "Integração N8N",
    description: "Automações personalizadas conectando ERP, planilhas e sistemas de gestão"
  }, {
    icon: FileArchive,
    title: "Processamento PDF Avançado",
    description: "OCR especializado em plantas baixas, memoriais descritivos e especificações técnicas"
  }, {
    icon: Lock,
    title: "Segurança Supabase",
    description: "Armazenamento seguro com criptografia e backup automático de dados sensíveis"
  }];
  console.log('Landing Page renderizada com sucesso');
  return <div className="min-h-screen bg-background theme-transition">
      {/* Header fixo e flutuante */}
      <Header />
      
      {/* Apple-style backdrop gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-muted/20 -z-10 theme-transition" />
      
      {/* Apple-style Hero Section */}
      <section className="pt-32 md:pt-40 pb-20 px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-12">
            {/* Elegant notification badge */}
            <div className="inline-flex items-center gap-2 bg-muted text-muted-foreground rounded-full px-5 py-2 text-sm font-medium theme-transition">
              <Zap className="h-4 w-4" />
              Chega de perder tempo com planilhas
            </div>
            
            {/* Hero title with Apple typography */}
            <div className="space-y-6">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-foreground leading-tight tracking-tight theme-transition">
                Receba seus{' '}
                <RotatingText words={['Orçamentos', 'Cronogramas', 'Documentos']} className="text-primary" />
                {' '}técnicos precisos em{' '}
                <span className="text-primary">
                  segundos
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-normal tracking-wide theme-transition">
                Nossa IA entende seu projeto arquitetônico, interpreta os dados automaticamente e entrega orçamentos completos, cronogramas otimizados e relatórios técnicos.
              </p>
            </div>
            
            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Button size="lg" onClick={() => navigate('/cadastro')} className="w-full sm:w-auto h-14 px-12 text-lg font-medium bg-primary hover:bg-primary/90 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                Analisar Projeto Grátis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-12 text-lg font-medium rounded-xl border-slate-300 hover:bg-slate-50 transition-all duration-200" onClick={() => {
              const userJourneySection = document.getElementById('user-journey');
              if (userJourneySection) {
                userJourneySection.scrollIntoView({
                  behavior: 'smooth'
                });
              }
            }}>
                Ver Demonstração
              </Button>
            </div>
            
            {/* Trust badges */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground pt-8 theme-transition">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="font-medium">Resultados em 60 segundos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="font-medium">Baseado em dados SINAPI</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="font-medium">Grátis para começar</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Apple-style Features Section */}
      <section className="px-6 md:px-8 bg-muted/20 theme-transition py-[54px]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-semibold text-foreground mb-8 tracking-tight theme-transition">
              Por que engenheiros e arquitetos escolhem o MadeAI?
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-normal theme-transition">
              Deixe a IA fazer o trabalho pesado enquanto você foca no que realmente importa: criar projetos excepcionais
            </p>
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => <div key={index} className="group p-8 bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 transition-smooth hover-lift animate-fade-in stagger-animation theme-transition" style={{
            animationDelay: `${index * 0.1}s`
          }}>
                <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl flex items-center justify-center mb-6 group-hover:from-primary/20 group-hover:to-primary/30 transition-smooth group-hover:scale-110">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3 theme-transition">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed theme-transition">{feature.description}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* Apple-style Stats Section */}
      <section className="pt-16 pb-20 px-6 md:px-8 bg-background theme-transition">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-semibold text-foreground mb-8 tracking-tight theme-transition">
              Resultados que impressionam
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-normal mb-12 theme-transition">
              Números que comprovam a eficiência da nossa plataforma
            </p>
            
            {/* Video placeholder com lembrete */}
            <div className="max-w-3xl mx-auto mb-16">
              <VideoPlaceholder title="Depoimento de usuário" description="Veja como nossos clientes transformaram seus projetos com a MadenAI" size="lg" className="shadow-xl shadow-primary/10" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center bg-muted/50 rounded-2xl p-8 hover:bg-muted transition-all duration-200 theme-transition">
              <div ref={counter1.countRef} className="text-4xl md:text-5xl font-semibold text-primary mb-2 font-display">
                {counter1.count.toLocaleString()}+
              </div>
              <div className="text-muted-foreground font-medium theme-transition">Projetos Analisados</div>
            </div>
            <div className="text-center bg-muted/50 rounded-2xl p-8 hover:bg-muted transition-all duration-200 theme-transition">
              <div ref={counter2.countRef} className="text-4xl md:text-5xl font-semibold text-primary mb-2 font-display">
                {counter2.count}%
              </div>
              <div className="text-muted-foreground font-medium theme-transition">Precisão</div>
            </div>
            <div className="text-center bg-muted/50 rounded-2xl p-8 hover:bg-muted transition-all duration-200 theme-transition">
              <div ref={counter3.countRef} className="text-4xl md:text-5xl font-semibold text-primary mb-2 font-display">
                {counter3.count}%
              </div>
              <div className="text-muted-foreground font-medium theme-transition">Economia de Tempo</div>
            </div>
            <div className="text-center bg-muted/50 rounded-2xl p-8 hover:bg-muted transition-all duration-200 theme-transition">
              <div ref={counter4.countRef} className="text-4xl md:text-5xl font-semibold text-primary mb-2 font-display">
                {counter4.count.toLocaleString()}+
              </div>
              <div className="text-muted-foreground font-medium theme-transition">Usuários Ativos</div>
            </div>
          </div>
        </div>
      </section>

      {/* Apple-style How it Works */}
      <section className="px-6 md:px-8 theme-transition py-[14px] bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-semibold text-foreground mb-8 tracking-tight theme-transition">
              Como funciona
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-normal theme-transition">
              Processo simples e automatizado para análise completa de projetos
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {steps.map((step, index) => <div key={index} className="text-center space-y-8">                
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto text-primary-foreground font-semibold text-lg shadow-sm">
                    {step.number}
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground font-display theme-transition">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto theme-transition">{step.description}</p>
                </div>
                
                {index < steps.length - 1 && <ArrowRight className="hidden md:block absolute top-32 -right-6 h-6 w-6 text-muted-foreground/50" />}
              </div>)}
          </div>
        </div>
      </section>

      {/* Apple-style User Journey */}
      <section id="user-journey" className="py-32 px-6 md:px-8 bg-background theme-transition">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-semibold text-foreground mb-8 tracking-tight theme-transition">
              Sua Jornada de Sucesso
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-normal mb-12 theme-transition">
              Acompanhe seu progresso e desbloqueie novas funcionalidades conforme você domina a plataforma
            </p>
            
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {missionSteps.map((mission, index) => {
            const status = getMissionStatus(index);
            const isClickable = status === 'available';
            return <div key={index} className={`group relative p-6 bg-card rounded-2xl border-2 transition-all duration-300 theme-transition ${status === 'completed' ? 'border-green-200 shadow-lg shadow-green-500/10' : status === 'available' ? 'border-primary/30 shadow-lg shadow-primary/10 cursor-pointer hover:shadow-xl hover:scale-105' : 'border-border'} ${showParticles === index ? 'mission-unlock' : ''}`} style={{
              animationDelay: `${index * 0.1}s`
            }} onClick={() => handleMissionClick(index)}>
                  {/* Indicador de missão completada */}
                  {status === 'completed' && <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center shadow-lg animate-scale-in">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>}
                  
                  {/* Chamada para clicar (disponível) */}
                  {status === 'available' && <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs px-4 py-2 rounded-full shadow-lg animate-pulse border-2 border-background font-semibold">
                      Clique aqui
                    </div>}
                  
                  {/* Ícone da missão */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${mission.color} rounded-2xl flex items-center justify-center mx-auto mb-4 ${status === 'locked' ? 'opacity-50 grayscale' : 'group-hover:scale-110'} transition-all duration-300`}>
                    <mission.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  {/* Conteúdo da missão */}
                  <div className="text-center">
                    <h3 className={`text-lg font-semibold mb-2 theme-transition ${status === 'locked' ? 'text-muted-foreground/50' : 'text-foreground'}`}>
                      {mission.title}
                    </h3>
                    <p className={`text-sm mb-4 theme-transition ${status === 'locked' ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}>
                      {mission.description}
                    </p>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium theme-transition ${status === 'completed' ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200' : status === 'available' ? 'bg-gradient-to-r from-primary/10 to-primary/20 text-primary border border-primary/30' : 'bg-muted text-muted-foreground border border-border'}`}>
                      <Award className="h-4 w-4" />
                      {mission.xp} XP
                    </div>
                  </div>
                  
                  {/* Overlay para missões bloqueadas */}
                  {status === 'locked' && <div className="absolute inset-0 bg-card/80 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <Lock className="h-8 w-8 text-muted-foreground/50" />
                    </div>}
                </div>;
          })}
          </div>
          
          {/* Barra de progresso XP atualizada */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-4 px-6 py-3 bg-card rounded-2xl border border-border shadow-lg theme-transition">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="font-semibold text-foreground">Nível {currentLevel}</span>
              </div>
              <div className="w-32 h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500" style={{
                width: `${progressPercent}%`
              }}></div>
              </div>
              <span className="text-sm text-muted-foreground">{totalXP}/{xpForNextLevel} XP</span>
            </div>
            
            {/* Botão CTA quando jornada completa */}
            {completedSteps.every(step => step) && <div className="mt-8 animate-scale-in">
                <Button size="lg" className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl shadow-lg shadow-green-500/25 transition-smooth hover-lift" onClick={() => {
              const plansSection = document.querySelector('#planos');
              if (plansSection) {
                plansSection.scrollIntoView({
                  behavior: 'smooth'
                });
              }
            }}>
                  🎉 Parabéns! Assine um Plano Agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>}
          </div>
        </div>
      </section>

      {/* Tecnologias OTIMIZADA */}
      <section className="py-20 bg-muted/20 theme-transition">
        <div className="container mx-auto px-4 py-[25px]">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6 theme-transition">
              Tecnologias que Usamos
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto theme-transition">
              Nossa plataforma é construída com as melhores tecnologias do mercado para garantir performance, segurança e escalabilidade.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Frontend */}
            <div className="space-y-6 animate-slide-in-right">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground text-center lg:text-left theme-transition">Frontend</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {[{
                name: "React",
                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg"
              }, {
                name: "TypeScript",
                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg"
              }, {
                name: "Tailwind CSS",
                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg"
              }, {
                name: "Radix UI",
                logo: "https://avatars.githubusercontent.com/u/75042455?s=200&v=4"
              }, {
                name: "Recharts",
                logo: "https://recharts.org/images/recharts-logo.png"
              }, {
                name: "Lucide React",
                logo: "https://lucide.dev/logo.light.svg"
              }].map((tech, index) => <div key={tech.name} className="tech-card animate-fade-in" style={{
                animationDelay: `${index * 0.1}s`
              }}>
                    <div className="flex flex-col items-center text-center space-y-2 md:space-y-3">
                      <div className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center transition-fast hover:scale-110">
                        <img src={tech.logo} alt={`${tech.name} logo`} className="max-w-full max-h-full object-contain" loading="lazy" onError={e => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }} />
                      </div>
                      <span className="text-xs md:text-sm font-semibold text-foreground leading-tight theme-transition">{tech.name}</span>
                    </div>
                  </div>)}
              </div>
            </div>

            {/* Backend */}
            <div className="space-y-6 animate-slide-in-right" style={{
            animationDelay: '0.3s'
          }}>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground text-center lg:text-left theme-transition">Backend</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {[{
                name: "Supabase",
                logo: "https://supabase.com/brand-assets/supabase-logo-icon.png"
              }, {
                name: "IA Proprietária",
                logo: "https://cdn-icons-png.flaticon.com/512/8637/8637099.png"
              }, {
                name: "N8N",
                logo: "https://docs.n8n.io/favicon.svg"
              }, {
                name: "SINAPI",
                logo: "https://cdn-icons-png.flaticon.com/512/3159/3159310.png"
              }, {
                name: "Edge Functions",
                logo: "https://cdn-icons-png.flaticon.com/512/2721/2721291.png"
              }, {
                name: "PostgreSQL",
                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg"
              }].map((tech, index) => <div key={tech.name} className="tech-card animate-fade-in" style={{
                animationDelay: `${(index + 6) * 0.1}s`
              }}>
                    <div className="flex flex-col items-center text-center space-y-2 md:space-y-3">
                      <div className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center transition-fast hover:scale-110">
                        <img src={tech.logo} alt={`${tech.name} logo`} className="max-w-full max-h-full object-contain" loading="lazy" onError={e => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }} />
                      </div>
                      <span className="text-xs md:text-sm font-semibold text-foreground leading-tight theme-transition">{tech.name}</span>
                    </div>
                  </div>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Specs OTIMIZADA */}
      <section className="py-20 px-4 bg-muted/50 theme-transition">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
            <h2 className="text-4xl font-display font-bold text-foreground mb-6 theme-transition">
              Especificações Técnicas
            </h2>
            <p className="text-xl text-muted-foreground theme-transition">
              Tecnologias e conformidades que garantem a precisão dos seus projetos
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {techSpecs.map((spec, index) => <div key={index} className="group p-8 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10 transition-smooth hover-lift animate-fade-in" style={{
            animationDelay: `${index * 0.1}s`
          }}>
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-6 shadow-md shadow-blue-500/10 group-hover:scale-110 transition-fast">
                  <spec.icon className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{spec.title}</h3>
                <p className="text-slate-600 leading-relaxed">{spec.description}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* Plans OTIMIZADA */}
      <section id="planos" className="py-20 px-4 bg-background theme-transition">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
            <h2 className="text-4xl font-display font-bold text-foreground mb-6 theme-transition">
              Planos para cada necessidade
            </h2>
            <p className="text-xl text-muted-foreground theme-transition">
              Escolha o plano ideal para você ou sua empresa
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => <div key={index} className={`p-8 rounded-2xl border relative hover-lift animate-fade-in transition-smooth theme-transition ${plan.popular ? 'bg-gradient-to-br from-primary to-primary/80 border-transparent text-primary-foreground' : 'bg-card border-border hover:border-primary/30 hover:shadow-lg'}`} style={{
            animationDelay: `${index * 0.1}s`
          }}>
                {plan.popular && <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-semibold px-4 py-1 rounded-full shadow-lg animate-bounce-gentle">
                    Mais Popular
                  </div>}
                
                <div className="text-xl font-semibold mb-2">
                  {plan.name}
                </div>
                
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="ml-1 text-sm opacity-80">{plan.period}</span>
                </div>
                
                <p className={`mb-8 theme-transition ${plan.popular ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                  {plan.description}
                </p>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => <li key={featureIndex} className="flex items-center gap-3">
                      <CheckCircle className={`h-5 w-5 flex-shrink-0 ${plan.popular ? 'text-primary-foreground/80' : 'text-primary'}`} />
                      <span className={`theme-transition ${plan.popular ? 'text-primary-foreground/90' : 'text-foreground'}`}>
                        {feature}
                      </span>
                    </li>)}
                </ul>
                
                <Link to="/cadastro">
                  <Button className={`w-full h-12 text-base font-semibold rounded-xl transition-fast hover-scale ${plan.popular ? 'bg-background text-foreground hover:bg-muted' : 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70'}`}>
                    Começar Agora
                  </Button>
                </Link>
              </div>)}
          </div>
        </div>
      </section>

      {/* Tools Integration Section */}
      <ToolsIntegrationSection />

      {/* Testimonials OTIMIZADA */}
      <section className="py-20 px-4 bg-muted/20 theme-transition">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
            <h2 className="text-4xl font-display font-bold text-foreground mb-6 theme-transition">
              O que dizem nossos usuários
            </h2>
            <p className="text-xl text-muted-foreground theme-transition">
              Profissionais que já transformaram sua forma de trabalhar
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.slice(0, 3).map((testimonial, index) => <div key={index} className="testimonial-card bg-card rounded-2xl p-8 border border-border hover:border-primary/30 hover:shadow-lg animate-fade-in theme-transition" style={{
            animationDelay: `${index * 0.1}s`
          }}>
                <div className="flex items-start gap-4 mb-6">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-16 h-16 rounded-xl bg-muted p-1 border border-border hover-scale transition-fast" loading="lazy" />
                  <div>
                    <div className="font-semibold text-foreground theme-transition">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground theme-transition">{testimonial.role}</div>
                    <div className="text-sm text-muted-foreground/80 theme-transition">{testimonial.company}</div>
                  </div>
                </div>
                
                <p className="text-muted-foreground leading-relaxed mb-4 theme-transition">
                  {testimonial.content}
                </p>
                
                <div className="flex gap-1">
                  {Array.from({
                length: testimonial.rating
              }).map((_, i) => <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />)}
                </div>
              </div>)}
          </div>
        </div>
      </section>


      {/* Final CTA OTIMIZADA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-card rounded-3xl p-12 border border-border hover:border-primary/30 transition-smooth animate-fade-in hover-lift theme-transition">
            <h2 className="text-4xl font-display font-bold text-foreground mb-6 theme-transition">
              Pronto para revolucionar seus projetos?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto theme-transition">
              Junte-se a milhares de profissionais que já economizam tempo e aumentam a precisão com nossa IA
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/cadastro" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 rounded-xl shadow-lg shadow-primary/25 hover-lift transition-smooth">
                  Começar Gratuitamente
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-xl border-border hover:bg-muted hover-scale transition-fast" onClick={() => {
              window.open('mailto:contato@maden.ai?subject=Falar com Especialista', '_blank');
            }}>
                Falar com Especialista
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground theme-transition">
              <div className="flex">
                {[1, 2, 3, 4, 5].map(star => <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
              </div>
              <span>4.9/5 baseado em 200+ avaliações</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer usando componente separado */}
      <Footer />

    </div>;
};
export default LandingPage;
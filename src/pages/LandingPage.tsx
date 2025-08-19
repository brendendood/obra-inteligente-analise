import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlternatingText } from '@/components/ui/AlternatingText';
import { MediaPlaceholder } from '@/components/ui/MediaPlaceholder';
import { 
  ArrowRight, 
  Upload, 
  Brain, 
  FileText,
  CheckCircle,
  Star,
  Users,
  TrendingUp,
  Zap,
  Shield,
  Clock,
  BarChart3,
  Play,
  ImageIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { GlobalMediaReplacer } from '@/components/ui/GlobalMediaReplacer';

// Hook para animação de contadores
const useCountAnimation = (target: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let start = 0;
          const increment = target / (duration / 16);
          
          const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
          
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, [target, duration]);

  return { count, countRef };
};

const BustemLandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);

  // Redirect authenticated users
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Statistics with animations
  const currentDate = new Date();
  const monthsSinceLaunch = Math.max(1, Math.floor((currentDate.getTime() - new Date('2024-01-01').getTime()) / (1000 * 60 * 60 * 24 * 30)));
  const projectsAnalyzed = monthsSinceLaunch * 847;
  const accuracy = 99.2;
  const timeReduced = 89;

  const projectsCount = useCountAnimation(projectsAnalyzed);
  const accuracyCount = useCountAnimation(accuracy, 1500);
  const timeCount = useCountAnimation(timeReduced, 1800);

  // XP Journey simulation
  const userJourney = [
    { level: 'Novato', xp: 0, maxXp: 100, description: 'Primeiro upload' },
    { level: 'Explorador', xp: 45, maxXp: 250, description: 'Usando IA Assistant' },
    { level: 'Especialista', xp: 180, maxXp: 500, description: 'Exportando relatórios' },
    { level: 'Mestre', xp: 420, maxXp: 1000, description: 'Projetos avançados' }
  ];

  const testimonials = [
    {
      name: "Carlos Silva",
      role: "Engenheiro Civil",
      company: "Construtora ABC",
      content: "O MadeAI reduziu meu tempo de orçamentação em 85%. Agora consigo focar no que realmente importa: a qualidade dos projetos.",
      avatar: "CS"
    },
    {
      name: "Ana Santos",
      role: "Arquiteta",
      company: "Studio Design",
      content: "Impressionante! A IA entende perfeitamente os detalhes técnicos e gera cronogramas precisos em segundos.",
      avatar: "AS"
    },
    {
      name: "João Pereira",
      role: "Gerente de Projetos",
      company: "Megaobras Ltda",
      content: "Nossa produtividade aumentou 300% desde que começamos a usar o MadeAI. É uma revolução na construção civil.",
      avatar: "JP"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <GlobalMediaReplacer />
      {/* Hero Section - Bustem Style Faithful */}
      <section className="relative pt-16 pb-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content - Bustem Typography Style */}
            <div className="space-y-8 lg:space-y-10">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-muted/50 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground">
                  ✨ IA para Engenharia e Arquitetura
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-foreground leading-[1.1] tracking-tight">
                  MadeAI Finds And Builds
                </h1>
                
                <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-foreground leading-[1.1] tracking-tight">
                  <AlternatingText 
                    words={['Orçamentos', 'Cronogramas', 'Documentos']}
                    className="text-primary"
                    interval={2500}
                  />
                </h2>
                
                <h3 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-foreground leading-[1.1] tracking-tight">
                  Com Um Clique
                </h3>
                
                <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-lg font-normal">
                  A IA da MadeAI entende seu projeto e entrega orçamentos completos, 
                  cronogramas detalhados e relatórios técnicos prontos para uso profissional.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/upload')}
                  className="text-lg px-8 py-4 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Analisar Projeto Grátis
                </Button>
              </div>
            </div>

            {/* Hero Media Placeholder - Bustem Style */}
            <div className="lg:order-last">
              <MediaPlaceholder
                slotId="media-hero-1"
                title="Demonstração Principal"
                description="Vídeo/GIF mostrando 'Analisar Projeto Grátis' em ação"
                dimensions="600x400px desktop, responsivo"
                className="h-72 sm:h-80 lg:h-96 rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Process Steps - Bustem Style */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 rounded-lg p-3">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <span className="text-lg font-medium">Envie sua planta</span>
              </div>
              
              <div className="hidden sm:block">
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 rounded-lg p-3">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <span className="text-lg font-medium">IA analisa em segundos</span>
              </div>
              
              <div className="hidden sm:block">
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 rounded-lg p-3">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <span className="text-lg font-medium">Receba relatórios completos</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - PLACEHOLDER 2 - IMAGEM DE APOIO */}
      <section className="py-24 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Stats */}
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mb-4 leading-tight">
                Resultados que impressionam
              </h2>
              <p className="text-lg text-muted-foreground mb-12 max-w-md">
                Scan 4+ billion sites in seconds
              </p>
              
              <div className="grid grid-cols-1 gap-8">
                <div className="flex items-center gap-6" ref={projectsCount.countRef}>
                  <div className="text-5xl lg:text-6xl font-black text-primary">
                    {projectsCount.count.toLocaleString()}+
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-foreground">Projetos Analisados</p>
                    <p className="text-muted-foreground">Cada projeto processado em segundos</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6" ref={accuracyCount.countRef}>
                  <div className="text-5xl lg:text-6xl font-black text-primary">
                    {accuracyCount.count}%
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-foreground">Precisão</p>
                    <p className="text-muted-foreground">Validada por especialistas da área</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6" ref={timeCount.countRef}>
                  <div className="text-5xl lg:text-6xl font-black text-primary">
                    {timeCount.count}%
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-foreground">Tempo Economizado</p>
                    <p className="text-muted-foreground">Comparado aos métodos tradicionais</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Media Placeholder */}
            <MediaPlaceholder
              slotId="media-results-1"
              title="Resultados em Ação"
              description="Demonstração de eficiência, transformação de dados em relatórios"
              dimensions="500x300px desktop, responsivo"
              className="h-64 lg:h-80 rounded-2xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Por que engenheiros e arquitetos escolhem o MadeAI?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tecnologia de ponta que entende suas necessidades específicas
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain className="h-6 w-6" />,
                title: "IA Especializada",
                description: "Algoritmos treinados especificamente para engenharia e arquitetura"
              },
              {
                icon: <Clock className="h-6 w-6" />,
                title: "Resultados Instantâneos",
                description: "Orçamentos e cronogramas completos em menos de 30 segundos"
              },
              {
                icon: <BarChart3 className="h-6 w-6" />,
                title: "Precisão Técnica",
                description: "99.2% de precisão validada por especialistas da área"
              },
              {
                icon: <Shield className="h-6 w-6" />,
                title: "Segurança Total",
                description: "Seus projetos são protegidos com criptografia de nível militar"
              },
              {
                icon: <FileText className="h-6 w-6" />,
                title: "Relatórios Completos",
                description: "Documentação técnica pronta para apresentação e execução"
              },
              {
                icon: <TrendingUp className="h-6 w-6" />,
                title: "Análise Preditiva",
                description: "Identifica riscos e oportunidades de otimização automaticamente"
              }
            ].map((feature, index) => (
              <Card key={index} className="border-border hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="bg-primary/10 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                    <div className="text-primary">{feature.icon}</div>
                  </div>
                  <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Watch In Action - Bustem Style */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mb-4 leading-tight">
              Watch In Action
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Veja como a MadeAI revoluciona seus projetos em tempo real
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                title: "Faça Upload",
                description: "Envie plantas, PDFs ou dados do seu projeto",
                slotId: "media-how-1"
              },
              {
                title: "IA Analisa",
                description: "Processamento inteligente em segundos",
                slotId: "media-how-2"
              },
              {
                title: "Receba Resultados",
                description: "Relatórios técnicos completos e precisos",
                slotId: "media-how-3"
              }
            ].map((step, index) => (
              <div key={index} className="space-y-6">
                <MediaPlaceholder
                  slotId={step.slotId}
                  title={`${step.title} em Ação`}
                  description={`Demonstração: ${step.description}`}
                  dimensions="320x240px"
                  className="h-48 sm:h-56 lg:h-64 rounded-2xl shadow-lg"
                />
                
                <div className="text-center">
                  <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm lg:text-base">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Journey */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Sua Jornada de Sucesso</h2>
            <p className="text-xl text-muted-foreground">Evolua suas habilidades e desbloqueie novos recursos</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Journey Progress Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {userJourney.map((level, index) => (
                <Card key={index} className={`border-border transition-all duration-300 ${index <= currentStep ? 'bg-primary/5 border-primary' : ''}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-lg font-semibold">{level.level}</CardTitle>
                      <Badge variant={index <= currentStep ? "default" : "outline"}>
                        {level.xp}/{level.maxXp} XP
                      </Badge>
                    </div>
                    
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(level.xp / level.maxXp) * 100}%` }}
                      />
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{level.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Journey Media Placeholder */}
            <MediaPlaceholder
              slotId="media-journey-1"
              title="Jornada de Progressão"
              description="Vídeo mostrando evolução do usuário na plataforma MadeAI"
              dimensions="400x250px"
              className="h-64"
            />
          </div>
        </div>
      </section>

      {/* Testimonials - Tweet Style like Bustem */}
      <section className="py-24 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mb-4 leading-tight">
              O que dizem nossos usuários
            </h2>
            <p className="text-lg text-muted-foreground">
              Profissionais que transformaram seus projetos
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start space-x-3 mb-4">
                  <div className="bg-primary rounded-full w-10 h-10 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {testimonial.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <h4 className="font-bold text-foreground text-sm">{testimonial.name}</h4>
                      <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.46 6c-.854.37-1.777.62-2.742.732a4.77 4.77 0 002.094-2.63 9.54 9.54 0 01-3.024 1.154 4.76 4.76 0 00-8.106 4.34A13.52 13.52 0 013.15 4.64a4.76 4.76 0 001.473 6.35 4.73 4.73 0 01-2.157-.595v.061a4.76 4.76 0 003.817 4.664 4.77 4.77 0 01-2.15.082 4.76 4.76 0 004.447 3.307A9.54 9.54 0 011.64 19.86a13.48 13.48 0 007.29 2.137c8.74 0 13.52-7.24 13.52-13.52 0-.205-.005-.41-.015-.614A9.65 9.65 0 0024 4.59l-.54.01z"/>
                      </svg>
                    </div>
                    <p className="text-muted-foreground text-sm">@{testimonial.role.toLowerCase().replace(' ', '_')}</p>
                  </div>
                </div>
                
                <p className="text-foreground text-sm leading-relaxed mb-4">
                  {testimonial.content}
                </p>
                
                <div className="flex items-center justify-between text-muted-foreground text-xs">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16l13-8-13-8z" />
                      </svg>
                      12
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      23
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      87
                    </span>
                  </div>
                  <span>{testimonial.company}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Planos para cada necessidade</h2>
            <p className="text-xl text-muted-foreground">Escolha o plano ideal para seus projetos</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Gratuito",
                price: "R$ 0",
                period: "/mês",
                features: ["2 projetos por mês", "IA Assistant básico", "Orçamentos simples", "Suporte por email"],
                cta: "Começar Grátis",
                popular: false
              },
              {
                name: "Pro",
                price: "R$ 97",
                period: "/mês",
                features: ["Projetos ilimitados", "IA Assistant avançado", "Cronogramas detalhados", "Relatórios completos", "Suporte prioritário", "Análise preditiva"],
                cta: "Teste Grátis por 7 dias",
                popular: true
              },
              {
                name: "Enterprise",
                price: "Sob consulta",
                period: "",
                features: ["Tudo do Pro", "API personalizada", "Integração sistemas", "Treinamento equipe", "Suporte dedicado", "SLA garantido"],
                cta: "Falar com Vendas",
                popular: false
              }
            ].map((plan, index) => (
              <Card key={index} className={`border-border relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                    Mais Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => navigate(plan.name === 'Enterprise' ? '/contact' : '/signup')}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Pronto para revolucionar seus projetos?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Junte-se a milhares de profissionais que já transformaram sua forma de trabalhar
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/upload')}
              className="text-lg px-8 py-6 bg-primary hover:bg-primary/90"
            >
              Analisar Projeto Grátis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/signup')}
              className="text-lg px-8 py-6 border-border hover:bg-muted"
            >
              Criar Conta Grátis
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BustemLandingPage;
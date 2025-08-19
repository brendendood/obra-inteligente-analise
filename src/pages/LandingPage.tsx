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
      {/* Hero Section - Bustem Style */}
      <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge variant="secondary" className="text-sm font-medium">
                  IA para Engenharia e Arquitetura
                </Badge>
                
                <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                  Receba seus{' '}
                  <AlternatingText 
                    words={['Orçamentos', 'Cronogramas', 'Documentos']}
                    className="text-primary"
                    interval={2500}
                  />{' '}
                  técnicos precisos em{' '}
                  <span className="text-primary">segundos</span>
                </h1>
                
                <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                  A IA da MadeAI entende seu projeto e entrega orçamentos completos, 
                  cronogramas detalhados e relatórios técnicos prontos para uso profissional.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
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
                  onClick={() => navigate('/login')}
                  className="text-lg px-8 py-6 border-border hover:bg-muted"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Ver Demonstração
                </Button>
              </div>
            </div>

            {/* Hero Media Placeholder */}
            <div className="lg:order-last">
              <MediaPlaceholder
                slotId="media-hero-1"
                title="Demonstração Principal"
                description="Vídeo/GIF mostrando 'Analisar Projeto Grátis' em ação"
                dimensions="600x400px desktop, responsivo"
                className="h-80 lg:h-96"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - PLACEHOLDER 2 - IMAGEM DE APOIO */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Stats */}
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-12">
                Resultados que impressionam
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div className="text-center" ref={projectsCount.countRef}>
                  <div className="text-4xl font-bold text-primary mb-2">
                    {projectsCount.count.toLocaleString()}+
                  </div>
                  <p className="text-muted-foreground">Projetos Analisados</p>
                </div>
                
                <div className="text-center" ref={accuracyCount.countRef}>
                  <div className="text-4xl font-bold text-primary mb-2">
                    {accuracyCount.count}%
                  </div>
                  <p className="text-muted-foreground">Precisão</p>
                </div>
                
                <div className="text-center" ref={timeCount.countRef}>
                  <div className="text-4xl font-bold text-primary mb-2">
                    {timeCount.count}%
                  </div>
                  <p className="text-muted-foreground">Tempo Economizado</p>
                </div>
              </div>
            </div>

            {/* Stats Media Placeholder */}
            <MediaPlaceholder
              slotId="media-results-1"
              title="Resultados em Ação"
              description="Demonstração de eficiência, transformação de dados em relatórios"
              dimensions="500x300px desktop, responsivo"
              className="h-64 lg:h-80"
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

      {/* How it Works */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Como funciona</h2>
            <p className="text-xl text-muted-foreground">Simples, rápido e eficiente</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: <Upload className="h-8 w-8" />,
                title: "Faça Upload",
                description: "Envie plantas, PDFs ou dados do seu projeto de forma segura",
                slotId: "media-how-1"
              },
              {
                step: "02",
                icon: <Brain className="h-8 w-8" />,
                title: "IA Analisa",
                description: "Nossa IA especializada processa e entende todos os detalhes técnicos",
                slotId: "media-how-2"
              },
              {
                step: "03",
                icon: <FileText className="h-8 w-8" />,
                title: "Receba Resultados",
                description: "Orçamentos, cronogramas e relatórios técnicos prontos em segundos",
                slotId: "media-how-3"
              }
            ].map((step, index) => (
              <div key={index} className="text-center relative space-y-6">
                <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto text-white font-bold text-lg">
                  {step.step}
                </div>
                
                <div className="space-y-4">
                  <div className="bg-primary/10 rounded-lg w-12 h-12 flex items-center justify-center mx-auto">
                    <div className="text-primary">{step.icon}</div>
                  </div>
                  
                  <h3 className="text-2xl font-semibold text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">{step.description}</p>
                </div>

                {/* Media Placeholder for each step */}
                <MediaPlaceholder
                  slotId={step.slotId}
                  title={`${step.title} em Ação`}
                  description={`Animação demonstrando: ${step.description}`}
                  dimensions="300x200px"
                  className="h-40"
                />

                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-full w-full">
                    <ArrowRight className="h-6 w-6 text-muted-foreground mx-auto" />
                  </div>
                )}
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

      {/* Testimonials */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">O que dizem nossos usuários</h2>
            <p className="text-xl text-muted-foreground">Profissionais que transformaram seus projetos</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-border">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary rounded-full w-12 h-12 flex items-center justify-center text-white font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.company}</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
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
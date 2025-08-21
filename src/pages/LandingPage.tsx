import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UnifiedLogo } from "@/components/ui/UnifiedLogo";
import VideoPlaceholder from "@/components/ui/VideoPlaceholder";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ToolsIntegrationSection from "@/components/ui/ToolsIntegrationSection";
import { useAuth } from "@/hooks/useAuth";
import { 
  BarChart3, 
  Clock, 
  FileText, 
  Upload, 
  Brain, 
  Download,
  CheckCircle,
  Star,
  ArrowRight,
  Sun,
  Moon,
  Zap,
  Target,
  Shield,
  Rocket,
  Calculator,
  Calendar,
  Bot,
  Database,
  Code,
  ServerCog,
  FileArchive,
  Lock,
  Award,
  Mail,
  Phone,
  Linkedin
} from "lucide-react";

interface CountAnimationProps {
  end: number;
  suffix?: string;
  duration?: number;
}

const useCountAnimation = ({ end, suffix = "", duration = 2000 }: CountAnimationProps) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const countRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(easeOutQuart * end));
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return { count, countRef };
};

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(false);
  const [isAuto, setIsAuto] = useState(true);

  useEffect(() => {
    // Check localStorage for saved preference
    const savedTheme = localStorage.getItem('theme-preference');
    const savedIsAuto = localStorage.getItem('theme-auto') === 'true';
    
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
      setIsAuto(savedIsAuto);
      document.documentElement.classList.toggle('dark-mode', savedTheme === 'dark');
    } else {
      // Auto mode based on time (6h-18h = light, 18h-6h = dark)
      const hour = new Date().getHours();
      const shouldBeDark = hour < 6 || hour >= 18;
      setIsDark(shouldBeDark);
      setIsAuto(true);
      document.documentElement.classList.toggle('dark-mode', shouldBeDark);
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    setIsAuto(false);
    
    localStorage.setItem('theme-preference', newIsDark ? 'dark' : 'light');
    localStorage.setItem('theme-auto', 'false');
    
    document.documentElement.classList.toggle('dark-mode', newIsDark);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label={`Alternar para ${isDark ? 'modo claro' : 'modo escuro'}`}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
};

const RotatingText = () => {
  const words = ["Orçamento", "Cronograma", "Documentos"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        setIsVisible(true);
      }, 300);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <span 
      className={`inline-block transition-all duration-300 text-[#0281FE] font-bold ${
        isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2'
      }`}
    >
      {words[currentWordIndex]}
    </span>
  );
};

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/painel");
    }
  }, [user, navigate]);

  // Counter animations
  const projectsCount = useCountAnimation({ end: 2547 });
  const accuracyCount = useCountAnimation({ end: 98 });
  const timeCount = useCountAnimation({ end: 80 });
  const satisfactionCount = useCountAnimation({ end: 97 });

  const features = [
    {
      icon: <Upload className="w-6 h-6" />,
      title: "Faça Upload",
      description: "Envie suas plantas, documentos ou dados do projeto"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "IA Analisa",
      description: "Nossa IA processa e analisa todos os dados instantaneamente"
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Receba Resultados",
      description: "Obtenha orçamentos e cronogramas precisos em segundos"
    }
  ];

  const journeySteps = [
    {
      title: "Iniciante",
      description: "Comece sua jornada subindo seu primeiro projeto",
      icon: <Rocket className="w-8 h-8" />,
      color: "bg-green-500"
    },
    {
      title: "Explorador",
      description: "Descubra funcionalidades avançadas da plataforma",
      icon: <Target className="w-8 h-8" />,
      color: "bg-blue-500"
    },
    {
      title: "Especialista",
      description: "Domine todas as ferramentas de análise",
      icon: <Star className="w-8 h-8" />,
      color: "bg-purple-500"
    },
    {
      title: "Mestre",
      description: "Torne-se referência em gestão de projetos",
      icon: <Shield className="w-8 h-8" />,
      color: "bg-orange-500"
    }
  ];

  const plans = [
    {
      name: "Gratuito",
      price: "R$ 0",
      period: "/mês",
      description: "Perfeito para começar",
      features: [
        "3 projetos por mês",
        "Análise básica de IA", 
        "Orçamentos simplificados",
        "Suporte por email"
      ],
      buttonText: "Começar Grátis",
      popular: false
    },
    {
      name: "Pro",
      price: "R$ 97",
      period: "/mês",
      description: "Para profissionais",
      features: [
        "Projetos ilimitados",
        "IA avançada",
        "Cronogramas detalhados",
        "Suporte prioritário",
        "Exportação PDF",
        "Integrações"
      ],
      buttonText: "Começar Teste",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Sob consulta",
      period: "",
      description: "Para empresas",
      features: [
        "Tudo do Pro",
        "API personalizada",
        "Suporte dedicado",
        "Treinamento incluso",
        "SLA garantido"
      ],
      buttonText: "Falar com Vendas",
      popular: false
    }
  ];

  const testimonials = [
    {
      name: "Carlos Mendes",
      role: "Engenheiro Civil",
      avatar: "👨‍💼",
      content: "O MadeAI revolucionou minha forma de trabalhar. O que antes levava dias, agora faço em minutos!",
      rating: 5
    },
    {
      name: "Ana Souza", 
      role: "Arquiteta",
      avatar: "👩‍💼",
      content: "Precisão incrível nos orçamentos. Meus clientes ficam impressionados com a agilidade.",
      rating: 5
    },
    {
      name: "Roberto Silva",
      role: "Gestor de Projetos", 
      avatar: "👨‍💻",
      content: "Ferramenta indispensável para qualquer profissional da construção civil.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1419] transition-colors duration-300">
      {/* Dark Mode CSS Variables */}
      <style>{`
        .dark-mode {
          --background: #0f1419;
          --foreground: #ffffff;
          --card: #252a33;
          --card-foreground: #ffffff;
          --primary: #0281FE;
          --primary-foreground: #ffffff;
          --secondary: #b8bcc5;
          --muted: #252a33;
          --muted-foreground: #b8bcc5;
          --border: #374151;
        }
        
        .dark-mode body {
          background: linear-gradient(135deg, #0f1419 0%, #1a1d23 100%);
          color: #ffffff;
        }
        
        .dark-mode .bg-gray-50 {
          background: #0f1419;
        }
        
        .dark-mode .bg-white {
          background: #252a33;
          color: #ffffff;
        }
        
        .dark-mode .text-gray-600 {
          color: #b8bcc5;
        }
        
        .dark-mode .text-gray-900 {
          color: #ffffff;
        }
        
        .dark-mode .border-gray-200 {
          border-color: #374151;
        }
        
        .dark-mode .shadow-lg {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2);
        }
      `}</style>

      {/* Enhanced Header with Dark Mode Toggle */}
      <header className="fixed top-4 left-4 right-4 z-50 transition-all duration-300 bg-white/95 dark:bg-[#252a33]/95 backdrop-blur-xl border border-gray-200 dark:border-gray-700 shadow-lg rounded-2xl">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <UnifiedLogo size="md" theme="auto" priority className="transition-all duration-300 hover:scale-105" />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#funcionalidades" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                Funcionalidades
              </a>
              <a href="#como-funciona" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                Como Funciona
              </a>
              <a href="#precos" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                Preços
              </a>
              <a href="#depoimentos" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                Depoimentos
              </a>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <DarkModeToggle />
              <Button 
                variant="ghost" 
                size="sm"
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                asChild
              >
                <Link to="/login">Login</Link>
              </Button>
              <Button 
                size="sm" 
                className="bg-[#0281FE] hover:bg-[#0270E5] text-white px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200"
                asChild
              >
                <Link to="/signup">Começar Agora</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <DarkModeToggle />
              <Button variant="ghost" size="sm" className="p-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-[#0281FE]/10 text-[#0281FE] dark:bg-[#0281FE]/20 mb-8">
              ✨ Análise instantânea, orçamentos e cronogramas precisos
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
            MadeAI Encontra e Entrega Seus{" "}
            <div className="inline-block">
              <RotatingText />
            </div>
            <br />
            Com Um Clique
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Receba seus <RotatingText /> técnicos precisos em segundos
          </p>

          <div className="mb-16">
            <Button 
              size="lg"
              className="bg-[#0281FE] hover:bg-[#0270E5] text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              asChild
            >
              <Link to="/signup">Analisar Projeto Grátis — MadeAI</Link>
            </Button>
          </div>

          {/* Hero Video */}
          <div className="max-w-4xl mx-auto">
            <VideoPlaceholder 
              title="Veja o MadeAI em Ação"
              description="Demonstração completa da plataforma"
              size="xl"
              showControls={true}
              className="rounded-2xl shadow-2xl"
            />
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Analisar a Internet",
                description: "Analise 4+ bilhões de projetos em segundos"
              },
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: "Execute Relatórios de Similaridade", 
                description: "Identifique padrões e otimizações"
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: "Entregue Resultados",
                description: "Orçamentos precisos, cronogramas detalhados..."
              }
            ].map((feature, index) => (
              <Card key={index} className="p-6 bg-white dark:bg-[#252a33] border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200">
                <div className="text-[#0281FE] mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof - Testimonials Section */}
      <section className="py-20 bg-white dark:bg-[#252a33] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {/* Testimonial cards mimicking the Twitter-style layout from Bustem */}
            {[
              {
                name: "Carlos Mendes",
                handle: "@carlosmendes_eng",
                content: "1 ano atrás encontrei um site que copiou meu projeto 1 para 1. Esquema de cores, layout, tema, tudo idêntico exceto minha marca.",
                verified: true
              },
              {
                name: "Ana Souza", 
                handle: "@ana_arquiteta",
                content: "Como pode [@Bustem] facilitar um 'negócio' para copiar ilegalmente e infringir a marca registrada de uma marca? Esquerda é real, direita é falsa.",
                verified: true
              }
            ].map((testimonial, index) => (
              <Card key={index} className="p-6 bg-gray-50 dark:bg-[#1a1d23] border-gray-200 dark:border-gray-700 col-span-2">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-[#0281FE] rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                      {testimonial.verified && <CheckCircle className="w-4 h-4 text-blue-500" />}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{testimonial.handle}</p>
                    <p className="text-gray-800 dark:text-gray-200 mt-3 text-sm leading-relaxed">{testimonial.content}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-16">
            Resultados que Impressionam
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8 mb-16">
            <div ref={projectsCount.countRef} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#0281FE] mb-2">
                {projectsCount.count.toLocaleString()}+
              </div>
              <div className="text-gray-600 dark:text-gray-300">Projetos Analisados</div>
            </div>
            
            <div ref={accuracyCount.countRef} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#0281FE] mb-2">
                {accuracyCount.count}%
              </div>
              <div className="text-gray-600 dark:text-gray-300">Precisão</div>
            </div>
            
            <div ref={timeCount.countRef} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#0281FE] mb-2">
                {timeCount.count}%
              </div>
              <div className="text-gray-600 dark:text-gray-300">Redução de Tempo</div>
            </div>
            
            <div ref={satisfactionCount.countRef} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#0281FE] mb-2">
                {satisfactionCount.count}%
              </div>
              <div className="text-gray-600 dark:text-gray-300">Satisfação</div>
            </div>
          </div>

          <VideoPlaceholder 
            title="Visualize a Eficiência do MadeAI"
            description="Veja como transformamos dados em relatórios precisos"
            className="max-w-4xl mx-auto rounded-2xl"
          />
        </div>
      </section>

      {/* How it Works Section */}
      <section id="como-funciona" className="py-20 bg-white dark:bg-[#252a33] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Como Funciona
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Três passos simples para transformar seus projetos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <VideoPlaceholder 
                  title={`Demonstração: ${feature.title}`}
                  description={feature.description}
                  className="mb-6 rounded-xl"
                />
                
                <div className="bg-[#0281FE] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  {feature.icon}
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Integration Section */}
      <ToolsIntegrationSection />

      {/* User Journey Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Sua Jornada de Sucesso
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Evolua suas habilidades e desbloqueie funcionalidades
            </p>
          </div>

          <VideoPlaceholder 
            title="Visualize sua Progressão na Plataforma"
            description="Veja como evoluir do iniciante ao mestre"
            className="max-w-4xl mx-auto mb-16 rounded-2xl"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {journeySteps.map((step, index) => (
              <Card 
                key={index} 
                className="p-6 bg-white dark:bg-[#252a33] border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 transform hover:scale-105 cursor-pointer group"
              >
                <div className={`${step.color} text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200`}>
                  {step.icon}
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
                  {step.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                  {step.description}
                </p>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full bg-[#0281FE] hover:bg-[#0270E5] text-white border-[#0281FE] font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg animate-pulse"
                >
                  Clique aqui
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precos" className="py-20 bg-white dark:bg-[#252a33] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Planos para Todos os Perfis
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Escolha o plano ideal para suas necessidades
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative p-8 bg-white dark:bg-[#1a1d23] border-2 transition-all duration-200 hover:shadow-xl ${
                  plan.popular 
                    ? 'border-[#0281FE] shadow-lg scale-105' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-[#0281FE]/50'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[#0281FE] text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Mais Popular
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-[#0281FE]">{plan.price}</span>
                    <span className="text-gray-600 dark:text-gray-300">{plan.period}</span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-8">
                    {plan.description}
                  </p>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full py-3 font-semibold rounded-lg transition-all duration-200 ${
                      plan.popular
                        ? 'bg-[#0281FE] hover:bg-[#0270E5] text-white'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                    }`}
                    asChild
                  >
                    <Link to="/signup">{plan.buttonText}</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="depoimentos" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              O Que Nossos Clientes Dizem
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Histórias reais de profissionais que transformaram seus projetos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 bg-white dark:bg-[#252a33] border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-4">{testimonial.avatar}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 italic">
                  "{testimonial.content}"
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-[#0281FE] px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Pronto para Revolucionar Seus Projetos?
          </h2>
          
          <p className="text-xl text-blue-100 mb-12">
            Junte-se a milhares de profissionais que já transformaram sua forma de trabalhar
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              variant="secondary"
              className="bg-white text-[#0281FE] hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl"
              asChild
            >
              <Link to="/signup">Começar Gratuitamente</Link>
            </Button>
            
            <Button 
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-[#0281FE] px-8 py-4 text-lg font-semibold rounded-xl"
              asChild
            >
              <Link to="/contato">Agendar Demonstração</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
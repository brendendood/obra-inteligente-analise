import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Shield, 
  TrendingUp, 
  Users, 
  Bot,
  Calculator,
  Calendar,
  FileText,
  ChevronRight,
  Star,
  Play,
  Menu,
  X,
  CheckCircle,
  ArrowRight,
  Building2,
  BarChart3,
  Clock,
  Target,
  Lightbulb,
  Trophy,
  Gift,
  MapPin
} from "lucide-react";

// Hook para animação de contadores
const useCountAnimation = (target: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isVisible, target, duration]);

  return { count, elementRef };
};

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Animações de contadores
  const projectsCount = useCountAnimation(15000);
  const economyCount = useCountAnimation(30);
  const timeCount = useCountAnimation(75);
  const satisfactionCount = useCountAnimation(98);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">MadeAI</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
              Recursos
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
              Como Funciona
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">
              Preços
            </a>
            <a href="#testimonials" className="text-muted-foreground hover:text-primary transition-colors">
              Depoimentos
            </a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link to="/cadastro">
              <Button>Começar Grátis</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <nav className="container mx-auto px-4 py-4 space-y-4">
              <a href="#features" className="block text-muted-foreground hover:text-primary">
                Recursos
              </a>
              <a href="#how-it-works" className="block text-muted-foreground hover:text-primary">
                Como Funciona
              </a>
              <a href="#pricing" className="block text-muted-foreground hover:text-primary">
                Preços
              </a>
              <a href="#testimonials" className="block text-muted-foreground hover:text-primary">
                Depoimentos
              </a>
              <div className="pt-4 space-y-2">
                <Link to="/login" className="block">
                  <Button variant="ghost" className="w-full">Entrar</Button>
                </Link>
                <Link to="/cadastro" className="block">
                  <Button className="w-full">Começar Grátis</Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-6">
            🚀 Nova Era da Construção Civil
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Gerencie Obras com
            <br />
            Inteligência Artificial
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transforme sua gestão de obras com IA avançada. Orçamentos precisos, cronogramas otimizados 
            e análises inteligentes em uma única plataforma.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/cadastro">
              <Button size="lg" className="text-lg px-8">
                Começar Grátis <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8">
              <Play className="mr-2 h-5 w-5" />
              Ver Demo
            </Button>
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            <div ref={projectsCount.elementRef} className="text-center">
              <div className="text-3xl font-bold text-primary">
                {projectsCount.count.toLocaleString()}+
              </div>
              <div className="text-sm text-muted-foreground">Projetos Criados</div>
            </div>
            <div ref={economyCount.elementRef} className="text-center">
              <div className="text-3xl font-bold text-primary">
                {economyCount.count}%
              </div>
              <div className="text-sm text-muted-foreground">Economia em Custos</div>
            </div>
            <div ref={timeCount.elementRef} className="text-center">
              <div className="text-3xl font-bold text-primary">
                {timeCount.count}%
              </div>
              <div className="text-sm text-muted-foreground">Redução no Tempo</div>
            </div>
            <div ref={satisfactionCount.elementRef} className="text-center">
              <div className="text-3xl font-bold text-primary">
                {satisfactionCount.count}%
              </div>
              <div className="text-sm text-muted-foreground">Satisfação</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Recursos Revolucionários
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Descubra como a IA está transformando a gestão de obras
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Calculator className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Orçamentos Inteligentes</h3>
                <p className="text-muted-foreground mb-4">
                  IA analisa suas plantas e gera orçamentos detalhados automaticamente, 
                  com precisão de 95% e economia de até 8 horas por projeto.
                </p>
                <div className="flex items-center text-primary">
                  <span className="text-sm font-medium">Saiba mais</span>
                  <ChevronRight className="ml-1 h-4 w-4" />
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Cronogramas Otimizados</h3>
                <p className="text-muted-foreground mb-4">
                  Cronogramas que se adaptam automaticamente a mudanças, 
                  otimizando recursos e reduzindo prazos em até 30%.
                </p>
                <div className="flex items-center text-primary">
                  <span className="text-sm font-medium">Saiba mais</span>
                  <ChevronRight className="ml-1 h-4 w-4" />
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Assistente IA 24/7</h3>
                <p className="text-muted-foreground mb-4">
                  Tire dúvidas, receba sugestões e otimize sua obra com 
                  nosso assistente especializado em construção civil.
                </p>
                <div className="flex items-center text-primary">
                  <span className="text-sm font-medium">Saiba mais</span>
                  <ChevronRight className="ml-1 h-4 w-4" />
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Análises Preditivas</h3>
                <p className="text-muted-foreground mb-4">
                  Identifique riscos antes que aconteçam e tome decisões 
                  baseadas em dados históricos e tendências do mercado.
                </p>
                <div className="flex items-center text-primary">
                  <span className="text-sm font-medium">Saiba mais</span>
                  <ChevronRight className="ml-1 h-4 w-4" />
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Gestão de Documentos</h3>
                <p className="text-muted-foreground mb-4">
                  Centralize plantas, contratos e documentos com OCR inteligente 
                  e busca por conteúdo em segundos.
                </p>
                <div className="flex items-center text-primary">
                  <span className="text-sm font-medium">Saiba mais</span>
                  <ChevronRight className="ml-1 h-4 w-4" />
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Segurança Total</h3>
                <p className="text-muted-foreground mb-4">
                  Dados criptografados, backups automáticos e conformidade 
                  com LGPD para máxima proteção dos seus projetos.
                </p>
                <div className="flex items-center text-primary">
                  <span className="text-sm font-medium">Saiba mais</span>
                  <ChevronRight className="ml-1 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Como Funciona
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Em apenas 3 passos simples, transforme sua gestão de obras
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Inteligente</h3>
              <p className="text-muted-foreground">
                Envie plantas, documentos ou descrições do projeto. 
                Nossa IA processa automaticamente todas as informações.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Análise Automática</h3>
              <p className="text-muted-foreground">
                A IA gera orçamentos, cronogramas e análises detalhadas 
                em minutos, não horas.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Gestão Completa</h3>
              <p className="text-muted-foreground">
                Acompanhe o progresso, ajuste recursos e tome decisões 
                inteligentes com dados em tempo real.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gamified Journey Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Sua Jornada de Sucesso
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Desbloqueie conquistas e evolua com a plataforma
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-6 w-6 text-yellow-500" />
              </div>
              <h3 className="font-semibold mb-2">Primeiro Projeto</h3>
              <p className="text-sm text-muted-foreground">
                Complete sua primeira análise
              </p>
              <Badge variant="secondary" className="mt-2">+100 XP</Badge>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="font-semibold mb-2">Especialista</h3>
              <p className="text-sm text-muted-foreground">
                Complete 10 projetos
              </p>
              <Badge variant="secondary" className="mt-2">+500 XP</Badge>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="font-semibold mb-2">Inovador</h3>
              <p className="text-sm text-muted-foreground">
                Use todos os recursos IA
              </p>
              <Badge variant="secondary" className="mt-2">+1000 XP</Badge>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Gift className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="font-semibold mb-2">Mestre</h3>
              <p className="text-sm text-muted-foreground">
                50+ projetos concluídos
              </p>
              <Badge variant="secondary" className="mt-2">+2500 XP</Badge>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button size="lg" className="text-lg px-8">
              Começar Jornada <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Planos Flexíveis
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Escolha o plano ideal para sua necessidade
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-8 hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Gratuito</h3>
                  <div className="text-4xl font-bold mb-2">R$ 0</div>
                  <p className="text-muted-foreground">Para começar</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    3 projetos por mês
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Orçamentos básicos
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Suporte por email
                  </li>
                </ul>
                <Button className="w-full" variant="outline">
                  Começar Grátis
                </Button>
              </CardContent>
            </Card>

            <Card className="p-8 border-primary hover:shadow-xl transition-shadow relative">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                Mais Popular
              </Badge>
              <CardContent className="p-0">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Profissional</h3>
                  <div className="text-4xl font-bold mb-2">R$ 97</div>
                  <p className="text-muted-foreground">por mês</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Projetos ilimitados
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    IA avançada
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Cronogramas otimizados
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Assistente IA 24/7
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Suporte prioritário
                  </li>
                </ul>
                <Button className="w-full">
                  Começar Teste Grátis
                </Button>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
                  <div className="text-4xl font-bold mb-2">Customizado</div>
                  <p className="text-muted-foreground">Para grandes empresas</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Todos os recursos
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Integrações customizadas
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Suporte dedicado
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Treinamento da equipe
                  </li>
                </ul>
                <Button className="w-full" variant="outline">
                  Falar com Vendas
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              O que nossos clientes dizem
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Resultados reais de quem já transformou sua gestão de obras
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Reduziu em 40% o tempo de orçamentação. A IA é impressionantemente precisa 
                  e agora consigo focar no que realmente importa: entregar qualidade."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-medium">JM</span>
                  </div>
                  <div>
                    <div className="font-semibold">João Martins</div>
                    <div className="text-sm text-muted-foreground">Engenheiro Civil</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Nossa construtora economizou R$ 2.3 milhões em 6 meses usando a plataforma. 
                  Os cronogramas otimizados são um divisor de águas."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-medium">AS</span>
                  </div>
                  <div>
                    <div className="font-semibold">Ana Silva</div>
                    <div className="text-sm text-muted-foreground">Diretora de Obras</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "O assistente IA é como ter um especialista 24/7. Já evitou vários problemas 
                  e otimizou nossos recursos de forma impressionante."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-medium">RL</span>
                  </div>
                  <div>
                    <div className="font-semibold">Roberto Lima</div>
                    <div className="text-sm text-muted-foreground">Arquiteto</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-primary text-white">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Pronto para Revolucionar
            <br />
            sua Gestão de Obras?
          </h2>
          
          <p className="text-xl mb-8 opacity-90">
            Junte-se a milhares de profissionais que já transformaram 
            seus projetos com inteligência artificial.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/cadastro">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Começar Grátis Agora <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white hover:text-primary">
              Agendar Demonstração
            </Button>
          </div>

          <p className="text-sm opacity-75">
            ✓ Teste grátis por 14 dias  ✓ Sem cartão de crédito  ✓ Suporte em português
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-background border-t">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Building2 className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold">MadeAI</span>
              </div>
              <p className="text-muted-foreground">
                Transformando a construção civil com inteligência artificial.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#features" className="hover:text-primary">Recursos</a></li>
                <li><a href="#pricing" className="hover:text-primary">Preços</a></li>
                <li><a href="/ia" className="hover:text-primary">Assistente IA</a></li>
                <li><a href="/upload" className="hover:text-primary">Upload</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="/about" className="hover:text-primary">Sobre</a></li>
                <li><a href="/contato" className="hover:text-primary">Contato</a></li>
                <li><a href="/ajuda" className="hover:text-primary">Ajuda</a></li>
                <li><a href="/blog" className="hover:text-primary">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/termos" className="hover:text-primary">Termos de Uso</Link></li>
                <li><Link to="/politica" className="hover:text-primary">Política de Privacidade</Link></li>
                <li><a href="/cookies" className="hover:text-primary">Cookies</a></li>
                <li><a href="/lgpd" className="hover:text-primary">LGPD</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground">
              © 2024 MadeAI. Todos os direitos reservados.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">São Paulo, Brasil</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
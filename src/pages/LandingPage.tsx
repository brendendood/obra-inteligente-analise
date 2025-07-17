import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Bot, 
  Calculator, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Shield, 
  Zap,
  Users,
  TrendingUp,
  ArrowRight,
  Play,
  Star,
  Building,
  Cpu,
  Database,
  Globe,
  FileText,
  BarChart3,
  MessageSquare,
  Sparkles,
  ChevronRight,
  Target,
  Layers,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Importar as imagens mockup
import heroDashboard from '@/assets/hero-dashboard-mockup.jpg';
import budgetFeature from '@/assets/budget-feature-mockup.jpg';
import timelineFeature from '@/assets/timeline-feature-mockup.jpg';
import aiChatFeature from '@/assets/ai-chat-feature-mockup.jpg';

const LandingPage = () => {
  const features = [
    {
      icon: <Calculator className="h-12 w-12 text-primary" />,
      title: "Orçamento Inteligente SINAPI",
      description: "Geração automática de orçamentos técnicos detalhados com base em dados oficiais do SINAPI. Cálculos precisos em segundos.",
      image: budgetFeature,
      stats: "97% de precisão"
    },
    {
      icon: <Calendar className="h-12 w-12 text-primary" />,
      title: "Cronogramas Inteligentes",
      description: "Criação automática de cronogramas divididos em fases reais de execução, com durações e prazos otimizados.",
      image: timelineFeature,
      stats: "Até 70% mais rápido"
    },
    {
      icon: <BarChart3 className="h-12 w-12 text-primary" />,
      title: "Dashboard Financeiro",
      description: "Visualize custo total, custo por m², prazos médios e desempenho dos projetos em tempo real.",
      image: heroDashboard,
      stats: "Dados em tempo real"
    }
  ];

  const testimonials = [
    {
      name: "Carlos Eduardo Silva",
      role: "Arquiteto Senior",
      company: "Silva & Associados",
      quote: "A MadenAI mudou completamente minha rotina. O que levava 2 dias para orçar, agora faço em 10 minutos com muito mais precisão.",
      rating: 5
    },
    {
      name: "Ana Carolina Santos",
      role: "Engenheira Civil",
      company: "Construtora Horizonte",
      quote: "Impressionante como o sistema interpreta os projetos e gera cronogramas realistas. Meus clientes ficaram impressionados.",
      rating: 5
    },
    {
      name: "Roberto Mendes",
      role: "Coordenador de Projetos",
      company: "Mega Construções",
      quote: "Finalmente uma IA que realmente entende de construção. Os cálculos são baseados em dados reais do mercado brasileiro.",
      rating: 5
    }
  ];

  const stats = [
    { value: "2.5M", label: "Projetos analisados", icon: <FileText className="h-5 w-5" /> },
    { value: "89%", label: "Redução de tempo", icon: <Clock className="h-5 w-5" /> },
    { value: "1.2K+", label: "Profissionais ativos", icon: <Users className="h-5 w-5" /> },
    { value: "97%", label: "Precisão nos cálculos", icon: <Target className="h-5 w-5" /> }
  ];

  const integrations = [
    { name: "N8N", description: "Automações inteligentes", icon: <Layers className="h-8 w-8" /> },
    { name: "SINAPI", description: "Dados oficiais", icon: <Database className="h-8 w-8" /> },
    { name: "Supabase", description: "Segurança de dados", icon: <Shield className="h-8 w-8" /> },
    { name: "IA Brasileira", description: "Treinada localmente", icon: <Cpu className="h-8 w-8" /> }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section - Apple Style */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-primary/10 backdrop-blur-sm border border-primary/20 text-primary px-6 py-3 rounded-full text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              <span>O copiloto de IA para arquitetos e engenheiros</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Sua obra,{' '}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                sua IA
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              A MadenAI é o copiloto de IA que interpreta, analisa e organiza seus projetos de arquitetura e engenharia em segundos — como se você tivesse um assistente técnico 24h por dia.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
              <Link to="/cadastro" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  Comece agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold border-2 backdrop-blur-sm hover:bg-primary/5 transition-all duration-300">
                <Play className="mr-2 h-5 w-5" />
                Ver demonstração
              </Button>
            </div>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-8 pt-8 text-gray-600">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Análise em segundos</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">100% Seguro</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Dados SINAPI</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Hero Image */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-6xl px-4">
          <div className="relative hero-float">
            <img 
              src={heroDashboard} 
              alt="Dashboard MadenAI" 
              className="w-full h-auto rounded-t-2xl shadow-2xl border border-gray-200"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent rounded-t-2xl"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="funcionalidades" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Três ferramentas que mudam tudo
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Desenvolvidas especificamente para arquitetos e engenheiros brasileiros
            </p>
          </div>

          <div className="space-y-32">
            {features.map((feature, index) => (
              <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20`}>
                <div className="flex-1 space-y-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-2xl">
                    {feature.icon}
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <Badge variant="outline" className="text-primary border-primary/20">
                        {feature.stats}
                      </Badge>
                      <h3 className="text-3xl lg:text-4xl font-bold text-gray-900">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-xl text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
                <div className="flex-1">
                <div className="relative">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-auto rounded-2xl shadow-2xl border border-gray-200 feature-image"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-2xl"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Como funciona?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Três passos simples para transformar seus projetos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Upload do Projeto",
                description: "Você faz o upload do seu projeto em PDF. Nosso sistema aceita plantas, memoriais e documentos técnicos.",
                icon: <Upload className="h-8 w-8 text-primary" />
              },
              {
                step: "02",
                title: "Análise Inteligente",
                description: "Em segundos, a IA analisa tudo usando dados reais do SINAPI e nossa base de conhecimento brasileira.",
                icon: <Bot className="h-8 w-8 text-primary" />
              },
              {
                step: "03",
                title: "Resultados Prontos",
                description: "Receba orçamento detalhado, cronograma estruturado e dashboard com dados para suas decisões.",
                icon: <CheckCircle className="h-8 w-8 text-primary" />
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                <Card className="p-8 text-center h-full border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="space-y-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                      {item.icon}
                    </div>
                    <div className="space-y-4">
                      <div className="text-primary text-sm font-bold">{item.step}</div>
                      <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ChevronRight className="h-8 w-8 text-primary/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              O que dizem nossos usuários
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Profissionais reais compartilhando suas experiências
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-8 border-0 shadow-md testimonial-card">
                <CardContent className="space-y-6">
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 italic text-lg leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="space-y-1">
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                    <div className="text-sm text-primary">{testimonial.company}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Números que impressionam
            </h2>
            <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto">
              Resultados reais de uma plataforma que funciona
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-4 stats-counter">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full">
                  {stat.icon}
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-bold">{stat.value}</div>
                  <div className="text-primary-foreground/80">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Integrações poderosas
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Conecte-se com as melhores ferramentas do mercado
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {integrations.map((integration, index) => (
              <Card key={index} className="p-6 text-center border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
                    {integration.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-gray-900">{integration.name}</h3>
                    <p className="text-sm text-gray-600">{integration.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
              Pronto para revolucionar seus projetos?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Junte-se a mais de 1.200 profissionais que já transformaram sua rotina com a MadenAI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
              <Link to="/cadastro" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  Comece agora gratuitamente
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="flex justify-center space-x-8 text-sm text-gray-600 pt-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Sem cartão de crédito</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Configuração em 2 minutos</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Suporte especializado</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
import { useEffect, useState } from 'react';
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
  Activity,
  ArrowDown,
  Award,
  Briefcase,
  Eye,
  PieChart,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Clean design without AI-generated images

const LandingPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    
    // Trigger animations on load
    setTimeout(() => setIsVisible(true), 500);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Calculator className="h-8 w-8 text-white" />,
      title: "Orçamento Inteligente SINAPI",
      description: "IA que interpreta seus projetos e gera orçamentos técnicos precisos com base em dados oficiais do SINAPI. Cálculos automáticos em segundos, não em horas.",
      iconSet: [<FileText className="h-6 w-6" />, <PieChart className="h-6 w-6" />, <Target className="h-6 w-6" />],
      stats: "97% de precisão",
      badge: "Dados Oficiais"
    },
    {
      icon: <Calendar className="h-8 w-8 text-white" />,
      title: "Cronogramas Inteligentes", 
      description: "Criação automática de cronogramas divididos em fases reais de execução. Prazos otimizados com base em dados históricos da construção civil brasileira.",
      iconSet: [<Clock className="h-6 w-6" />, <Activity className="h-6 w-6" />, <CheckCircle className="h-6 w-6" />],
      stats: "70% mais rápido",
      badge: "Automação Total"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-white" />,
      title: "Dashboard Financeiro",
      description: "Visualize custo total, custo por m², prazos médios e desempenho dos projetos em tempo real. Insights que facilitam a tomada de decisão.",
      iconSet: [<TrendingUp className="h-6 w-6" />, <Eye className="h-6 w-6" />, <Settings className="h-6 w-6" />],
      stats: "Dados em tempo real", 
      badge: "Insights Poderosos"
    }
  ];

  const process = [
    {
      step: "01",
      title: "Upload Inteligente",
      description: "Você faz o upload do seu projeto em PDF. Aceita plantas, memoriais descritivos, especificações técnicas e documentos complementares.",
      icon: <Upload className="h-10 w-10 text-white" />,
      color: "from-blue-500 to-blue-600"
    },
    {
      step: "02", 
      title: "Análise com IA",
      description: "Em segundos, nossa IA brasileira analisa tudo usando dados reais do SINAPI, padrões de mercado e nossa base de conhecimento especializada.",
      icon: <Bot className="h-10 w-10 text-white" />,
      color: "from-purple-500 to-purple-600"
    },
    {
      step: "03",
      title: "Resultados Prontos",
      description: "Receba orçamento detalhado, cronograma estruturado e dashboard com todos os dados para suas decisões estratégicas.",
      icon: <CheckCircle className="h-10 w-10 text-white" />,
      color: "from-green-500 to-green-600"
    }
  ];

  const testimonials = [
    {
      name: "Carlos Eduardo Silva",
      role: "Arquiteto Senior",
      company: "Silva & Associados Arquitetura",
      quote: "A MadenAI mudou completamente minha rotina. O que antes levava 2 dias para orçar, agora faço em 10 minutos com muito mais precisão. Meus clientes ficam impressionados com a qualidade dos relatórios.",
      rating: 5,
      avatar: "C"
    },
    {
      name: "Ana Carolina Santos",
      role: "Engenheira Civil",
      company: "Construtora Horizonte Ltda",
      quote: "Impressionante como o sistema interpreta os projetos e gera cronogramas realistas. A integração com SINAPI é um diferencial enorme. Economizei 60% do tempo em análises.",
      rating: 5,
      avatar: "A"
    },
    {
      name: "Roberto Mendes",
      role: "Coordenador de Projetos",
      company: "Mega Construções S.A.",
      quote: "Finalmente uma IA que realmente entende de construção brasileira. Os cálculos são baseados em dados reais e os insights ajudam muito nas apresentações para investidores.",
      rating: 5,
      avatar: "R"
    }
  ];

  const stats = [
    { value: "2.5M", label: "Projetos analisados", icon: <FileText className="h-6 w-6" /> },
    { value: "89%", label: "Redução de tempo", icon: <Clock className="h-6 w-6" /> },
    { value: "1.2K+", label: "Profissionais ativos", icon: <Users className="h-6 w-6" /> },
    { value: "97%", label: "Precisão nos cálculos", icon: <Target className="h-6 w-6" /> }
  ];

  const integrations = [
    { name: "N8N", description: "Automações inteligentes", icon: <Layers className="h-10 w-10" />, color: "text-blue-400" },
    { name: "SINAPI", description: "Dados oficiais", icon: <Database className="h-10 w-10" />, color: "text-green-400" },
    { name: "Supabase", description: "Segurança de dados", icon: <Shield className="h-10 w-10" />, color: "text-purple-400" },
    { name: "IA Brasileira", description: "Treinada localmente", icon: <Cpu className="h-10 w-10" />, color: "text-orange-400" }
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Header />
      
      {/* Hero Section - Dark Premium */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-40 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="space-y-12">
            {/* Badge */}
            <div className={`inline-flex items-center space-x-3 glassmorphism px-6 py-4 rounded-full text-sm font-medium transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <Sparkles className="h-5 w-5 text-blue-400" />
              <span className="text-white/90">O copiloto de IA para arquitetos e engenheiros</span>
            </div>
            
            {/* Main Heading */}
            <div className={`space-y-6 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-display font-bold leading-tight">
                Sua obra,{' '}
                <span className="text-gradient">
                  sua IA
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed font-light">
                A MadenAI é o copiloto de IA que interpreta, analisa e organiza seus projetos de arquitetura e engenharia em segundos — como se você tivesse um assistente técnico 24h por dia.
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center max-w-2xl mx-auto transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <Link to="/cadastro" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-16 px-10 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 hover-glow rounded-2xl">
                  Comece agora gratuitamente
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-16 px-10 text-lg font-semibold border-2 border-white/20 text-white glassmorphism hover:bg-white/10 transition-all duration-300 rounded-2xl">
                <Play className="mr-3 h-6 w-6" />
                Ver demonstração
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className={`flex flex-wrap justify-center gap-12 pt-12 text-white/70 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-blue-400" />
                <span className="text-base font-medium">100% Seguro</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-6 w-6 text-green-400" />
                <span className="text-base font-medium">Análise em segundos</span>
              </div>
              <div className="flex items-center space-x-3">
                <Database className="h-6 w-6 text-purple-400" />
                <span className="text-base font-medium">Dados SINAPI</span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="h-6 w-6 text-orange-400" />
                <span className="text-base font-medium">+1.200 profissionais</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Hero Visual Element - Clean Icons */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4">
          <div className="relative hero-float">
            <div className="glassmorphism-dark rounded-t-3xl p-8">
              <div className="grid grid-cols-3 gap-8 text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                    <Calculator className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-white/70 text-sm">Orçamentos</div>
                </div>
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
                    <Calendar className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-white/70 text-sm">Cronogramas</div>
                </div>
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto">
                    <BarChart3 className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-white/70 text-sm">Analytics</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="funcionalidades" className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-24 scroll-reveal">
            <Badge variant="outline" className="mb-6 text-blue-600 border-blue-200 px-6 py-2 text-sm font-medium">
              Funcionalidades Premium
            </Badge>
            <h2 className="text-5xl sm:text-6xl font-display font-bold text-gray-900 mb-8">
              Três ferramentas que 
              <span className="block text-gradient">mudam tudo</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Desenvolvidas especificamente para arquitetos e engenheiros brasileiros
            </p>
          </div>

          {/* Features Grid */}
          <div className="space-y-40">
            {features.map((feature, index) => (
              <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16 lg:gap-24 scroll-reveal`}>
                {/* Text Content */}
                <div className="flex-1 space-y-10">
                  <div className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br ${index % 3 === 0 ? 'from-blue-500 to-blue-600' : index % 3 === 1 ? 'from-purple-500 to-purple-600' : 'from-green-500 to-green-600'} rounded-3xl premium-shadow`}>
                    {feature.icon}
                  </div>
                  
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <Badge variant="outline" className="text-blue-600 border-blue-200 text-sm font-medium px-4 py-2">
                        {feature.badge}
                      </Badge>
                      <h3 className="text-4xl lg:text-5xl font-display font-bold text-gray-900">
                        {feature.title}
                      </h3>
                      <p className="text-xl text-gray-600 leading-relaxed font-light">
                        {feature.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Target className="h-5 w-5 text-green-500" />
                        <span className="text-lg font-semibold text-gray-900">{feature.stats}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Feature Visual */}
                <div className="flex-1">
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-70"></div>
                    <div className="relative glassmorphism rounded-3xl premium-shadow p-12">
                      <div className="grid grid-cols-3 gap-8 text-center">
                        {feature.iconSet.map((icon, iconIndex) => (
                          <div key={iconIndex} className="space-y-4">
                            <div className={`w-16 h-16 bg-gradient-to-br ${index % 3 === 0 ? 'from-blue-500 to-blue-600' : index % 3 === 1 ? 'from-purple-500 to-purple-600' : 'from-green-500 to-green-600'} rounded-2xl flex items-center justify-center mx-auto text-white`}>
                              {icon}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-8 text-center">
                        <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${index % 3 === 0 ? 'from-blue-500 to-blue-600' : index % 3 === 1 ? 'from-purple-500 to-purple-600' : 'from-green-500 to-green-600'} rounded-3xl`}>
                          {feature.icon}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-32 bg-gradient-to-br from-slate-50 to-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 scroll-reveal">
            <h2 className="text-5xl sm:text-6xl font-display font-bold text-gray-900 mb-8">
              Como <span className="text-gradient">funciona?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Três passos simples para transformar seus projetos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {process.map((item, index) => (
              <div key={index} className="relative scroll-reveal feature-reveal">
                <div className="relative glassmorphism p-10 text-center h-full rounded-3xl premium-shadow hover:premium-shadow transition-all duration-500 group">
                  {/* Step Number */}
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-white font-bold text-xl premium-shadow`}>
                      {item.step}
                    </div>
                  </div>
                  
                  <div className="pt-8 space-y-6">
                    <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${item.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      {item.icon}
                    </div>
                    
                    <h3 className="text-2xl font-display font-bold text-gray-900">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
                
                {/* Connector */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-8 w-8 text-blue-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 scroll-reveal">
            <h2 className="text-5xl sm:text-6xl font-display font-bold text-gray-900 mb-8">
              O que dizem nossos <span className="text-gradient">usuários</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Profissionais reais compartilhando suas experiências transformadoras
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="scroll-reveal feature-reveal">
                <div className="glassmorphism p-8 rounded-3xl premium-shadow hover:premium-shadow transition-all duration-500 h-full">
                  {/* Rating */}
                  <div className="flex space-x-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  {/* Quote */}
                  <blockquote className="text-gray-700 text-lg leading-relaxed mb-8 font-light italic">
                    "{testimonial.quote}"
                  </blockquote>
                  
                  {/* Author */}
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-lg">{testimonial.name}</div>
                      <div className="text-gray-600 text-sm">{testimonial.role}</div>
                      <div className="text-blue-600 text-sm font-medium">{testimonial.company}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 scroll-reveal">
            <h2 className="text-5xl sm:text-6xl font-display font-bold mb-8">
              Números que <span className="text-gradient">impressionam</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto font-light">
              Resultados reais de uma plataforma que realmente funciona
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-6 scroll-reveal counter-animation">
                <div className="inline-flex items-center justify-center w-20 h-20 glassmorphism-dark rounded-2xl">
                  <div className="text-blue-400">
                    {stat.icon}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-5xl font-display font-bold text-white">{stat.value}</div>
                  <div className="text-white/70 text-lg">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 scroll-reveal">
            <h2 className="text-5xl sm:text-6xl font-display font-bold text-gray-900 mb-8">
              Integrações <span className="text-gradient">poderosas</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Conecte-se com as melhores ferramentas e dados do mercado brasileiro
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {integrations.map((integration, index) => (
              <div key={index} className="scroll-reveal feature-reveal">
                <div className="glassmorphism p-8 text-center rounded-3xl premium-shadow hover:premium-shadow transition-all duration-500 group">
                  <div className={`inline-flex items-center justify-center w-20 h-20 bg-gray-900 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 ${integration.color}`}>
                    {integration.icon}
                  </div>
                  <h3 className="text-xl font-display font-bold text-gray-900 mb-2">{integration.name}</h3>
                  <p className="text-gray-600 text-sm">{integration.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-32 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center scroll-reveal">
          <div className="glassmorphism p-12 rounded-3xl premium-shadow">
            <Award className="h-16 w-16 text-blue-500 mx-auto mb-8" />
            <h2 className="text-4xl sm:text-5xl font-display font-bold text-gray-900 mb-6">
              Desenvolvido com tecnologia nacional
            </h2>
            <p className="text-xl text-gray-600 mb-8 font-light">
              Plataforma 100% brasileira, treinada com dados reais do mercado nacional e integrada aos principais sistemas do país.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-gray-600">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-500" />
                <span>LGPD Compliance</span>
              </div>
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-blue-500" />
                <span>Dados SINAPI</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-purple-500" />
                <span>Suporte Nacional</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center scroll-reveal">
          <div className="space-y-12">
            <div className="space-y-8">
              <h2 className="text-5xl sm:text-6xl font-display font-bold">
                Pronto para revolucionar <span className="text-gradient">seus projetos?</span>
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto font-light">
                Junte-se a mais de 1.200 profissionais que já transformaram sua rotina com a MadenAI. Comece gratuitamente, sem cartão de crédito.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-2xl mx-auto">
              <Link to="/cadastro" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-16 px-12 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 hover-glow rounded-2xl">
                  Comece agora
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
            </div>
            
            <div className="flex justify-center space-x-12 text-sm text-white/70 pt-8">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>Sem cartão de crédito</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-400" />
                <span>Configuração em 2 minutos</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-purple-400" />
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
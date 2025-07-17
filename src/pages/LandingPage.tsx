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

// Hook para contador animado
const useCountAnimation = (target: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
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

const LandingPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const counter1 = useCountAnimation(2500);
  const counter2 = useCountAnimation(95);
  const counter3 = useCountAnimation(80);
  const counter4 = useCountAnimation(1200);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: Upload,
      title: "Upload Inteligente",
      description: "Faça upload de plantas, documentos ou dados do seu projeto arquitetônico"
    },
    {
      icon: Bot,
      title: "IA Especializada",
      description: "Nossa IA analisa cada detalhe técnico e gera insights precisos"
    },
    {
      icon: Calculator,
      title: "Orçamentos Automáticos",
      description: "Orçamentos detalhados gerados automaticamente com precisão profissional"
    },
    {
      icon: Calendar,
      title: "Cronogramas Inteligentes",
      description: "Cronogramas otimizados considerando recursos e dependências"
    },
    {
      icon: FileText,
      title: "Documentação Completa",
      description: "Relatórios técnicos e documentação profissional automatizada"
    },
    {
      icon: BarChart3,
      title: "Análises Avançadas",
      description: "Insights detalhados sobre custos, prazos e recursos necessários"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Floating Header */}
      <header className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ${
        scrollY > 50 
          ? 'bg-white/95 backdrop-blur-xl border border-slate-200 shadow-lg shadow-slate-900/5' 
          : 'bg-white/80 backdrop-blur-md border border-slate-200/50'
      } rounded-2xl px-8 py-4 max-w-2xl w-full mx-4`}>
        <div className="flex items-center justify-between">
          <div className="font-display font-bold text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            MadenAI
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="rounded-xl hover:bg-slate-100">
                Entrar
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                Começar Grátis
              </Button>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 text-blue-700 text-sm font-medium">
              <Zap className="h-4 w-4" />
              Análise de Projetos com IA
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold text-slate-900 leading-tight">
              Transforme seus projetos em{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                orçamentos precisos
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Nossa IA especializada analisa plantas arquitetônicas e gera orçamentos, cronogramas e relatórios técnicos automaticamente, economizando semanas de trabalho.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link to="/upload">
                <Button size="lg" className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-blue-500/40">
                  Analisar Projeto Grátis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-xl border-slate-200 hover:bg-slate-50">
                Ver Demonstração
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-6 text-sm text-slate-500 pt-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Grátis para começar
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Resultados em minutos
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Precisão profissional
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-display font-bold text-slate-900 mb-6">
              Tudo que você precisa para seus projetos
            </h2>
            <p className="text-xl text-slate-600">
              Uma plataforma completa que transforma a gestão de projetos arquitetônicos com inteligência artificial
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group p-8 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center mb-6 group-hover:from-blue-100 group-hover:to-indigo-100 transition-colors">
                  <feature.icon className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-display font-bold text-slate-900 mb-6">
              Como funciona
            </h2>
            <p className="text-xl text-slate-600">
              Processo simples e automatizado para análise completa de projetos
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl shadow-lg shadow-blue-500/25">
                  {step.number}
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed max-w-sm mx-auto">{step.description}</p>
                
                {index < steps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-10 -right-4 h-8 w-8 text-slate-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Specs Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-display font-bold text-slate-900 mb-6">
              Especificações Técnicas
            </h2>
            <p className="text-xl text-slate-600">
              Tecnologias e conformidades que garantem a precisão dos seus projetos
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {techSpecs.map((spec, index) => (
              <div key={index} className="group p-8 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-6 shadow-md shadow-blue-500/10">
                  <spec.icon className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{spec.title}</h3>
                <p className="text-slate-600 leading-relaxed">{spec.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-display font-bold text-slate-900 mb-6">
              Planos para cada necessidade
            </h2>
            <p className="text-xl text-slate-600">
              Escolha o plano ideal para você ou sua empresa
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div key={index} className={`p-8 rounded-2xl border ${
                plan.popular 
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-600 border-transparent text-white' 
                  : 'bg-white border-slate-200'
              } relative`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-semibold px-4 py-1 rounded-full shadow-lg">
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
                  className={`w-full h-12 text-base font-semibold rounded-xl ${
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

      {/* Testimonials */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-display font-bold text-slate-900 mb-6">
              O que dizem nossos usuários
            </h2>
            <p className="text-xl text-slate-600">
              Profissionais que já transformaram sua forma de trabalhar
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 border border-slate-200">
                <div className="flex items-start gap-4 mb-6">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-xl bg-white p-1 border border-slate-200"
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
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold text-white mb-4">
              Resultados que impressionam
            </h2>
            <p className="text-xl text-blue-100">
              Números que comprovam a eficiência da nossa plataforma
            </p>
          </div>
          
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div ref={counter1.countRef} className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {counter1.count}+
                </div>
                <div className="text-blue-100">Projetos Analisados</div>
              </div>
              <div className="text-center">
                <div ref={counter2.countRef} className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {counter2.count}%
                </div>
                <div className="text-blue-100">Precisão</div>
              </div>
              <div className="text-center">
                <div ref={counter3.countRef} className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {counter3.count}%
                </div>
                <div className="text-blue-100">Economia de Tempo</div>
              </div>
              <div className="text-center">
                <div ref={counter4.countRef} className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {counter4.count}+
                </div>
                <div className="text-blue-100">Usuários Ativos</div>
              </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-12 border border-slate-200">
            <h2 className="text-4xl font-display font-bold text-slate-900 mb-6">
              Pronto para revolucionar seus projetos?
            </h2>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de profissionais que já economizam tempo e aumentam a precisão com nossa IA
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/upload">
                <Button size="lg" className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg shadow-blue-500/25">
                  Começar Gratuitamente
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-xl border-slate-300 hover:bg-slate-50">
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

      {/* Footer */}
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
                <a href="https://instagram.com" className="text-slate-400 hover:text-slate-600 transition-colors" target="_blank" rel="noopener">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="https://linkedin.com" className="text-slate-400 hover:text-slate-600 transition-colors" target="_blank" rel="noopener">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="https://youtube.com" className="text-slate-400 hover:text-slate-600 transition-colors" target="_blank" rel="noopener">
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Produto</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/features" className="text-slate-500 hover:text-slate-700 transition-colors">
                    Recursos
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-slate-500 hover:text-slate-700 transition-colors">
                    Preços
                  </Link>
                </li>
                <li>
                  <Link to="/demo" className="text-slate-500 hover:text-slate-700 transition-colors">
                    Demonstração
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Para quem é</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/engineers" className="text-slate-500 hover:text-slate-700 transition-colors">
                    Engenheiros
                  </Link>
                </li>
                <li>
                  <Link to="/architects" className="text-slate-500 hover:text-slate-700 transition-colors">
                    Arquitetos
                  </Link>
                </li>
                <li>
                  <Link to="/constructors" className="text-slate-500 hover:text-slate-700 transition-colors">
                    Construtoras
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Tecnologias</h3>
              <ul className="space-y-2">
                <li>
                  <a href="https://www.ibge.gov.br/sinapi" className="text-slate-500 hover:text-slate-700 transition-colors" target="_blank" rel="noopener">
                    SINAPI
                  </a>
                </li>
                <li>
                  <a href="https://supabase.com" className="text-slate-500 hover:text-slate-700 transition-colors" target="_blank" rel="noopener">
                    Supabase
                  </a>
                </li>
                <li>
                  <a href="https://n8n.io" className="text-slate-500 hover:text-slate-700 transition-colors" target="_blank" rel="noopener">
                    N8N
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/privacy" className="text-slate-500 hover:text-slate-700 transition-colors">
                    Privacidade
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-slate-500 hover:text-slate-700 transition-colors">
                    Termos
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-slate-500">
              © 2024 MadenAI. Todos os direitos reservados.
            </div>
            <div className="flex gap-8">
              <img src="https://www.ibge.gov.br/novo-portal-v3/img/logo-ibge.png" alt="SINAPI - IBGE" className="h-8 opacity-75 hover:opacity-100 transition-opacity" />
              <img src="https://supabase.com/img/supabase-dark.svg" alt="Supabase" className="h-8 opacity-75 hover:opacity-100 transition-opacity" />
              <img src="https://n8n.io/favicon.svg" alt="N8N" className="h-8 opacity-75 hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
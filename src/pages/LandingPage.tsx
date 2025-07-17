import { useEffect, useState } from 'react';
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
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [scrollY, setScrollY] = useState(0);

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
      description: "Envie plantas, especificações ou qualquer documento do projeto"
    },
    {
      number: "02", 
      title: "IA Analisa",
      description: "Nossa IA processa e extrai informações técnicas detalhadas"
    },
    {
      number: "03",
      title: "Receba Resultados",
      description: "Orçamentos, cronogramas e relatórios prontos em minutos"
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

      {/* Stats */}
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
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">2.5K+</div>
              <div className="text-blue-100">Projetos Analisados</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">95%</div>
              <div className="text-blue-100">Precisão</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">80%</div>
              <div className="text-blue-100">Economia de Tempo</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">1.2K+</div>
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
      <footer className="py-12 px-4 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="font-display font-bold text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4 md:mb-0">
              MadenAI
            </div>
            <div className="flex items-center gap-8 text-slate-600">
              <Link to="/privacy" className="hover:text-slate-900 transition-colors">
                Privacidade
              </Link>
              <Link to="/terms" className="hover:text-slate-900 transition-colors">
                Termos
              </Link>
              <span>© 2024 MadenAI. Todos os direitos reservados.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
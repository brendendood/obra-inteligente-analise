
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Upload, 
  Bot, 
  Calculator, 
  Calendar, 
  FileText, 
  CheckCircle, 
  Clock, 
  Shield, 
  Zap,
  Users,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const LandingPage = () => {
  const features = [
    {
      icon: <Upload className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
      title: "Upload Inteligente",
      description: "Leitura automática de projetos PDF com análise técnica precisa"
    },
    {
      icon: <Bot className="h-8 w-8 text-purple-600 dark:text-purple-400" />,
      title: "Chat com IA Técnica",
      description: "Assistente especializado em engenharia e construção civil"
    },
    {
      icon: <Calculator className="h-8 w-8 text-orange-600 dark:text-orange-400" />,
      title: "Orçamento Inteligente",
      description: "Geração automática com base SINAPI e preços regionais"
    },
    {
      icon: <Calendar className="h-8 w-8 text-green-600 dark:text-green-400" />,
      title: "Cronograma da Obra",
      description: "Planejamento temporal com marcos e dependências"
    },
    {
      icon: <FileText className="h-8 w-8 text-red-600 dark:text-red-400" />,
      title: "Documentos Técnicos",
      description: "Memorial descritivo, relatórios e exportação profissional"
    },
    {
      icon: <Shield className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />,
      title: "Segurança Total",
      description: "Seus projetos protegidos com criptografia de ponta"
    }
  ];

  const benefits = [
    "Economia de 70% do tempo em orçamentos",
    "Análise técnica precisa em minutos",
    "Controle total do cronograma",
    "Documentação profissional automatizada"
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d0d0d]">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:bg-gradient-to-br dark:from-[#0d0d0d] dark:via-[#1a1a1a] dark:to-[#232323] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Zap className="h-4 w-4" />
              <span>IA Especializada em Construção Civil</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-[#f2f2f2] mb-6 leading-tight">
              Sua obra,{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-green-600 dark:to-green-400 bg-clip-text text-transparent">
                sua IA
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-[#bbbbbb] max-w-3xl mx-auto mb-10 leading-relaxed">
              Gerencie projetos, cronogramas e orçamentos com a ajuda da inteligência artificial. 
              Para engenheiros, arquitetos e equipes que querem acelerar suas obras.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto mb-12">
              <a href="#funcionalidades">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-border dark:border-[#333] text-foreground dark:text-[#f2f2f2] hover:bg-accent dark:hover:bg-[#232323]">
                  Ver como funciona
                </Button>
              </a>
              <Link to="/cadastro">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:bg-gradient-to-r dark:from-green-600 dark:to-green-500 dark:hover:from-green-700 dark:hover:to-green-600 text-white">
                  Começar agora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center space-x-6 text-slate-600 dark:text-[#bbbbbb]">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Análise em 2 minutos</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span className="text-sm">100% Seguro</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="funcionalidades" className="py-20 bg-white dark:bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-[#f2f2f2] mb-4">
              Tudo que você precisa em um só lugar
            </h2>
            <p className="text-xl text-slate-600 dark:text-[#bbbbbb] max-w-2xl mx-auto">
              Ferramentas profissionais potencializadas por inteligência artificial
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md dark:bg-[#1a1a1a] dark:border-[#333] dark:hover:shadow-xl">
                <CardHeader>
                  <div className="bg-slate-50 dark:bg-[#232323] p-3 rounded-2xl w-fit mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900 dark:text-[#f2f2f2]">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-[#bbbbbb] leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-slate-50 dark:bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-[#f2f2f2] mb-6">
                Para engenheiros, arquitetos e equipes de obra
              </h2>
              <p className="text-lg text-slate-600 dark:text-[#bbbbbb] mb-8">
                Profissionais como você já economizam horas de trabalho e aumentam a precisão de seus projetos.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-[#f2f2f2] font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white dark:bg-[#232323] p-6 rounded-2xl shadow-lg dark:border dark:border-[#333]">
                <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-4" />
                <div className="text-2xl font-bold text-slate-900 dark:text-[#f2f2f2] mb-2">70%</div>
                <div className="text-slate-600 dark:text-[#bbbbbb]">Menos tempo em orçamentos</div>
              </div>
              <div className="bg-white dark:bg-[#232323] p-6 rounded-2xl shadow-lg dark:border dark:border-[#333]">
                <Users className="h-8 w-8 text-green-600 dark:text-green-400 mb-4" />
                <div className="text-2xl font-bold text-slate-900 dark:text-[#f2f2f2] mb-2">500+</div>
                <div className="text-slate-600 dark:text-[#bbbbbb]">Profissionais ativos</div>
              </div>
              <div className="bg-white dark:bg-[#232323] p-6 rounded-2xl shadow-lg dark:border dark:border-[#333]">
                <Clock className="h-8 w-8 text-orange-600 dark:text-orange-400 mb-4" />
                <div className="text-2xl font-bold text-slate-900 dark:text-[#f2f2f2] mb-2">2min</div>
                <div className="text-slate-600 dark:text-[#bbbbbb]">Análise automática</div>
              </div>
              <div className="bg-white dark:bg-[#232323] p-6 rounded-2xl shadow-lg dark:border dark:border-[#333]">
                <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-4" />
                <div className="text-2xl font-bold text-slate-900 dark:text-[#f2f2f2] mb-2">100%</div>
                <div className="text-slate-600 dark:text-[#bbbbbb]">Dados seguros</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precos" className="py-20 bg-white dark:bg-[#0d0d0d]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-[#f2f2f2] mb-4">
            Comece gratuitamente
          </h2>
          <p className="text-xl text-slate-600 dark:text-[#bbbbbb] mb-12">
            Teste todas as funcionalidades sem compromisso
          </p>

          <Card className="max-w-md mx-auto border-2 border-blue-200 dark:border-green-600 shadow-xl dark:bg-[#1a1a1a]">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:bg-gradient-to-r dark:from-green-900/30 dark:to-green-800/30">
              <CardTitle className="text-2xl font-bold text-center text-foreground dark:text-[#f2f2f2]">Plano Gratuito</CardTitle>
              <div className="text-center">
                <span className="text-4xl font-bold text-blue-600 dark:text-green-400">R$ 0</span>
                <span className="text-slate-600 dark:text-[#bbbbbb]">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-3 mb-6">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="text-foreground dark:text-[#f2f2f2]">5 projetos por mês</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="text-foreground dark:text-[#f2f2f2]">Análise com IA</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="text-foreground dark:text-[#f2f2f2]">Orçamento básico</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="text-foreground dark:text-[#f2f2f2]">Suporte por email</span>
                </li>
              </ul>
              <Link to="/cadastro">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 dark:bg-gradient-to-r dark:from-green-600 dark:to-green-500 text-white">
                  Começar Grátis
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 dark:bg-gradient-to-r dark:from-green-600 dark:to-green-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Pronto para começar sua primeira obra com inteligência?
          </h2>
          <p className="text-xl text-blue-100 dark:text-green-100 mb-8 max-w-2xl mx-auto">
            Junte-se a centenas de profissionais que já aceleram suas obras com IA
          </p>
          <Link to="/cadastro">
            <Button size="lg" className="bg-white text-blue-600 dark:text-green-600 hover:bg-blue-50 dark:hover:bg-gray-100 font-semibold">
              Criar conta grátis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Zap, 
  Brain, 
  BarChart3, 
  Clock, 
  CheckCircle, 
  Star,
  Users,
  Sparkles,
  Target,
  TrendingUp,
  Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '@/components/layout/Footer';

const LandingPage = () => {
  const [showSuccessCTA, setShowSuccessCTA] = useState(false);

  useEffect(() => {
    // Simula uma jornada de sucesso após alguns segundos
    const timer = setTimeout(() => {
      setShowSuccessCTA(true);
    }, 5000);

    return () => clearTimeout(timer); // Limpa o timer se o componente for desmontado
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleComecarGratis = () => {
    scrollToSection('planos');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                MadenAI
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => scrollToSection('recursos')}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Recursos
              </button>
              <button 
                onClick={() => scrollToSection('planos')}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Planos
              </button>
              <Link to="/login" className="text-gray-600 hover:text-blue-600 transition-colors">
                Entrar
              </Link>
              <Button onClick={handleComecarGratis} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                Começar Grátis
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex items-center">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                A Inteligência Artificial que Revoluciona seus Projetos
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-md">
                Análise automatizada, orçamentos precisos e cronogramas inteligentes para engenheiros e arquitetos.
              </p>
              <div className="space-x-4">
                <Button onClick={handleComecarGratis} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  Começar Grátis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Link to="/login">
                  <Button variant="outline">
                    Experimentar Demo
                  </Button>
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 mt-12 lg:mt-0">
              <img
                src="https://images.unsplash.com/photo-1617514019564-39a66e999ca8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80"
                alt="Engenheiro trabalhando com IA"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Recursos Section */}
      <section id="recursos" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Recursos Poderosos para sua Produtividade
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubra como a MadenAI pode transformar seus projetos com inteligência e automação.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Análise Inteligente */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 rounded-lg bg-blue-500/20">
                    <Brain className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Análise Inteligente</h3>
                </div>
                <p className="text-gray-600">
                  Nossa IA analisa plantas, identifica padrões e gera insights valiosos em segundos.
                </p>
              </CardContent>
            </Card>

            {/* Orçamentos Precisos */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 rounded-lg bg-green-500/20">
                    <BarChart3 className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Orçamentos Precisos</h3>
                </div>
                <p className="text-gray-600">
                  Crie orçamentos detalhados com base em dados atualizados e preços de mercado.
                </p>
              </CardContent>
            </Card>

            {/* Cronogramas Automáticos */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 rounded-lg bg-orange-500/20">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Cronogramas Automáticos</h3>
                </div>
                <p className="text-gray-600">
                  Gere cronogramas de obras automaticamente, otimizando tempo e recursos.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section id="journey" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Sua Jornada para o Futuro da Construção
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Acompanhe sua evolução com a MadenAI, desde a análise inicial até a conclusão do projeto.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Passo 1 */}
            <Card className="border-t-4 border-blue-500">
              <CardContent className="p-6">
                <div className="text-blue-600 text-5xl font-bold mb-4">1</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload do Projeto</h3>
                <p className="text-gray-600">
                  Envie suas plantas e documentos para nossa plataforma.
                </p>
              </CardContent>
            </Card>

            {/* Passo 2 */}
            <Card className="border-t-4 border-green-500">
              <CardContent className="p-6">
                <div className="text-green-600 text-5xl font-bold mb-4">2</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Análise com IA</h3>
                <p className="text-gray-600">
                  Nossa IA analisa seu projeto e extrai informações cruciais.
                </p>
              </CardContent>
            </Card>

            {/* Passo 3 */}
            <Card className="border-t-4 border-orange-500">
              <CardContent className="p-6">
                <div className="text-orange-600 text-5xl font-bold mb-4">3</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Geração de Orçamento</h3>
                <p className="text-gray-600">
                  Receba um orçamento detalhado e preciso em minutos.
                </p>
              </CardContent>
            </Card>

            {/* Passo 4 */}
            <Card className="border-t-4 border-indigo-500">
              <CardContent className="p-6">
                <div className="text-indigo-600 text-5xl font-bold mb-4">4</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Cronograma Inteligente</h3>
                <p className="text-gray-600">
                  Otimize seu tempo com um cronograma de obra automatizado.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Seção de Planos */}
      <section id="planos" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Escolha seu Plano
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Planos flexíveis para diferentes necessidades e tamanhos de projetos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Plano Gratuito */}
            <Card className="relative">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Gratuito</h3>
                  <div className="text-4xl font-bold text-blue-600 mb-2">R$ 0</div>
                  <p className="text-gray-500">Para começar</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>3 análises por mês</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Orçamentos básicos</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Suporte por email</span>
                  </li>
                </ul>
                <Link to="/cadastro" className="w-full">
                  <Button variant="outline" className="w-full">
                    Começar Agora
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Plano Pro */}
            <Card className="relative border-2 border-blue-500 shadow-lg scale-105">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1">
                  Mais Popular
                </Badge>
              </div>
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
                  <div className="text-4xl font-bold text-blue-600 mb-2">R$ 49</div>
                  <p className="text-gray-500">por mês</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Análises ilimitadas</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>IA avançada</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Cronogramas automáticos</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Suporte prioritário</span>
                  </li>
                </ul>
                <Link to="/cadastro" className="w-full">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    Começar Agora
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Plano Enterprise */}
            <Card className="relative">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
                  <div className="text-4xl font-bold text-blue-600 mb-2">R$ 199</div>
                  <p className="text-gray-500">por mês</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Tudo do Pro</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>API personalizada</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Integrações N8N</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Suporte 24/7</span>
                  </li>
                </ul>
                <Link to="/cadastro" className="w-full">
                  <Button variant="outline" className="w-full">
                    Começar Agora
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              O que Nossos Clientes Estão Dizendo
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Veja como a MadenAI tem transformado a vida de engenheiros e arquitetos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500" />
                </div>
                <p className="text-gray-700 mb-4">
                  "A MadenAI revolucionou a forma como fazemos orçamentos. A precisão e a velocidade são impressionantes!"
                </p>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">João Silva, Engenheiro Civil</span>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500" />
                </div>
                <p className="text-gray-700 mb-4">
                  "Com os cronogramas automáticos, economizamos tempo e otimizamos nossos recursos de forma eficiente."
                </p>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Maria Santos, Arquiteta</span>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 3 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500" />
                </div>
                <p className="text-gray-700 mb-4">
                  "A análise inteligente da MadenAI nos permite tomar decisões mais informadas e reduzir custos."
                </p>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Carlos Ferreira, Engenheiro de Custos</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-24 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              Pronto para Transformar seus Projetos?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
              Comece agora e descubra como a MadenAI pode impulsionar sua produtividade e reduzir seus custos.
            </p>
            <div className="space-x-4">
              <Button onClick={handleComecarGratis} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                Começar Grátis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Link to="/login">
                <Button variant="outline">
                  Experimentar Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Success Journey CTA - Updated text */}
      {showSuccessCTA && (
        <div className="fixed bottom-8 right-8 z-50 animate-bounce">
          <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-2xl border-0 max-w-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">🎉 Parabéns!</h3>
                  <p className="text-sm opacity-90">Você ganhou 10% OFF no plano PRO</p>
                </div>
              </div>
              <Link to="/cadastro?promo=journey10">
                <Button className="w-full bg-white text-green-600 hover:bg-gray-100 font-semibold">
                  Resgatar Desconto
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default LandingPage;

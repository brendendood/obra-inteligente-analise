import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Upload, 
  Bot, 
  Calculator, 
  Calendar, 
  CheckCircle, 
  ArrowRight,
  BarChart3,
  Users,
  Clock,
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Floating Header */}
      <header className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-white/80 backdrop-blur-md border border-gray-200' : 'bg-transparent'} rounded-full px-8 py-4`}>
        <div className="flex items-center justify-between">
          <div className="font-display font-bold text-xl text-gray-900">MadenAI</div>
          <Link to="/login">
            <Button variant="ghost" className="rounded-full">
              Entrar
            </Button>
          </Link>
        </div>
      </header>
      
      {/* Hero Section - Minimal */}
      <section className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          {/* Main Title */}
          <div className="space-y-6">
            <h1 className="text-6xl sm:text-8xl font-display font-bold text-gray-900">
              Sua obra,{' '}
              <span className="text-blue-600">sua IA</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
              Orçamentos e cronogramas automáticos em segundos
            </p>
          </div>
          
          {/* Single CTA */}
          <Link to="/cadastro">
            <Button size="lg" className="h-14 px-12 text-lg font-medium bg-blue-600 hover:bg-blue-700 rounded-full">
              Começar agora
            </Button>
          </Link>
          
          {/* Simple Features */}
          <div className="grid grid-cols-3 gap-8 pt-16 max-w-2xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
                <Calculator className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-sm text-gray-600">Orçamentos</div>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-sm text-gray-600">Cronogramas</div>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-sm text-gray-600">Relatórios</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works - Minimal */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-display font-bold text-gray-900 mb-16">
            Como funciona
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto text-white font-bold">
                1
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Upload</h3>
                <p className="text-gray-600 text-sm">Envie seu projeto PDF</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto text-white font-bold">
                2
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Análise</h3>
                <p className="text-gray-600 text-sm">IA processa em segundos</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto text-white font-bold">
                3
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Resultado</h3>
                <p className="text-gray-600 text-sm">Orçamento e cronograma prontos</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats - Minimal */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gray-900">1.2K+</div>
              <div className="text-sm text-gray-600">Usuários</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gray-900">2.5M</div>
              <div className="text-sm text-gray-600">Projetos</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gray-900">97%</div>
              <div className="text-sm text-gray-600">Precisão</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gray-900">89%</div>
              <div className="text-sm text-gray-600">Economia</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 text-center space-y-8">
          <h2 className="text-4xl font-display font-bold text-gray-900">
            Pronto para começar?
          </h2>
          <Link to="/cadastro">
            <Button size="lg" className="h-14 px-12 text-lg font-medium bg-blue-600 hover:bg-blue-700 rounded-full">
              Criar conta grátis
            </Button>
          </Link>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-12 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 text-center text-gray-600 text-sm">
          © 2024 MadenAI. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
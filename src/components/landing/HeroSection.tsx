
import { Button } from '@/components/ui/button';
import { Zap, Clock, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:bg-gradient-to-br dark:from-[#0d0d0d] dark:via-[#1a1a1a] dark:to-[#232323] py-12 sm:py-16 lg:py-20 mobile-safe">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 sm:px-4 py-2 rounded-full text-sm font-medium mb-6 sm:mb-8 animate-fade-in">
            <Zap className="h-4 w-4 flex-shrink-0" />
            <span className="break-words">IA Especializada em Construção Civil</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-[#f2f2f2] mb-4 sm:mb-6 leading-tight animate-slide-in break-words">
            Sua obra,{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-green-600 dark:to-green-400 bg-clip-text text-transparent">
              sua IA
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-600 dark:text-[#bbbbbb] max-w-3xl mx-auto mb-8 sm:mb-10 leading-relaxed animate-fade-in break-words px-2">
            Gerencie projetos, cronogramas e orçamentos com a ajuda da inteligência artificial. 
            Para engenheiros, arquitetos e equipes que querem acelerar suas obras.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center max-w-lg mx-auto mb-8 sm:mb-12 animate-scale-in px-2">
            <a href="#funcionalidades" className="flex-1 sm:flex-none">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto border-border dark:border-[#333] text-foreground dark:text-[#f2f2f2] hover:bg-accent dark:hover:bg-[#232323] transition-all duration-200 mobile-button"
              >
                Ver como funciona
              </Button>
            </a>
            <Link to="/cadastro" className="flex-1 sm:flex-none">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:bg-gradient-to-r dark:from-green-600 dark:to-green-500 dark:hover:from-green-700 dark:hover:to-green-600 text-white transition-all duration-200 mobile-button"
              >
                Começar agora
                <ArrowRight className="ml-2 h-4 w-4 flex-shrink-0" />
              </Button>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-6 text-slate-600 dark:text-[#bbbbbb] animate-fade-in px-2">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm mobile-text">Análise em 2 minutos</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm mobile-text">100% Seguro</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

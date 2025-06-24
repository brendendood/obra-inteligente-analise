
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-blue-600 to-indigo-600 dark:bg-gradient-to-r dark:from-green-600 dark:to-green-500 mobile-safe">
      <div className="max-w-4xl mx-auto text-center text-white">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 animate-fade-in break-words px-2">
          Pronto para começar sua primeira obra com inteligência?
        </h2>
        <p className="text-lg sm:text-xl text-blue-100 dark:text-green-100 mb-6 sm:mb-8 max-w-2xl mx-auto animate-fade-in break-words px-2">
          Junte-se a centenas de profissionais que já aceleram suas obras com IA
        </p>
        <div className="animate-scale-in">
          <Link to="/cadastro">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 dark:text-green-600 hover:bg-blue-50 dark:hover:bg-gray-100 font-semibold transition-all duration-200 mobile-button"
            >
              Criar conta grátis
              <ArrowRight className="ml-2 h-5 w-5 flex-shrink-0" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

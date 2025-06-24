
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
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
  );
};

export default CTASection;

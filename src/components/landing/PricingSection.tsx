
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingSection = () => {
  return (
    <section id="precos" className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-[#0d0d0d] mobile-safe">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-[#f2f2f2] mb-3 sm:mb-4 animate-fade-in break-words">
          Comece gratuitamente
        </h2>
        <p className="text-lg sm:text-xl text-slate-600 dark:text-[#bbbbbb] mb-8 sm:mb-12 animate-fade-in break-words px-2">
          Teste todas as funcionalidades sem compromisso
        </p>

        <div className="animate-scale-in">
          <Card className="max-w-md mx-auto border-2 border-blue-200 dark:border-green-600 shadow-xl dark:bg-[#1a1a1a] overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:bg-gradient-to-r dark:from-green-900/30 dark:to-green-800/30 mobile-card">
              <CardTitle className="text-xl sm:text-2xl font-bold text-center text-foreground dark:text-[#f2f2f2] break-words">
                Plano Gratuito
              </CardTitle>
              <div className="text-center">
                <span className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-green-400">R$ 0</span>
                <span className="text-slate-600 dark:text-[#bbbbbb] mobile-text">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="mobile-card mobile-spacing">
              <ul className="space-y-3 mb-6">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-foreground dark:text-[#f2f2f2] mobile-text break-words">5 projetos por mês</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-foreground dark:text-[#f2f2f2] mobile-text break-words">Análise com IA</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-foreground dark:text-[#f2f2f2] mobile-text break-words">Orçamento básico</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-foreground dark:text-[#f2f2f2] mobile-text break-words">Suporte por email</span>
                </li>
              </ul>
              <Link to="/cadastro">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 dark:bg-gradient-to-r dark:from-green-600 dark:to-green-500 text-white hover:from-blue-700 hover:to-indigo-700 dark:hover:from-green-700 dark:hover:to-green-600 transition-all duration-200 mobile-button">
                  Começar Grátis
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;

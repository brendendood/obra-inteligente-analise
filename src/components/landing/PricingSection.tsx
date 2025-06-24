
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingSection = () => {
  return (
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
  );
};

export default PricingSection;

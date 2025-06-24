
import { CheckCircle, TrendingUp, Users, Clock, Shield } from 'lucide-react';

const BenefitsSection = () => {
  const benefits = [
    "Economia de 70% do tempo em orçamentos",
    "Análise técnica precisa em minutos",
    "Controle total do cronograma",
    "Documentação profissional automatizada"
  ];

  return (
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
  );
};

export default BenefitsSection;

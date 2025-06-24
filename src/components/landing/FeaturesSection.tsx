
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Upload, 
  Bot, 
  Calculator, 
  Calendar, 
  FileText, 
  Shield
} from 'lucide-react';

const FeaturesSection = () => {
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

  return (
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
  );
};

export default FeaturesSection;

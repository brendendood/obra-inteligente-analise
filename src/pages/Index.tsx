
import { useNavigate } from "react-router-dom";
import { FileText, Calculator, Calendar, Bot, Upload, FileCheck, Zap, Shield, Clock } from "lucide-react";
import PremiumHeader from "@/components/common/PremiumHeader";
import FeatureCard from "@/components/common/FeatureCard";
import ActionButton from "@/components/common/ActionButton";
import { Card } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Upload className="h-8 w-8 text-emerald-600" />,
      title: "Upload Inteligente",
      description: "IA lê plantas, memoriais e projetos PDF com precisão técnica",
      gradient: "from-emerald-100 to-emerald-200",
      onClick: () => navigate('/upload')
    },
    {
      icon: <Bot className="h-8 w-8 text-purple-600" />,
      title: "Assistente IA",
      description: "Respostas técnicas sobre quantitativos e especificações",
      gradient: "from-purple-100 to-purple-200",
      onClick: () => navigate('/assistant')
    },
    {
      icon: <Calculator className="h-8 w-8 text-orange-600" />,
      title: "Orçamento SINAPI",
      description: "Preços oficiais atualizados por região",
      gradient: "from-orange-100 to-orange-200",
      onClick: () => navigate('/budget')
    },
    {
      icon: <Calendar className="h-8 w-8 text-blue-600" />,
      title: "Cronograma Smart",
      description: "Planejamento automático com controle de progresso",
      gradient: "from-blue-100 to-blue-200",
      onClick: () => navigate('/schedule')
    },
    {
      icon: <FileCheck className="h-8 w-8 text-red-600" />,
      title: "Docs Automáticos",
      description: "Memorial, diários e documentação técnica",
      gradient: "from-red-100 to-red-200",
      onClick: () => navigate('/documents')
    },
    {
      icon: <FileText className="h-8 w-8 text-yellow-600" />,
      title: "Export Profissional",
      description: "PDF, planilhas e integração com ferramentas",
      gradient: "from-yellow-100 to-yellow-200"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <PremiumHeader
        title="ArqFlow.IA"
        subtitle="Inteligência Artificial para Engenharia"
        icon={<FileText className="h-7 w-7 text-white" />}
        showBackButton={false}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            <span>IA Especializada em Construção Civil</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight">
            Transforme projetos em
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block sm:inline sm:ml-3">
              orçamentos inteligentes
            </span>
          </h2>
          
          <p className="text-lg sm:text-xl text-slate-600 max-w-4xl mx-auto mb-8 sm:mb-10 leading-relaxed px-4">
            Envie seu projeto PDF e receba interpretação técnica, quantitativos precisos, 
            orçamentos SINAPI, cronogramas e assistente IA especializado.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
            <ActionButton 
              size="lg"
              onClick={() => navigate('/upload')}
              icon={<Upload className="h-5 w-5" />}
              className="w-full sm:w-auto"
            >
              Enviar Projeto
            </ActionButton>
            <div className="flex items-center space-x-2 text-slate-600">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Análise em 2 minutos</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 sm:mb-16">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              gradient={feature.gradient}
              onClick={feature.onClick}
            />
          ))}
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0 shadow-2xl overflow-hidden">
          <div className="p-8 sm:p-12 text-center text-white relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                Acelere seus projetos com IA
              </h3>
              <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Centenas de profissionais já economizam tempo e aumentam a precisão
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
                <ActionButton 
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate('/upload')}
                  className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50"
                >
                  Começar Grátis
                </ActionButton>
                <ActionButton 
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/assistant')}
                  className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-600"
                >
                  Ver Demo
                </ActionButton>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;

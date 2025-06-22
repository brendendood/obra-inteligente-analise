
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { FileText, Calculator, Calendar, Bot, Upload, FileCheck, Zap, Shield, Clock } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
                <FileText className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-indigo-800 bg-clip-text text-transparent">
                  ArqFlow.IA
                </h1>
                <p className="text-sm text-slate-600 font-medium">Inteligência Artificial para Engenharia</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-slate-600">
              <Shield className="h-4 w-4 text-blue-600" />
              <span>Dados seguros e privados</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Redesigned */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            <span>IA Especializada em Construção Civil</span>
          </div>
          
          <h2 className="text-5xl font-bold text-slate-900 mb-6 leading-tight">
            Transforme seus projetos em
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block">
              orçamentos inteligentes
            </span>
          </h2>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            Envie seu projeto em PDF e receba interpretação técnica completa, quantitativos precisos, 
            orçamentos baseados em SINAPI, cronogramas detalhados e assistente IA especializado.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
              onClick={() => navigate('/upload')}
            >
              <Upload className="mr-3 h-6 w-6" />
              Enviar Projeto Agora
            </Button>
            <div className="flex items-center space-x-2 text-slate-600">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Análise em menos de 2 minutos</span>
            </div>
          </div>
        </div>

        {/* Enhanced Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer group border-0 shadow-lg bg-white/80 backdrop-blur-sm" onClick={() => navigate('/upload')}>
            <CardHeader className="pb-4">
              <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 p-4 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">
                <Upload className="h-8 w-8 text-emerald-600" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-900">Upload Inteligente</CardTitle>
              <CardDescription className="text-slate-600 leading-relaxed">
                IA lê plantas, memoriais e projetos em PDF com precisão técnica avançada
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer group border-0 shadow-lg bg-white/80 backdrop-blur-sm" onClick={() => navigate('/assistant')}>
            <CardHeader className="pb-4">
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-4 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">
                <Bot className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-900">Assistente Técnico IA</CardTitle>
              <CardDescription className="text-slate-600 leading-relaxed">
                Respostas instantâneas sobre quantitativos, bitolas, volumes e especificações
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer group border-0 shadow-lg bg-white/80 backdrop-blur-sm" onClick={() => navigate('/budget')}>
            <CardHeader className="pb-4">
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-4 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">
                <Calculator className="h-8 w-8 text-orange-600" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-900">Orçamento SINAPI</CardTitle>
              <CardDescription className="text-slate-600 leading-relaxed">
                Preços oficiais atualizados por região com fornecedores locais
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer group border-0 shadow-lg bg-white/80 backdrop-blur-sm" onClick={() => navigate('/schedule')}>
            <CardHeader className="pb-4">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-900">Cronograma Inteligente</CardTitle>
              <CardDescription className="text-slate-600 leading-relaxed">
                Planejamento automático de etapas com controle de progresso
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer group border-0 shadow-lg bg-white/80 backdrop-blur-sm" onClick={() => navigate('/documents')}>
            <CardHeader className="pb-4">
              <div className="bg-gradient-to-br from-red-100 to-red-200 p-4 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">
                <FileCheck className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-900">Documentos Automáticos</CardTitle>
              <CardDescription className="text-slate-600 leading-relaxed">
                Memorial descritivo, diários de obra e documentação técnica
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-2xl transition-all duration-300 group border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-4 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">
                <FileText className="h-8 w-8 text-yellow-600" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-900">Exportação Profissional</CardTitle>
              <CardDescription className="text-slate-600 leading-relaxed">
                PDF, Google Sheets e integração com ferramentas de gestão
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Enhanced CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl shadow-2xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">
            Acelere seus projetos com IA
          </h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Junte-se a centenas de engenheiros e arquitetos que já economizam tempo e aumentam a precisão dos seus orçamentos
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
              onClick={() => navigate('/upload')}
            >
              Começar Agora - É Grátis
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300"
              onClick={() => navigate('/assistant')}
            >
              Ver Demonstração
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

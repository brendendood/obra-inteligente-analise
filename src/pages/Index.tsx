
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { FileText, Calculator, Calendar, Bot, Upload, DocumentCheck } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">ArqFlow.IA</h1>
            </div>
            <div className="text-sm text-gray-600">
              Plataforma Inteligente para Engenheiros e Arquitetos
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Transforme seus projetos em orçamentos e cronogramas
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Envie seu projeto em PDF e receba interpretação inteligente, quantitativos de materiais, 
            orçamentos baseados em SINAPI, cronogramas e assistente técnico com IA.
          </p>
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            onClick={() => navigate('/upload')}
          >
            <Upload className="mr-2 h-5 w-5" />
            Enviar Projeto
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/upload')}>
            <CardHeader>
              <div className="bg-green-100 p-3 rounded-full w-fit">
                <Upload className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Upload Inteligente</CardTitle>
              <CardDescription>
                Envie plantas, memoriais e projetos em PDF para análise automática
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/assistant')}>
            <CardHeader>
              <div className="bg-purple-100 p-3 rounded-full w-fit">
                <Bot className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Assistente Técnico IA</CardTitle>
              <CardDescription>
                Tire dúvidas sobre quantitativos, bitolas, volumes e especificações
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/budget')}>
            <CardHeader>
              <div className="bg-orange-100 p-3 rounded-full w-fit">
                <Calculator className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle>Orçamento SINAPI</CardTitle>
              <CardDescription>
                Gere orçamentos automatizados baseados em preços oficiais
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/schedule')}>
            <CardHeader>
              <div className="bg-blue-100 p-3 rounded-full w-fit">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Cronograma da Obra</CardTitle>
              <CardDescription>
                Planeje etapas, prazos e acompanhe o progresso da construção
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/documents')}>
            <CardHeader>
              <div className="bg-red-100 p-3 rounded-full w-fit">
                <DocumentCheck className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle>Documentos Técnicos</CardTitle>
              <CardDescription>
                Gere memoriais, diários de obra e documentação automatizada
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="bg-yellow-100 p-3 rounded-full w-fit">
                <FileText className="h-6 w-6 text-yellow-600" />
              </div>
              <CardTitle>Exportação PDF</CardTitle>
              <CardDescription>
                Exporte todos os documentos e relatórios em formato profissional
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Comece agora mesmo
          </h3>
          <p className="text-gray-600 mb-6">
            Faça upload do seu projeto e veja como a IA pode acelerar seu trabalho
          </p>
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => navigate('/upload')}
          >
            Enviar Primeiro Projeto
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;

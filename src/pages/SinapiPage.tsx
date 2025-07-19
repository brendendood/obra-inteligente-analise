
import { ArrowLeft, Calculator, Database, TrendingUp, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SinapiPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            SINAPI na MadenAI
          </h1>
          <p className="text-xl text-gray-600">
            Como utilizamos o Sistema Nacional de Pesquisa de Custos e Índices da Construção Civil
          </p>
        </div>

        {/* O que é SINAPI */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-6 w-6 mr-2 text-blue-600" />
              O que é o SINAPI?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              O SINAPI (Sistema Nacional de Pesquisa de Custos e Índices da Construção Civil) é uma base de dados oficial 
              mantida pela Caixa Econômica Federal e IBGE, que contém:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold">Composições de Custos</h4>
                  <p className="text-sm text-gray-600">Milhares de composições detalhadas para diferentes tipos de serviços</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold">Preços de Insumos</h4>
                  <p className="text-sm text-gray-600">Valores atualizados mensalmente de materiais, equipamentos e mão de obra</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold">Índices Regionais</h4>
                  <p className="text-sm text-gray-600">Variações de preços por região e estado brasileiro</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold">Padrão Nacional</h4>
                  <p className="text-sm text-gray-600">Referência oficial para licitações e obras públicas</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Como usamos */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="h-6 w-6 mr-2 text-blue-600" />
              Como a MadenAI utiliza o SINAPI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-6">
                <h4 className="font-semibold text-lg mb-2">1. Análise Automática de Projetos</h4>
                <p className="text-gray-600">
                  Nossa IA analisa plantas e documentos do seu projeto, identifica os serviços necessários 
                  e busca automaticamente as composições SINAPI correspondentes.
                </p>
              </div>
              
              <div className="border-l-4 border-green-500 pl-6">
                <h4 className="font-semibold text-lg mb-2">2. Orçamentos Precisos</h4>
                <p className="text-gray-600">
                  Geramos orçamentos detalhados utilizando preços oficiais do SINAPI, garantindo 
                  precisão e confiabilidade nas estimativas de custo.
                </p>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-6">
                <h4 className="font-semibold text-lg mb-2">3. Regionalização Automática</h4>
                <p className="text-gray-600">
                  Os preços são automaticamente ajustados conforme a localização do seu projeto, 
                  aplicando os índices regionais do SINAPI.
                </p>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-6">
                <h4 className="font-semibold text-lg mb-2">4. Atualizações Mensais</h4>
                <p className="text-gray-600">
                  Nossa base de dados é sincronizada mensalmente com as atualizações oficiais do SINAPI, 
                  mantendo seus orçamentos sempre atuais.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vantagens */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-6 w-6 mr-2 text-blue-600" />
              Vantagens para seu Projeto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Confiabilidade Oficial</h4>
                  <p className="text-blue-700 text-sm">
                    Base de dados mantida por órgãos governamentais
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Economia de Tempo</h4>
                  <p className="text-green-700 text-sm">
                    Orçamentos gerados automaticamente em minutos
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">Precisão Regional</h4>
                  <p className="text-purple-700 text-sm">
                    Preços ajustados para sua localização específica
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-900 mb-2">Sempre Atualizado</h4>
                  <p className="text-orange-700 text-sm">
                    Preços atualizados mensalmente pelo mercado
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Link to="/cadastro">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              Experimente Agora
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SinapiPage;

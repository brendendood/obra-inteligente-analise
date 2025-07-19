
import { ArrowLeft, Workflow, Zap, Link as LinkIcon, Bot, Settings, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const N8NPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
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
            N8N na MadenAI
          </h1>
          <p className="text-xl text-gray-600">
            Automações inteligentes que conectam sua obra ao mundo digital
          </p>
        </div>

        {/* O que é N8N */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Workflow className="h-6 w-6 mr-2 text-purple-600" />
              O que é o N8N?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              N8N é uma plataforma de automação de workflows que permite conectar diferentes 
              aplicações e serviços, criando fluxos de trabalho automatizados. Na MadenAI, 
              utilizamos para:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <Bot className="h-5 w-5 text-purple-500 mt-1" />
                <div>
                  <h4 className="font-semibold">Integração com IA</h4>
                  <p className="text-sm text-gray-600">Conecta nossa IA com sistemas externos</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <LinkIcon className="h-5 w-5 text-purple-500 mt-1" />
                <div>
                  <h4 className="font-semibold">APIs Integradas</h4>
                  <p className="text-sm text-gray-600">Conecta com ERPs, planilhas e outros softwares</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Settings className="h-5 w-5 text-purple-500 mt-1" />
                <div>
                  <h4 className="font-semibold">Automações Personalizadas</h4>
                  <p className="text-sm text-gray-600">Workflows únicos para cada necessidade</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Globe className="h-5 w-5 text-purple-500 mt-1" />
                <div>
                  <h4 className="font-semibold">Integrações Ilimitadas</h4>
                  <p className="text-sm text-gray-600">Conecta com centenas de serviços</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Automações Disponíveis */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-6 w-6 mr-2 text-purple-600" />
              Automações Disponíveis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="border-l-4 border-purple-500 pl-6">
                <h4 className="font-semibold text-lg mb-2">📊 Integração com ERPs</h4>
                <p className="text-gray-600">
                  Conecte automaticamente seus orçamentos gerados pela MadenAI com sistemas 
                  como SAP, TOTVS, Sienge e outros ERPs da construção civil.
                </p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-6">
                <h4 className="font-semibold text-lg mb-2">📧 Notificações Inteligentes</h4>
                <p className="text-gray-600">
                  Receba alertas por email, WhatsApp ou Slack quando novos orçamentos estiverem 
                  prontos, ou quando houver atualizações nos preços SINAPI.
                </p>
              </div>
              
              <div className="border-l-4 border-green-500 pl-6">
                <h4 className="font-semibold text-lg mb-2">📋 Exportação Automática</h4>
                <p className="text-gray-600">
                  Exporte automaticamente orçamentos para Google Sheets, Excel, ou diretamente 
                  para seu sistema de gestão de projetos favorito.
                </p>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-6">
                <h4 className="font-semibold text-lg mb-2">🔄 Sincronização de Dados</h4>
                <p className="text-gray-600">
                  Mantenha seus dados sempre sincronizados entre diferentes plataformas, 
                  eliminando trabalho manual e erros de digitação.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Casos de Uso */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-6 w-6 mr-2 text-purple-600" />
              Casos de Uso Práticos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">🏗️ Construtoras</h4>
                <p className="text-purple-700 text-sm">
                  Automatize o fluxo desde a análise de plantas até a aprovação de orçamentos, 
                  integrando com sistemas de gestão de obras.
                </p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">📐 Escritórios de Arquitetura</h4>
                <p className="text-blue-700 text-sm">
                  Conecte a MadenAI com ferramentas como AutoCAD, Revit ou SketchUp para 
                  workflow completamente automatizado.
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">🏢 Empresas de Consultoria</h4>
                <p className="text-green-700 text-sm">
                  Automatize relatórios de viabilidade econômica e envie para clientes 
                  automaticamente via email ou portal.
                </p>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-900 mb-2">🏛️ Órgãos Públicos</h4>
                <p className="text-orange-700 text-sm">
                  Integre com sistemas de licitação e portais de transparência para 
                  automatizar processos de orçamentação pública.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Planos com N8N */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Disponível no Plano Enterprise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-lg">
              <p className="text-gray-700 mb-4">
                <strong>As integrações N8N estão disponíveis no plano Enterprise e incluem:</strong>
              </p>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li>• Configuração personalizada de workflows</li>
                <li>• Suporte técnico especializado</li>
                <li>• Integrações ilimitadas</li>
                <li>• Monitoramento 24/7 dos workflows</li>
                <li>• Desenvolvimento de automações sob medida</li>
              </ul>
              <Link to="/cadastro">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Conhecer Plano Enterprise
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Quer saber mais sobre como as automações podem transformar seu workflow?
          </p>
          <Link to="/cadastro">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
              Fale com Nossa Equipe
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default N8NPage;

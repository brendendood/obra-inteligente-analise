
import { ArrowLeft, Shield, Zap, Globe, Lock, Server, Database } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SupabasePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
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
            Supabase na MadenAI
          </h1>
          <p className="text-xl text-gray-600">
            A infraestrutura segura e escalável que potencializa nossa plataforma
          </p>
        </div>

        {/* O que é Supabase */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-6 w-6 mr-2 text-green-600" />
              O que é o Supabase?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              O Supabase é uma plataforma de backend-as-a-service (BaaS) open-source que oferece 
              todas as funcionalidades necessárias para aplicações modernas, incluindo:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <Database className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold">Banco de Dados PostgreSQL</h4>
                  <p className="text-sm text-gray-600">Banco relacional robusto e escalável</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold">Autenticação Segura</h4>
                  <p className="text-sm text-gray-600">Sistema completo de auth e autorização</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Server className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold">APIs Automáticas</h4>
                  <p className="text-sm text-gray-600">REST e GraphQL geradas automaticamente</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Zap className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold">Real-time</h4>
                  <p className="text-sm text-gray-600">Atualizações em tempo real</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Como usamos */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-6 w-6 mr-2 text-green-600" />
              Como protegemos seus dados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="border-l-4 border-green-500 pl-6">
                <h4 className="font-semibold text-lg mb-2">🔐 Criptografia de Ponta a Ponta</h4>
                <p className="text-gray-600">
                  Todos os seus dados são criptografados tanto em trânsito quanto em repouso, 
                  garantindo máxima segurança para seus projetos.
                </p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-6">
                <h4 className="font-semibold text-lg mb-2">🏛️ Compliance e Certificações</h4>
                <p className="text-gray-600">
                  Supabase segue padrões internacionais como SOC 2 Type II, garantindo 
                  conformidade com regulamentações de proteção de dados.
                </p>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-6">
                <h4 className="font-semibold text-lg mb-2">🌍 Infraestrutura Global</h4>
                <p className="text-gray-600">
                  Servidores distribuídos globalmente garantem baixa latência e alta 
                  disponibilidade para usuários em qualquer lugar do mundo.
                </p>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-6">
                <h4 className="font-semibold text-lg mb-2">📊 Monitoramento 24/7</h4>
                <p className="text-gray-600">
                  Sistema de monitoramento contínuo detecta e resolve problemas 
                  automaticamente, garantindo 99.9% de uptime.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefícios para usuários */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-6 w-6 mr-2 text-green-600" />
              Benefícios para Você
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">⚡ Performance</h4>
                  <p className="text-green-700 text-sm">
                    Carregamento ultra-rápido dos seus projetos e dados
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">🔒 Segurança</h4>
                  <p className="text-blue-700 text-sm">
                    Seus projetos protegidos com tecnologia bancária
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">📱 Sincronização</h4>
                  <p className="text-purple-700 text-sm">
                    Acesse seus dados de qualquer dispositivo, sempre sincronizado
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-900 mb-2">🔄 Backup Automático</h4>
                  <p className="text-orange-700 text-sm">
                    Backups automáticos garantem que seus dados nunca sejam perdidos
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tecnologia */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Tecnologia de Ponta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-lg">
              <p className="text-gray-700 mb-4">
                <strong>Por que escolhemos Supabase:</strong>
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• <strong>Open Source:</strong> Código aberto, transparente e auditável</li>
                <li>• <strong>PostgreSQL:</strong> O banco de dados mais avançado do mundo</li>
                <li>• <strong>Escalabilidade:</strong> Cresce junto com suas necessidades</li>
                <li>• <strong>Developer-First:</strong> Focado na melhor experiência de desenvolvimento</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Link to="/cadastro">
            <Button size="lg" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
              Experimente Nossa Segurança
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SupabasePage;

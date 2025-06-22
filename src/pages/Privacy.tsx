
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-slate-900">
              Política de Privacidade
            </CardTitle>
            <p className="text-center text-slate-600 mt-2">
              Última atualização: Janeiro de 2025
            </p>
          </CardHeader>
          <CardContent className="prose prose-slate max-w-none">
            <div className="space-y-6 text-slate-700 leading-relaxed">
              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">1. Compromisso com sua Privacidade</h2>
                <p>
                  No ArqFlow.IA, respeitamos e protegemos a privacidade de nossos usuários. Esta política 
                  descreve como coletamos, usamos e protegemos suas informações pessoais.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">2. Informações que Coletamos</h2>
                <p>Coletamos as seguintes informações:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>Dados de conta:</strong> Nome, email e senha (criptografada)</li>
                  <li><strong>Projetos enviados:</strong> Arquivos PDF e dados extraídos para análise</li>
                  <li><strong>Dados de uso:</strong> Informações sobre como você usa a plataforma</li>
                  <li><strong>Dados técnicos:</strong> Endereço IP, navegador, sistema operacional</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">3. Como Usamos suas Informações</h2>
                <p>Utilizamos seus dados exclusivamente para:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Fornecer análise técnica de seus projetos</li>
                  <li>Gerar orçamentos, cronogramas e documentação</li>
                  <li>Melhorar nossos serviços e algoritmos de IA</li>
                  <li>Comunicar atualizações importantes do serviço</li>
                  <li>Garantir a segurança da plataforma</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">4. Proteção de Dados</h2>
                <p>
                  Implementamos medidas rigorosas de segurança para proteger suas informações:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Criptografia de dados em trânsito e em repouso</li>
                  <li>Servidores seguros com acesso restrito</li>
                  <li>Monitoramento contínuo de segurança</li>
                  <li>Backups regulares e seguros</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">5. Compartilhamento de Dados</h2>
                <p>
                  <strong>Nunca vendemos suas informações.</strong> Seus dados podem ser compartilhados apenas em 
                  situações específicas:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Com seu consentimento explícito</li>
                  <li>Para cumprir obrigações legais</li>
                  <li>Com prestadores de serviços essenciais (sempre sob acordo de confidencialidade)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">6. Seus Direitos</h2>
                <p>Você tem direito a:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Acessar seus dados pessoais</li>
                  <li>Corrigir informações incorretas</li>
                  <li>Solicitar exclusão de sua conta e dados</li>
                  <li>Exportar seus projetos e dados</li>
                  <li>Retirar consentimento para processamento de dados</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">7. Retenção de Dados</h2>
                <p>
                  Mantemos seus dados enquanto sua conta estiver ativa ou conforme necessário para 
                  fornecer nossos serviços. Você pode solicitar a exclusão de seus dados a qualquer momento.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">8. Atualizações desta Política</h2>
                <p>
                  Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças significativas 
                  por email ou através da plataforma.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">9. Contato</h2>
                <p>
                  Para dúvidas sobre privacidade ou para exercer seus direitos, entre em contato:
                </p>
                <ul className="list-none ml-4 space-y-1">
                  <li><strong>Email:</strong> 
                    <a href="mailto:suporte@arqflow.app" className="text-blue-600 hover:text-blue-700 ml-1">
                      suporte@arqflow.app
                    </a>
                  </li>
                  <li><strong>Assunto:</strong> "Privacidade e Proteção de Dados"</li>
                </ul>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default Privacy;

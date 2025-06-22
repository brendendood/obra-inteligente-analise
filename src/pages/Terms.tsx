
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Terms = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-slate-900">
              Termos de Uso
            </CardTitle>
            <p className="text-center text-slate-600 mt-2">
              Última atualização: Janeiro de 2025
            </p>
          </CardHeader>
          <CardContent className="prose prose-slate max-w-none">
            <div className="space-y-6 text-slate-700 leading-relaxed">
              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">1. Aceitação dos Termos</h2>
                <p>
                  Ao criar uma conta no ArqFlow.IA, você concorda em ficar vinculado a estes Termos de Uso. 
                  Se você não concordar com qualquer parte destes termos, não poderá usar nossos serviços.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">2. Descrição do Serviço</h2>
                <p>
                  O ArqFlow.IA é uma plataforma de inteligência artificial especializada em análise de projetos 
                  de engenharia e construção civil, oferecendo funcionalidades como:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Análise automática de documentos PDF de projetos</li>
                  <li>Geração de orçamentos com base SINAPI</li>
                  <li>Assistente de IA para questões técnicas</li>
                  <li>Criação de cronogramas de obra</li>
                  <li>Geração de documentação técnica</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">3. Uso Responsável</h2>
                <p>
                  Você se compromete a usar a plataforma de forma responsável e legal, não podendo:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Usar o serviço para fins ilegais ou não autorizados</li>
                  <li>Tentar hackear, comprometer ou prejudicar a plataforma</li>
                  <li>Compartilhar sua conta com terceiros</li>
                  <li>Fazer upload de conteúdo que viole direitos autorais</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">4. Propriedade dos Dados</h2>
                <p>
                  Você mantém todos os direitos sobre os projetos e documentos que enviar para a plataforma. 
                  O ArqFlow.IA não reivindica propriedade sobre seu conteúdo, utilizando-o apenas para 
                  fornecer os serviços solicitados.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">5. Limitação de Responsabilidade</h2>
                <p>
                  O ArqFlow.IA fornece a plataforma "como está". Embora nos esforcemos para manter alta 
                  precisão em nossas análises, recomendamos sempre a revisão profissional dos resultados 
                  gerados antes da implementação em projetos reais.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">6. Modificações dos Termos</h2>
                <p>
                  Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações 
                  entrarão em vigor imediatamente após a publicação. O uso continuado da plataforma 
                  constitui aceitação dos novos termos.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">7. Contato</h2>
                <p>
                  Para dúvidas sobre estes termos, entre em contato conosco em: 
                  <a href="mailto:suporte@arqflow.app" className="text-blue-600 hover:text-blue-700 ml-1">
                    suporte@arqflow.app
                  </a>
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default Terms;

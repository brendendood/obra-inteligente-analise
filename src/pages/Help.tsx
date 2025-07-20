import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HelpCircle, Search, Book, Video, MessageCircle, FileText } from 'lucide-react';

const Help = () => {
  const faqs = [
    {
      question: "Como criar meu primeiro projeto?",
      answer: "Vá até o Dashboard e clique em 'Novo Projeto' ou use a página de Upload para enviar plantas e documentos."
    },
    {
      question: "Como funciona o Assistente IA?",
      answer: "O Assistente IA analisa seus projetos e oferece insights, sugestões de orçamento e cronogramas inteligentes."
    },
    {
      question: "Posso exportar meus orçamentos?",
      answer: "Sim! Você pode exportar orçamentos em formato PDF e Excel através da página de Orçamento do projeto."
    },
    {
      question: "Como fazer upgrade para o plano Pro?",
      answer: "Acesse a página 'Plano e Pagamentos' e clique em 'Upgrade para Pro' para ver as opções disponíveis."
    }
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Ajuda e FAQs</h1>
          <p className="text-slate-600 mt-2">Encontre respostas para suas dúvidas sobre a MadenAI</p>
        </div>

        {/* Busca */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Buscar Ajuda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Digite sua dúvida aqui..." 
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Recursos Rápidos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Book className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Guia Inicial</h3>
              <p className="text-sm text-slate-600">Aprenda o básico</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Video className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Tutoriais</h3>
              <p className="text-sm text-slate-600">Vídeos explicativos</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Suporte</h3>
              <p className="text-sm text-slate-600">Fale conosco</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <FileText className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Documentação</h3>
              <p className="text-sm text-slate-600">Referência completa</p>
            </CardContent>
          </Card>
        </div>

        {/* FAQs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Perguntas Frequentes
            </CardTitle>
            <CardDescription>
              Respostas para as dúvidas mais comuns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="font-semibold text-slate-900">{faq.question}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{faq.answer}</p>
                  {index < faqs.length - 1 && <hr className="my-4" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contato */}
        <Card className="bg-blue-50">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold text-blue-900 mb-2">Não encontrou o que procura?</h3>
            <p className="text-blue-700 text-sm mb-4">Nossa equipe está pronta para ajudar você!</p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <MessageCircle className="h-4 w-4 mr-2" />
              Entrar em Contato
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Help;
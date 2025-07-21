
import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Search, 
  ChevronDown, 
  ChevronRight, 
  BookOpen, 
  Video, 
  MessageCircle, 
  FileText, 
  Lightbulb,
  Upload,
  BarChart3,
  Calendar,
  Bot,
  ExternalLink,
  HelpCircle
} from 'lucide-react';

const Help = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const resources = [
    {
      icon: <BookOpen className="h-8 w-8 text-blue-600" />,
      title: "Guia de Início Rápido",
      description: "Aprenda a usar o MadenAI em poucos minutos",
      type: "Guia",
      action: "Ler Guia",
      href: "#quick-start"
    },
    {
      icon: <Video className="h-8 w-8 text-purple-600" />,
      title: "Tutoriais em Vídeo",
      description: "Vídeos passo a passo para dominar todas as funcionalidades",
      type: "Vídeo",
      action: "Assistir",
      href: "#video-tutorials"
    },
    {
      icon: <Upload className="h-8 w-8 text-green-600" />,
      title: "Como Fazer Upload",
      description: "Guia completo para enviar seus projetos",
      type: "Tutorial",
      action: "Ver Tutorial",
      href: "#upload-guide"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-orange-600" />,
      title: "Relatórios e Orçamentos",
      description: "Entenda como gerar e interpretar relatórios",
      type: "Guia",
      action: "Explorar",
      href: "#reports-guide"
    },
    {
      icon: <Calendar className="h-8 w-8 text-red-600" />,
      title: "Cronogramas Inteligentes",
      description: "Aprenda a criar e gerenciar cronogramas",
      type: "Tutorial",
      action: "Aprender",
      href: "#schedule-guide"
    },
    {
      icon: <Bot className="h-8 w-8 text-indigo-600" />,
      title: "Assistente de IA",
      description: "Como usar o assistente para máxima produtividade",
      type: "Guia",
      action: "Descobrir",
      href: "#ai-assistant"
    }
  ];

  const faqs = [
    {
      question: "Como fazer upload de um projeto?",
      answer: "Para fazer upload de um projeto, vá para a seção 'Upload' no menu lateral, clique em 'Novo Projeto' ou arraste seu arquivo para a área de upload. Suportamos formatos PDF, DWG, JPG, PNG e outros documentos de projeto."
    },
    {
      question: "Quais tipos de arquivo são suportados?",
      answer: "Suportamos arquivos PDF, DWG, AutoCAD, imagens (JPG, PNG, GIF), planilhas (Excel, CSV) e documentos de texto (Word, TXT). Para melhores resultados, recomendamos arquivos PDF ou DWG."
    },
    {
      question: "Como funciona a análise de IA?",
      answer: "Nossa IA analisa automaticamente seus projetos, identifica componentes, calcula áreas, sugere materiais e gera orçamentos. O processo leva alguns minutos e você recebe notificações quando concluído."
    },
    {
      question: "Posso exportar os orçamentos?",
      answer: "Sim! Você pode exportar orçamentos em formato PDF, Excel ou CSV. Vá para a seção 'Orçamento' do seu projeto e clique em 'Exportar'."
    },
    {
      question: "Como alterar meu plano?",
      answer: "Acesse 'Plano e Pagamentos' no menu lateral, escolha o plano desejado e clique em 'Upgrade'. O processo é instantâneo e você terá acesso imediato aos novos recursos."
    },
    {
      question: "Meus dados estão seguros?",
      answer: "Sim! Utilizamos criptografia de ponta a ponta, servidores seguros e seguimos as melhores práticas de segurança. Seus projetos são privados e protegidos."
    },
    {
      question: "Como entrar em contato com o suporte?",
      answer: "Você pode entrar em contato através da seção 'Contato' no menu lateral, por email (suporte@maden.ai) ou pelo chat ao vivo disponível 24/7."
    },
    {
      question: "Posso colaborar com minha equipe?",
      answer: "Com o plano Enterprise, você pode convidar membros da equipe, definir permissões e colaborar em projetos. Cada membro tem acesso aos projetos compartilhados."
    }
  ];

  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <HelpCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Ajuda e Suporte</h1>
              <p className="text-slate-600">Encontre respostas, tutoriais e recursos para dominar o MadenAI</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Pesquisar ajuda, tutoriais ou perguntas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="flex items-center gap-2 h-auto p-4"
                onClick={() => window.open('mailto:suporte@maden.ai', '_blank')}
              >
                <MessageCircle className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Falar com Suporte</div>
                  <div className="text-sm text-gray-500">Email direto</div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex items-center gap-2 h-auto p-4"
                onClick={() => setSearchTerm('upload')}
              >
                <Upload className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Como fazer Upload</div>
                  <div className="text-sm text-gray-500">Guia rápido</div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex items-center gap-2 h-auto p-4"
                onClick={() => setSearchTerm('orçamento')}
              >
                <BarChart3 className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Gerar Orçamento</div>
                  <div className="text-sm text-gray-500">Passo a passo</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Recursos de Aprendizado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map((resource, index) => (
                <div 
                  key={index}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => {
                    // Simular navegação para recurso
                    alert(`Redirecionando para: ${resource.title}`);
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {resource.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-slate-900">{resource.title}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {resource.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{resource.description}</p>
                      <div className="flex items-center gap-1 text-blue-600 text-sm font-medium">
                        {resource.action}
                        <ExternalLink className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Perguntas Frequentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredFAQs.map((faq, index) => (
                <Collapsible 
                  key={index}
                  open={openFAQ === index}
                  onOpenChange={() => setOpenFAQ(openFAQ === index ? null : index)}
                >
                  <CollapsibleTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-between h-auto p-4 text-left hover:bg-gray-50"
                    >
                      <span className="font-medium">{faq.question}</span>
                      {openFAQ === index ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-4 pb-4 text-slate-600">
                      {faq.answer}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-blue-900 mb-2">Não encontrou o que procurava?</h3>
              <p className="text-blue-700 mb-4">
                Nossa equipe de suporte está disponível 24/7 para ajudá-lo
              </p>
              <div className="flex gap-3 justify-center">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => window.open('mailto:suporte@maden.ai', '_blank')}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar Email
                </Button>
                <Button 
                  variant="outline"
                  className="border-blue-300 text-blue-700 hover:bg-blue-100"
                  onClick={() => {
                    // Simular abertura do chat
                    alert('Chat ao vivo será aberto em breve!');
                  }}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat ao Vivo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Help;

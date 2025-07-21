
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
  HelpCircle,
  Mail
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
    // Seção: Uploads e Formatos
    {
      question: "Quais tipos de arquivo de projeto posso enviar para análise?",
      answer: "O MadenAI aceita plantas em PDF, arquivos DWG/AutoCAD, imagens de projetos (JPG, PNG), planilhas de orçamento (Excel, CSV) e documentos técnicos (Word, PDF). Para melhores resultados na análise de IA, recomendamos plantas em PDF de alta qualidade ou arquivos DWG nativos."
    },
    {
      question: "Como faço upload dos meus projetos de construção?",
      answer: "Acesse 'Upload' no menu lateral, clique em 'Novo Projeto', dê um nome ao projeto e arraste seus arquivos (plantas, memoriais, planilhas) para a área de upload. O sistema organizará automaticamente os documentos por tipo e iniciará a análise com IA."
    },
    {
      question: "Há limite de tamanho para os arquivos de projeto?",
      answer: "Arquivos individuais podem ter até 50MB. Para projetos grandes com múltiplas pranchas, recomendamos compactar em ZIP ou enviar por partes. Planos pagos têm limites maiores e processamento prioritário."
    },
    
    // Seção: Análise com IA
    {
      question: "Como a IA analisa plantas arquitetônicas e projetos de engenharia?",
      answer: "Nossa IA identifica automaticamente ambientes, calcula áreas úteis e construídas, reconhece elementos estruturais, detecta instalações (elétrica, hidráulica) e gera quantitativos de materiais. O processo leva 3-10 minutos dependendo da complexidade do projeto."
    },
    {
      question: "A IA consegue analisar projetos em AutoCAD (.dwg)?",
      answer: "Sim! A IA processa arquivos DWG nativos, extraindo informações de layers, blocos, cotas e textos. Isso garante maior precisão nos cálculos de área, quantitativos e identificação de elementos construtivos comparado a PDFs."
    },
    {
      question: "Posso confiar nos orçamentos gerados pela IA?",
      answer: "Os orçamentos são estimativas baseadas em dados do mercado e análise técnica do projeto. Recomendamos sempre revisar e ajustar os valores conforme sua região e fornecedores. A IA serve como ponto de partida profissional para seus orçamentos."
    },
    
    // Seção: Planos e Limites
    {
      question: "Qual a diferença entre os planos Free, Basic, Pro e Enterprise?",
      answer: "Free: 1 projeto para teste. Basic: 10 projetos + orçamentos básicos (R$ 49/mês). Pro: 50 projetos + cronogramas + exportações avançadas (R$ 149/mês). Enterprise: projetos ilimitados + colaboração em equipe + suporte prioritário (R$ 299/mês)."
    },
    {
      question: "O que acontece quando atinjo o limite de projetos do meu plano?",
      answer: "Você pode visualizar projetos existentes, mas não conseguirá criar novos até fazer upgrade ou excluir projetos antigos. Recomendamos o upgrade para Basic ou Pro para profissionais ativos na construção civil."
    },
    {
      question: "Posso fazer downgrade do meu plano?",
      answer: "Sim, mas projetos excedentes ficarão em 'modo somente leitura'. Por exemplo, se você tem 15 projetos no Pro e muda para Basic (10 projetos), os 5 mais antigos ficam bloqueados até o upgrade ou exclusão."
    },
    
    // Seção: Funcionalidades Específicas
    {
      question: "Como exportar orçamentos para apresentar ao cliente?",
      answer: "Na aba 'Orçamento' do projeto, clique em 'Exportar' e escolha PDF (apresentação), Excel (edição) ou CSV (integração). O PDF inclui logo, resumo executivo e detalhamento por ambiente - ideal para apresentações profissionais."
    },
    {
      question: "O cronograma gerado considera as fases reais da obra?",
      answer: "Sim! O cronograma segue a sequência lógica: fundação → estrutura → alvenaria → instalações → acabamentos → limpeza. Você pode ajustar prazos e dependências conforme sua metodologia construtiva."
    },
    {
      question: "Posso usar o MadenAI para reformas e ampliações?",
      answer: "Perfeitamente! A IA analisa plantas de reforma, identifica elementos existentes vs. novos, calcula materiais para demolição/construção e gera orçamentos específicos para reformas. Muito útil para arquitetos e engenheiros especializados em retrofit."
    },
    
    // Seção: Colaboração e Equipe
    {
      question: "Como compartilhar projetos com minha equipe técnica?",
      answer: "No plano Enterprise, acesse 'Configurações do Projeto' → 'Compartilhar' → adicione emails dos membros da equipe (engenheiros, arquitetos, orçamentistas). Cada membro pode visualizar, editar ou apenas comentar, conforme as permissões definidas."
    },
    {
      question: "Posso integrar o MadenAI com outros softwares da construção?",
      answer: "Atualmente exportamos dados em formatos padrão (Excel, CSV, PDF) compatíveis com softwares como Sienge, TQS, AltoQi e planilhas personalizadas. Integrações diretas estão em desenvolvimento."
    },
    
    // Seção: Suporte e Conta
    {
      question: "Como alterar dados da minha conta ou empresa?",
      answer: "Acesse 'Conta & Preferências' no menu lateral. Lá você pode atualizar informações pessoais, dados da empresa, CNPJ (para notas fiscais), endereço e preferências de notificação."
    },
    {
      question: "Esqueci minha senha. Como redefinir?",
      answer: "Na tela de login, clique em 'Esqueci minha senha', digite seu email cadastrado e siga as instruções enviadas. O link de recuperação expira em 24 horas por segurança."
    },
    {
      question: "Como entrar em contato com o suporte técnico?",
      answer: "Email: suporte@maden.ai (resposta em até 4h). Chat ao vivo: disponível no canto inferior direito (horário comercial). WhatsApp: para clientes Enterprise. Também temos tutoriais em vídeo na seção 'Ajuda'."
    },
    
    // Seção: Segurança e Dados
    {
      question: "Meus projetos e dados técnicos estão seguros?",
      answer: "Sim! Usamos criptografia SSL/TLS, servidores na AWS com backup automático, acesso restrito por login e senhas seguras. Seus projetos são privados - apenas você e membros autorizados têm acesso. Não compartilhamos dados com terceiros."
    },
    {
      question: "Posso excluir permanentemente um projeto?",
      answer: "Sim. Em 'Projetos' → clique no projeto → 'Configurações' → 'Excluir Projeto'. ATENÇÃO: Esta ação é irreversível. Recomendamos fazer backup/download dos arquivos importantes antes da exclusão."
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

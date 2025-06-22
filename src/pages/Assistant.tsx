
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FileText, Bot, Send, User, Lightbulb, MessageSquare, Zap } from 'lucide-react';
import PremiumHeader from '@/components/common/PremiumHeader';
import ActionButton from '@/components/common/ActionButton';

const Assistant = () => {
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState<Array<{
    type: 'user' | 'assistant';
    message: string;
    timestamp: Date;
  }>>([
    {
      type: 'assistant',
      message: '👋 Olá! Sou seu assistente IA especializado em engenharia civil. Posso responder sobre quantitativos, especificações, bitolas, volumes e mais. Como posso ajudar?',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const exampleQuestions = [
    "Quantos m² de alvenaria no projeto?",
    "Bitola recomendada para baldrame?", 
    "Volume de concreto das fundações?",
    "m² de revestimento no banheiro?",
    "Localização dos pontos hidráulicos?",
    "Área total construída?"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    const userMessage = {
      type: 'user' as const,
      message: question,
      timestamp: new Date()
    };

    setConversation(prev => [...prev, userMessage]);
    setQuestion('');
    setIsLoading(true);

    setTimeout(() => {
      const responses = [
        "📐 Identifiquei **45m²** de alvenaria em blocos cerâmicos 14x19x39cm. Inclui paredes internas e divisórias da planta.\n\n💡 **Dica:** Adicione 5% para perdas.",
        "🔩 Recomendo ferro **CA-50 φ12,5mm** para longitudinais e **φ6,3mm** para estribos (espaçamento 15cm). Atende cargas e NBR 6118.\n\n⚠️ **Importante:** Verificar solo local.",
        "🏗️ Volume total: **8,5m³** de concreto. Sapatas isoladas + vigas baldrames. Recomendo fck=20MPa sapatas, fck=25MPa baldrames.\n\n📋 **Cronograma:** Concretar em etapas.",
        "🏠 **12m²** de revestimento cerâmico no banheiro suíte. Inclui paredes do box (2,10m altura) e bancada. Piso: 6m² adicionais.\n\n🎨 **Sugestão:** Cerâmica antiderrapante no piso.",
        "💧 Pontos hidráulicos:\n• **Cozinha:** 2 pontos água fria\n• **Suíte:** 3 pontos (chuveiro, lavatório, vaso)\n• **Social:** 2 pontos\n• **Serviço:** 1 ponto\n\n🔧 **Recomendação:** Registros individuais.",
        "📏 Área total: **142,5m²**\n• **Social:** 45m²\n• **Íntima:** 38m²\n• **Cozinha/serviço:** 25m²\n• **Banheiros:** 12m²\n• **Circulação:** 22,5m²\n\n📊 **CUB:** ~R$ 1.650/m²"
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const assistantMessage = {
        type: 'assistant' as const,
        message: randomResponse,
        timestamp: new Date()
      };

      setConversation(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 2500);
  };

  const handleSendClick = () => {
    // Create a synthetic form event
    const syntheticEvent = {
      preventDefault: () => {},
      target: {},
      currentTarget: {}
    } as React.FormEvent;
    
    handleSubmit(syntheticEvent);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <PremiumHeader
        title="Assistente Técnico IA"
        subtitle="Especialista em Engenharia Civil"
        icon={<Bot className="h-6 w-6 text-white" />}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Instruction Banner */}
        <div className="mb-6 sm:mb-8 bg-gradient-to-r from-purple-100 to-indigo-100 border border-purple-200 rounded-2xl p-4 sm:p-6">
          <div className="flex items-start space-x-3">
            <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 mt-0.5" />
            <div>
              <h3 className="font-bold text-purple-900 text-sm sm:text-base">Pergunte sobre o projeto enviado</h3>
              <p className="text-purple-700 text-xs sm:text-sm mt-1">Áreas, volumes, materiais, estrutura, instalações e especificações técnicas</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
          {/* Chat Area */}
          <div className="xl:col-span-2">
            <Card className="h-[500px] sm:h-[650px] flex flex-col shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="border-b border-slate-100 pb-4">
                <CardTitle className="flex items-center text-lg sm:text-xl">
                  <Bot className="h-5 w-5 sm:h-6 sm:w-6 mr-3 text-purple-600" />
                  Conversa com Assistente
                </CardTitle>
                <CardDescription className="text-slate-600 text-sm">
                  Faça perguntas técnicas específicas
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 p-4 sm:p-6">
                  {conversation.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 sm:px-6 py-3 sm:py-4 shadow-lg ${
                          msg.type === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                            : 'bg-white border border-slate-200 text-slate-900'
                        }`}
                      >
                        <div className="flex items-start space-x-2 sm:space-x-3">
                          {msg.type === 'assistant' && (
                            <div className="bg-purple-100 p-1.5 sm:p-2 rounded-full flex-shrink-0">
                              <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
                            </div>
                          )}
                          {msg.type === 'user' && (
                            <div className="bg-blue-100 p-1.5 sm:p-2 rounded-full flex-shrink-0">
                              <User className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="prose prose-sm max-w-none">
                              {msg.message.split('\n').map((line, i) => (
                                <p key={i} className={`mb-1 sm:mb-2 last:mb-0 text-xs sm:text-sm break-words ${
                                  msg.type === 'user' ? 'text-white' : 'text-slate-700'
                                }`}>
                                  {line}
                                </p>
                              ))}
                            </div>
                            <p className={`text-xs mt-1 sm:mt-2 ${
                              msg.type === 'user' ? 'text-blue-200' : 'text-slate-500'
                            }`}>
                              {msg.timestamp.toLocaleTimeString('pt-BR', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-slate-200 rounded-2xl px-4 sm:px-6 py-3 sm:py-4 max-w-[80%] shadow-lg">
                        <div className="flex items-center space-x-3">
                          <div className="bg-purple-100 p-2 rounded-full">
                            <Bot className="h-4 w-4 text-purple-600" />
                          </div>
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="border-t border-slate-100 p-4 sm:p-6">
                  <form onSubmit={handleSubmit} className="flex space-x-3 sm:space-x-4">
                    <Input
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Digite sua pergunta..."
                      disabled={isLoading}
                      className="flex-1 h-10 sm:h-12 px-3 sm:px-4 rounded-xl border-slate-300 focus:border-purple-500 focus:ring-purple-500 text-sm sm:text-base"
                    />
                    <ActionButton 
                      size="md"
                      onClick={handleSendClick}
                      disabled={isLoading || !question.trim()}
                      className="h-10 sm:h-12 px-4 sm:px-6"
                      icon={<Send className="h-3 w-3 sm:h-4 sm:w-4" />}
                    >
                      <span className="sr-only">Enviar</span>
                    </ActionButton>
                  </form>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg flex items-center">
                  <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-yellow-600" />
                  Perguntas Exemplo
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Clique para usar como modelo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 sm:space-y-3">
                  {exampleQuestions.map((example, index) => (
                    <ActionButton
                      key={index}
                      variant="outline"
                      onClick={() => setQuestion(example)}
                      className="w-full text-left h-auto py-3 px-3 sm:px-4 text-xs sm:text-sm border-slate-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 rounded-xl justify-start"
                    >
                      <span className="text-left break-words">{example}</span>
                    </ActionButton>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg flex items-center">
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-600" />
                  Dicas de Uso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-slate-600">
                  <div className="flex items-start space-x-3">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:w-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Seja específico sobre o que deseja saber</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:w-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Mencione unidades (m², m³, unidades)</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:w-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Pergunte sobre localizações específicas</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:w-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Solicite especificações técnicas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assistant;

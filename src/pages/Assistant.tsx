
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FileText, ArrowLeft, Bot, Send, User, Lightbulb, MessageSquare, Zap } from 'lucide-react';

const Assistant = () => {
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState<Array<{
    type: 'user' | 'assistant';
    message: string;
    timestamp: Date;
  }>>([
    {
      type: 'assistant',
      message: '👋 Olá! Sou seu assistente técnico especializado em engenharia civil. Posso responder dúvidas sobre quantitativos, especificações técnicas, bitolas, volumes e muito mais baseado no seu projeto. Como posso ajudar?',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Exemplos de perguntas reorganizados
  const exampleQuestions = [
    "Quantos m² de alvenaria tem no projeto?",
    "Qual a bitola de ferro recomendada para o baldrame?", 
    "Qual o volume de concreto necessário para as fundações?",
    "Quantos m² de revestimento cerâmico tem no banheiro?",
    "Onde estão localizados os pontos hidráulicos?",
    "Qual a área total construída do projeto?"
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

    // Simular resposta da IA mais elaborada
    setTimeout(() => {
      const responses = [
        "📐 Com base na análise do seu projeto, identifiquei aproximadamente **45m²** de alvenaria de vedação em blocos cerâmicos de 14x19x39cm. Essa quantidade inclui as paredes internas e divisórias especificadas na planta baixa.\n\n💡 **Dica:** Considere adicionar 5% de margem para perdas e quebras.",
        "🔩 Para o baldrame, recomendo o uso de ferro **CA-50 φ12,5mm** para as barras longitudinais e **φ6,3mm** para os estribos, com espaçamento de 15cm. Essa especificação atende às cargas previstas e às normas da ABNT NBR 6118.\n\n⚠️ **Importante:** Sempre verificar as condições do solo local.",
        "🏗️ O volume total de concreto necessário para as fundações é de aproximadamente **8,5m³**, considerando as sapatas isoladas e vigas baldrames. Recomendo concreto fck=20MPa para as sapatas e fck=25MPa para os baldrames.\n\n📋 **Cronograma:** Programar concretagem em etapas para melhor controle.",
        "🏠 Identifiquei **12m²** de revestimento cerâmico no banheiro da suíte, incluindo as paredes do box (2,10m de altura) e a área de bancada. O piso do banheiro tem 6m² adicionais.\n\n🎨 **Sugestão:** Considere cerâmica antiderrapante para o piso.",
        "💧 Os pontos hidráulicos estão distribuídos da seguinte forma:\n• **Cozinha:** 2 pontos de água fria\n• **Banheiro suíte:** 3 pontos (chuveiro, lavatório, vaso)\n• **Banheiro social:** 2 pontos\n• **Área de serviço:** 1 ponto\n\n🔧 **Recomendação:** Instalar registros individuais.",
        "📏 A área total construída do projeto é de **142,5m²**, distribuída em:\n• **Área social:** 45m²\n• **Área íntima:** 38m²\n• **Cozinha e área de serviço:** 25m²\n• **Banheiros:** 12m²\n• **Circulação:** 22,5m²\n\n📊 **CUB atual:** Aproximadamente R$ 1.650/m²"
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

  const handleExampleClick = (exampleQuestion: string) => {
    setQuestion(exampleQuestion);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="hover:bg-blue-50 transition-colors duration-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-xl shadow-lg">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-900 to-indigo-800 bg-clip-text text-transparent">
                  Assistente Técnico IA
                </h1>
                <p className="text-sm text-slate-600 font-medium">Especialista em Engenharia Civil</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Instruction Banner */}
        <div className="mb-8 bg-gradient-to-r from-purple-100 to-indigo-100 border border-purple-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <MessageSquare className="h-6 w-6 text-purple-600" />
            <div>
              <h3 className="font-bold text-purple-900">Pergunte qualquer coisa sobre o projeto enviado</h3>
              <p className="text-purple-700">Como áreas, volumes, materiais, estrutura, instalações e especificações técnicas</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Chat Area */}
          <div className="lg:col-span-2">
            <Card className="h-[650px] flex flex-col shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="flex items-center text-xl">
                  <Bot className="h-6 w-6 mr-3 text-purple-600" />
                  Conversa com o Assistente
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Faça perguntas técnicas específicas sobre seu projeto
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 p-6">
                  {conversation.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-6 py-4 shadow-lg ${
                          msg.type === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                            : 'bg-white border border-slate-200 text-slate-900'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          {msg.type === 'assistant' && (
                            <div className="bg-purple-100 p-2 rounded-full">
                              <Bot className="h-4 w-4 text-purple-600" />
                            </div>
                          )}
                          {msg.type === 'user' && (
                            <div className="bg-blue-100 p-2 rounded-full">
                              <User className="h-4 w-4 text-blue-600" />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="prose prose-sm max-w-none">
                              {msg.message.split('\n').map((line, i) => (
                                <p key={i} className={`mb-2 last:mb-0 ${msg.type === 'user' ? 'text-white' : 'text-slate-700'}`}>
                                  {line}
                                </p>
                              ))}
                            </div>
                            <p className={`text-xs mt-2 ${
                              msg.type === 'user' ? 'text-blue-200' : 'text-slate-500'
                            }`}>
                              {msg.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-slate-200 rounded-2xl px-6 py-4 max-w-[80%] shadow-lg">
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

                {/* Enhanced Input */}
                <div className="border-t border-slate-100 p-6">
                  <form onSubmit={handleSubmit} className="flex space-x-4">
                    <Input
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Digite sua pergunta técnica..."
                      disabled={isLoading}
                      className="flex-1 h-12 px-4 rounded-xl border-slate-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                    <Button 
                      type="submit" 
                      disabled={isLoading || !question.trim()}
                      className="h-12 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl shadow-lg"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2 text-yellow-600" />
                  Perguntas Exemplo
                </CardTitle>
                <CardDescription>
                  Clique em uma pergunta para usar como modelo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {exampleQuestions.map((example, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full text-left h-auto py-4 px-4 text-sm border-slate-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 rounded-xl"
                      onClick={() => handleExampleClick(example)}
                    >
                      {example}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-blue-600" />
                  Dicas de Uso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm text-slate-600">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <p>Seja específico sobre o que deseja saber</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <p>Mencione unidades (m², m³, unidades)</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <p>Pergunte sobre localizações específicas</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <p>Solicite especificações técnicas detalhadas</p>
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

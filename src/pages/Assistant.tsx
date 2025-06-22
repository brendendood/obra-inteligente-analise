
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileText, ArrowLeft, Bot, Send, User } from 'lucide-react';

const Assistant = () => {
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState<Array<{
    type: 'user' | 'assistant';
    message: string;
    timestamp: Date;
  }>>([
    {
      type: 'assistant',
      message: 'Olá! Sou seu assistente técnico especializado em engenharia. Posso responder dúvidas sobre quantitativos, especificações técnicas, bitolas, volumes e muito mais baseado no seu projeto. Como posso ajudar?',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Exemplos de perguntas para orientar o usuário
  const exampleQuestions = [
    "Quantos m² de alvenaria tem no projeto?",
    "Qual a bitola de ferro recomendada para o baldrame?",
    "Qual o volume de concreto necessário para as fundações?",
    "Quantos m² de revestimento cerâmico tem no banheiro da suíte?",
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

    // Simular resposta da IA (aqui você conectaria com OpenAI ou outra IA)
    setTimeout(() => {
      const responses = [
        "Com base na análise do seu projeto, identifiquei aproximadamente 45m² de alvenaria de vedação em blocos cerâmicos de 14x19x39cm. Essa quantidade inclui as paredes internas e divisórias especificadas na planta baixa.",
        "Para o baldrame, recomendo o uso de ferro CA-50 com bitola φ12,5mm para as barras longitudinais e φ6,3mm para os estribos, com espaçamento de 15cm. Essa especificação atende às cargas previstas e às normas da ABNT NBR 6118.",
        "O volume total de concreto necessário para as fundações é de aproximadamente 8,5m³, considerando as sapatas isoladas e vigas baldrames. Recomendo concreto fck=20MPa para as sapatas e fck=25MPa para os baldrames.",
        "Identifiquei 12m² de revestimento cerâmico no banheiro da suíte, incluindo as paredes do box (2,10m de altura) e a área de bancada. O piso do banheiro tem 6m² adicionais.",
        "Os pontos hidráulicos estão distribuídos da seguinte forma: 2 pontos de água fria na cozinha, 3 pontos no banheiro da suíte (chuveiro, lavatório e vaso), 2 pontos no banheiro social, e 1 ponto na área de serviço.",
        "A área total construída do projeto é de 142,5m², distribuída em: área social (45m²), área íntima (38m²), cozinha e área de serviço (25m²), banheiros (12m²), e circulação (22,5m²)."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const assistantMessage = {
        type: 'assistant' as const,
        message: randomResponse,
        timestamp: new Date()
      };

      setConversation(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 2000);
  };

  const handleExampleClick = (exampleQuestion: string) => {
    setQuestion(exampleQuestion);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={() => navigate('/')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div className="bg-purple-600 p-2 rounded-lg">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Assistente Técnico IA</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat Area */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bot className="h-5 w-5 mr-2 text-purple-600" />
                  Conversa com o Assistente
                </CardTitle>
                <CardDescription>
                  Faça perguntas técnicas sobre seu projeto
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {conversation.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          msg.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {msg.type === 'assistant' && (
                            <Bot className="h-4 w-4 mt-1 text-purple-600" />
                          )}
                          {msg.type === 'user' && (
                            <User className="h-4 w-4 mt-1 text-white" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm">{msg.message}</p>
                            <p className={`text-xs mt-1 ${
                              msg.type === 'user' ? 'text-blue-200' : 'text-gray-500'
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
                      <div className="bg-gray-100 rounded-lg p-4 max-w-[80%]">
                        <div className="flex items-center space-x-2">
                          <Bot className="h-4 w-4 text-purple-600" />
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <form onSubmit={handleSubmit} className="flex space-x-2">
                  <Input
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Digite sua pergunta técnica..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isLoading || !question.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Examples Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Perguntas Exemplo</CardTitle>
                <CardDescription>
                  Clique em uma pergunta para usar como exemplo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {exampleQuestions.map((example, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full text-left h-auto py-3 px-4 text-sm"
                      onClick={() => handleExampleClick(example)}
                    >
                      {example}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dicas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <p>Seja específico sobre o que deseja saber</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <p>Mencione unidades (m², m³, unidades)</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <p>Pergunte sobre localizações específicas</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
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

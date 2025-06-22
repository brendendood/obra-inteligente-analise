
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FileText, Bot, Send, User, Lightbulb, MessageSquare, Zap, Upload } from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';
import { supabase } from '@/integrations/supabase/client';
import PremiumHeader from '@/components/common/PremiumHeader';
import ActionButton from '@/components/common/ActionButton';

interface Conversation {
  type: 'user' | 'assistant';
  message: string;
  timestamp: Date;
}

const Assistant = () => {
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { currentProject } = useProject();

  useEffect(() => {
    if (currentProject) {
      // Load existing conversation for this project
      loadConversation();
      
      setConversation(prev => {
        if (prev.length === 0) {
          return [{
            type: 'assistant',
            message: `👋 Olá! Analisei seu projeto **${currentProject.name}** (${currentProject.total_area}m²).\n\nPosso responder sobre quantitativos, especificações, materiais e qualquer aspecto técnico específico deste projeto. Como posso ajudar?`,
            timestamp: new Date()
          }];
        }
        return prev;
      });
    } else {
      setConversation([{
        type: 'assistant',
        message: '👋 Olá! Para usar o assistente especializado, primeiro envie um projeto na página de Upload. Lá a IA analisará seu PDF e poderá responder perguntas específicas sobre ele.',
        timestamp: new Date()
      }]);
    }
  }, [currentProject]);

  const loadConversation = async () => {
    if (!currentProject) return;

    try {
      const { data } = await supabase
        .from('project_conversations')
        .select('*')
        .eq('project_id', currentProject.id)
        .order('timestamp', { ascending: true });

      if (data && data.length > 0) {
        const loadedConversation = data.map(item => ({
          type: item.sender as 'user' | 'assistant',
          message: item.message,
          timestamp: new Date(item.timestamp)
        }));
        setConversation(loadedConversation);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const exampleQuestions = currentProject ? [
    "Quantos m² de alvenaria no projeto?",
    "Volume de concreto das fundações?", 
    "Área total dos dormitórios?",
    "Especificações do sistema estrutural?",
    "Materiais previstos para revestimento?",
    "Dimensões da área social?"
  ] : [
    "Primeiro envie um projeto no Upload",
    "IA precisa analisar seu PDF",
    "Depois pergunte sobre o projeto específico"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading || !currentProject) return;

    const userMessage: Conversation = {
      type: 'user',
      message: question,
      timestamp: new Date()
    };

    setConversation(prev => [...prev, userMessage]);
    setQuestion('');
    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`${supabase.supabaseUrl}/functions/v1/chat-assistant`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: userMessage.message,
          projectId: currentProject.id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const result = await response.json();
      
      const assistantMessage: Conversation = {
        type: 'assistant',
        message: result.response,
        timestamp: new Date()
      };

      setConversation(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Conversation = {
        type: 'assistant',
        message: '❌ Erro ao processar pergunta. Tente novamente.',
        timestamp: new Date()
      };
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendClick = () => {
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
        subtitle={currentProject ? `Analisando: ${currentProject.name}` : "Envie um projeto primeiro"}
        icon={<Bot className="h-6 w-6 text-white" />}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Status Banner */}
        <div className={`mb-6 sm:mb-8 ${currentProject ? 'bg-gradient-to-r from-purple-100 to-indigo-100 border-purple-200' : 'bg-gradient-to-r from-orange-100 to-red-100 border-orange-200'} border rounded-2xl p-4 sm:p-6`}>
          <div className="flex items-start space-x-3">
            {currentProject ? (
              <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 mt-0.5" />
            ) : (
              <Upload className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 mt-0.5" />
            )}
            <div>
              {currentProject ? (
                <>
                  <h3 className="font-bold text-purple-900 text-sm sm:text-base">IA Contextualizada</h3>
                  <p className="text-purple-700 text-xs sm:text-sm mt-1">
                    Assistente especializado analisando seu projeto: <strong>{currentProject.name}</strong>
                  </p>
                </>
              ) : (
                <>
                  <h3 className="font-bold text-orange-900 text-sm sm:text-base">Projeto Necessário</h3>
                  <p className="text-orange-700 text-xs sm:text-sm mt-1">
                    <button 
                      onClick={() => navigate('/upload')}
                      className="underline hover:text-orange-800"
                    >
                      Envie um projeto PDF
                    </button> para ativar o assistente especializado
                  </p>
                </>
              )}
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
                  {currentProject ? 'Conversa Especializada' : 'Assistente (Inativo)'}
                </CardTitle>
                <CardDescription className="text-slate-600 text-sm">
                  {currentProject ? 'Perguntas baseadas no seu projeto' : 'Envie um projeto para ativar'}
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
                      placeholder={currentProject ? "Digite sua pergunta sobre o projeto..." : "Envie um projeto primeiro..."}
                      disabled={isLoading || !currentProject}
                      className="flex-1 h-10 sm:h-12 px-3 sm:px-4 rounded-xl border-slate-300 focus:border-purple-500 focus:ring-purple-500 text-sm sm:text-base"
                    />
                    <ActionButton 
                      size="md"
                      onClick={handleSendClick}
                      disabled={isLoading || !question.trim() || !currentProject}
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
                  {currentProject ? 'Perguntas Sugeridas' : 'Aguardando Projeto'}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  {currentProject ? 'Baseadas no seu projeto' : 'Envie um PDF primeiro'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 sm:space-y-3">
                  {exampleQuestions.map((example, index) => (
                    <ActionButton
                      key={index}
                      variant="outline"
                      onClick={() => currentProject && setQuestion(example)}
                      disabled={!currentProject}
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
                  Como Funciona
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-slate-600">
                  <div className="flex items-start space-x-3">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p>{currentProject ? 'IA analisou seu projeto específico' : 'Primeiro: envie um projeto PDF'}</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p>{currentProject ? 'Respostas baseadas nos dados extraídos' : 'IA extrairá dados técnicos'}</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p>{currentProject ? 'Pergunte sobre áreas, materiais, especificações' : 'Então poderá fazer perguntas específicas'}</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p>{currentProject ? 'Conversas salvas por projeto' : 'Assistente será contextualizado'}</p>
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

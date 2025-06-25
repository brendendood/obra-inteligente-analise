
import { useParams } from 'react-router-dom';
import { ProjectWorkspace } from '@/components/project/ProjectWorkspace';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, Send, User } from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';
import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  message: string;
  timestamp: Date;
}

const ProjectSpecificAssistant = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { currentProject } = useProject();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      message: `Olá! Sou o assistente IA especializado no seu projeto "${currentProject?.name}". Como posso ajudá-lo com questões específicas sobre este projeto?`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!inputMessage.trim() || !currentProject) return;
    
    console.log('🤖 ASSISTENTE: Enviando mensagem para projeto:', currentProject.name);
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      message: inputMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    
    // Simular resposta do assistente específica do projeto
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        message: `Sobre o projeto "${currentProject.name}" (${currentProject.total_area || 100}m²): ${getProjectSpecificResponse(inputMessage, currentProject)}`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const getProjectSpecificResponse = (question: string, project: any) => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('área') || lowerQuestion.includes('tamanho')) {
      return `A área total deste projeto é de ${project.total_area || 100}m². Com base nessa área, posso ajudá-lo com cálculos de materiais, estimativas de tempo e custos específicos.`;
    }
    
    if (lowerQuestion.includes('orçamento') || lowerQuestion.includes('custo')) {
      return `Para um projeto de ${project.total_area || 100}m², posso estimar que os custos variem entre R$ ${((project.total_area || 100) * 800).toLocaleString()} e R$ ${((project.total_area || 100) * 1200).toLocaleString()}, dependendo do padrão de acabamento. Que tipo de orçamento específico você gostaria?`;
    }
    
    if (lowerQuestion.includes('cronograma') || lowerQuestion.includes('tempo') || lowerQuestion.includes('prazo')) {
      const duration = (project.total_area || 100) > 200 ? '6-8 meses' : (project.total_area || 100) > 100 ? '4-6 meses' : '3-4 meses';
      return `Baseado na área de ${project.total_area || 100}m², estimo um prazo de execução de ${duration}. Posso detalhar cada fase da obra se desejar.`;
    }
    
    if (lowerQuestion.includes('material') || lowerQuestion.includes('insumo')) {
      return `Para este projeto específico, posso calcular as quantidades necessárias de: concreto, aço, tijolos, cimento, etc. Sobre qual material específico você gostaria de saber?`;
    }
    
    return `Analisando especificamente o projeto "${project.name}", posso ajudá-lo com questões sobre orçamento, cronograma, materiais, especificações técnicas e normativas aplicáveis. Como posso ser mais específico na sua consulta?`;
  };

  if (!currentProject) {
    return (
      <ProjectWorkspace>
        <div className="text-center py-16">
          <Bot className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Projeto não encontrado</h3>
          <p className="text-gray-600">Não foi possível carregar os dados do projeto.</p>
        </div>
      </ProjectWorkspace>
    );
  }

  return (
    <ProjectWorkspace>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Assistente IA - {currentProject.name}</h1>
            <p className="text-gray-600">Chat especializado baseado nos dados específicos deste projeto</p>
          </div>
        </div>

        <Card className="h-[600px] flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Bot className="h-5 w-5 mr-2 text-purple-600" />
              Chat Especializado do Projeto
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <div className="flex items-start space-x-2">
                        {message.sender === 'assistant' && (
                          <Bot className="h-4 w-4 mt-0.5 text-purple-600" />
                        )}
                        {message.sender === 'user' && (
                          <User className="h-4 w-4 mt-0.5 text-blue-100" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm">{message.message}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString('pt-BR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                      <div className="flex items-center space-x-2">
                        <Bot className="h-4 w-4 text-purple-600" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-200">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Pergunte sobre o projeto ${currentProject.name}...`}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                disabled={isTyping}
                className="flex-1"
              />
              <Button 
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProjectWorkspace>
  );
};

export default ProjectSpecificAssistant;

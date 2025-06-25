
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, User, FileText, Calculator, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  message: string;
  timestamp: Date;
  metadata?: {
    type?: 'suggestion' | 'calculation' | 'timeline';
    data?: any;
  };
}

interface ProjectAssistantChatProps {
  project: any;
  onGenerateBudget?: () => void;
  onGenerateSchedule?: () => void;
  onViewDocuments?: () => void;
}

export const ProjectAssistantChat = ({ 
  project, 
  onGenerateBudget, 
  onGenerateSchedule, 
  onViewDocuments 
}: ProjectAssistantChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      message: `Olá! Sou o assistente IA especializado no projeto "${project?.name}". Posso ajudá-lo com análises técnicas, estimativas de custos, cronogramas e questões específicas sobre sua obra. Como posso ajudar?`,
      timestamp: new Date(),
      metadata: { type: 'suggestion' }
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const getIntelligentResponse = (question: string, projectData: any) => {
    const lowerQuestion = question.toLowerCase();
    const area = projectData.total_area || 100;
    const analysisData = projectData.analysis_data;
    
    // Análise de custos
    if (lowerQuestion.includes('custo') || lowerQuestion.includes('orçamento') || lowerQuestion.includes('preço')) {
      const costPerM2 = area > 200 ? 1200 : area > 100 ? 1000 : 800;
      const estimatedCost = area * costPerM2;
      
      return {
        message: `📊 **Análise de Custos para ${projectData.name}**\n\n` +
                `Para uma área de ${area}m², com base nos padrões atuais:\n\n` +
                `• **Custo estimado**: R$ ${estimatedCost.toLocaleString()}\n` +
                `• **Custo por m²**: R$ ${costPerM2}\n` +
                `• **Variação esperada**: ±15%\n\n` +
                `💡 Gostaria que eu gere um orçamento detalhado baseado na tabela SINAPI?`,
        metadata: { 
          type: 'calculation',
          data: { estimatedCost, costPerM2, area }
        }
      };
    }
    
    // Análise de cronograma
    if (lowerQuestion.includes('tempo') || lowerQuestion.includes('prazo') || lowerQuestion.includes('cronograma') || lowerQuestion.includes('duração')) {
      const duration = area > 200 ? '8-10 meses' : area > 100 ? '5-7 meses' : '3-5 meses';
      const phases = [
        'Fundação e movimentação de terra',
        'Estrutura e lajes',
        'Alvenaria e vedação',
        'Instalações (hidráulica/elétrica)',
        'Acabamentos e pintura'
      ];
      
      return {
        message: `⏱️ **Análise de Cronograma para ${projectData.name}**\n\n` +
                `Para ${area}m², o prazo estimado é de **${duration}**\n\n` +
                `**Principais fases:**\n` +
                phases.map((phase, i) => `${i + 1}. ${phase}`).join('\n') + '\n\n' +
                `💡 Posso gerar um cronograma detalhado com datas específicas?`,
        metadata: { 
          type: 'timeline',
          data: { duration, phases, area }
        }
      };
    }
    
    // Análise de materiais
    if (lowerQuestion.includes('material') || lowerQuestion.includes('insumo') || lowerQuestion.includes('concreto') || lowerQuestion.includes('aço')) {
      return {
        message: `🏗️ **Estimativa de Materiais para ${projectData.name}**\n\n` +
                `Para ${area}m²:\n\n` +
                `• **Concreto**: ~${(area * 0.15).toFixed(1)}m³\n` +
                `• **Aço**: ~${(area * 8).toFixed(0)}kg\n` +
                `• **Tijolos**: ~${(area * 45).toFixed(0)} unidades\n` +
                `• **Cimento**: ~${(area * 7).toFixed(0)} sacos\n\n` +
                `*Estimativas baseadas em padrões construtivos residenciais*\n\n` +
                `📋 Sobre qual material específico gostaria de mais detalhes?`,
        metadata: { 
          type: 'calculation',
          data: { materials: true, area }
        }
      };
    }
    
    // Análise técnica baseada nos dados do projeto
    if (analysisData && (lowerQuestion.includes('análise') || lowerQuestion.includes('técnic'))) {
      return {
        message: `🔍 **Análise Técnica Detalhada**\n\n` +
                `Com base no PDF analisado do projeto "${projectData.name}":\n\n` +
                `• **Status**: ✅ Projeto processado com sucesso\n` +
                `• **Área total**: ${area}m²\n` +
                `• **Dados extraídos**: Plantas, especificações e detalhes técnicos\n\n` +
                `📄 Os dados foram processados pela nossa IA e estão prontos para gerar:\n` +
                `- Orçamento SINAPI detalhado\n` +
                `- Cronograma de execução\n` +
                `- Lista de materiais\n\n` +
                `Qual análise específica você gostaria de ver primeiro?`,
        metadata: { 
          type: 'suggestion',
          data: { hasAnalysis: true }
        }
      };
    }
    
    // Resposta genérica inteligente
    return {
      message: `🤖 Entendi sua pergunta sobre "${question}"\n\n` +
              `Como especialista no projeto "${projectData.name}" (${area}m²), posso ajudar com:\n\n` +
              `📊 **Orçamento e custos** - Estimativas baseadas em SINAPI\n` +
              `⏱️ **Cronogramas** - Prazos realistas por etapa\n` +
              `🏗️ **Materiais** - Quantitativos e especificações\n` +
              `📋 **Normas técnicas** - NBRs aplicáveis\n` +
              `🔍 **Análise técnica** - Insights do seu projeto\n\n` +
              `Sobre qual aspecto específico você gostaria de conversar?`,
      metadata: { type: 'suggestion' }
    };
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !project) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      message: inputMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    
    // Simular processamento da IA
    setTimeout(() => {
      const response = getIntelligentResponse(inputMessage, project);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        message: response.message,
        timestamp: new Date(),
        metadata: response.metadata
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const renderMessage = (message: ChatMessage) => (
    <div
      key={message.id}
      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`max-w-[80%] rounded-lg p-4 ${
        message.sender === 'user' 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-100 text-gray-900'
      }`}>
        <div className="flex items-start space-x-2">
          {message.sender === 'assistant' && (
            <Bot className="h-4 w-4 mt-0.5 text-purple-600 flex-shrink-0" />
          )}
          {message.sender === 'user' && (
            <User className="h-4 w-4 mt-0.5 text-blue-100 flex-shrink-0" />
          )}
          <div className="flex-1">
            <div className="text-sm whitespace-pre-line">{message.message}</div>
            <div className={`text-xs mt-2 ${
              message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
            }`}>
              {message.timestamp.toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
            
            {/* Action buttons for assistant messages */}
            {message.sender === 'assistant' && message.metadata && (
              <div className="flex flex-wrap gap-2 mt-3">
                {message.metadata.type === 'calculation' && onGenerateBudget && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onGenerateBudget}
                    className="bg-white hover:bg-gray-50"
                  >
                    <Calculator className="h-3 w-3 mr-1" />
                    Gerar Orçamento
                  </Button>
                )}
                {message.metadata.type === 'timeline' && onGenerateSchedule && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onGenerateSchedule}
                    className="bg-white hover:bg-gray-50"
                  >
                    <Calendar className="h-3 w-3 mr-1" />
                    Gerar Cronograma
                  </Button>
                )}
                {message.metadata.type === 'suggestion' && onViewDocuments && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onViewDocuments}
                    className="bg-white hover:bg-gray-50"
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    Ver Documentos
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-[600px]">
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-2">
          {messages.map(renderMessage)}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-4 max-w-[80%]">
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
      
      <div className="flex space-x-2 p-4 border-t border-gray-200">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={`Pergunte sobre o projeto ${project?.name}...`}
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
    </div>
  );
};

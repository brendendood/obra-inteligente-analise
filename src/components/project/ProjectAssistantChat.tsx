
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send } from 'lucide-react';
import { ChatMessage, ProjectAssistantChatProps } from '@/types/chat';
import { ChatMessageItem } from './chat/ChatMessageItem';
import { ChatTypingIndicator } from './chat/ChatTypingIndicator';
import { getIntelligentResponse } from '@/utils/chatResponseGenerator';

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
      metadata: { type: 'suggestion' as const }
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

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

  return (
    <div className="flex flex-col h-[600px]">
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-2">
          {messages.map((message) => (
            <ChatMessageItem
              key={message.id}
              message={message}
              onGenerateBudget={onGenerateBudget}
              onGenerateSchedule={onGenerateSchedule}
              onViewDocuments={onViewDocuments}
            />
          ))}
          
          {isTyping && <ChatTypingIndicator />}
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

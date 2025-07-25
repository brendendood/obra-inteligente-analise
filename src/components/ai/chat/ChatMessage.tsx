
import { Bot, User } from 'lucide-react';
import { ChatMessageActions } from './ChatMessageActions';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatMessageProps {
  message: ChatMessage;
  onRegenerate?: () => void;
  onRate?: (messageId: string, rating: number) => void;
}

export const ChatMessage = ({ message, onRegenerate, onRate }: ChatMessageProps) => {
  const isUser = message.sender === 'user';
  const isAssistant = message.sender === 'assistant';

  // Função para renderizar markdown básico
  const renderContent = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        // Headers
        if (line.startsWith('**') && line.endsWith('**')) {
          return (
            <div key={index} className="font-semibold text-gray-900 mb-2">
              {line.replace(/\*\*/g, '')}
            </div>
          );
        }
        
        // Bullet points
        if (line.startsWith('• ') || line.startsWith('✓ ')) {
          return (
            <div key={index} className="ml-2 mb-1 text-sm">
              {line}
            </div>
          );
        }
        
        // Sub-items
        if (line.startsWith('  • ') || line.startsWith('  ✓ ')) {
          return (
            <div key={index} className="ml-6 mb-1 text-sm text-gray-700">
              {line.trim()}
            </div>
          );
        }
        
        // Seções com emojis
        if (line.includes('🏗️') || line.includes('💰') || line.includes('🧱') || line.includes('📋') || line.includes('⏱️')) {
          return (
            <div key={index} className="font-medium text-gray-800 mb-2 border-l-2 border-blue-200 pl-3">
              {line}
            </div>
          );
        }
        
        // Texto normal
        if (line.trim()) {
          return (
            <div key={index} className="mb-2 text-sm leading-relaxed">
              {line}
            </div>
          );
        }
        
        return <br key={index} />;
      });
  };

  return (
    <div className={`flex gap-3 group ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser 
          ? 'bg-blue-600 text-white' 
          : 'bg-gradient-to-r from-blue-600 to-green-600 text-white'
      }`}>
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      
      <div className={`flex-1 ${isUser ? 'text-right' : ''}`}>
        <div className={`inline-block max-w-[85%] p-4 rounded-lg ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-50 text-gray-900 rounded-bl-none border border-gray-100'
        }`}>
          {isUser ? (
            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
          ) : (
            <div className="text-sm">
              {renderContent(message.content)}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-1">
          <p className={`text-xs text-gray-500 ${isUser ? 'text-right order-2' : ''}`}>
            {message.timestamp.toLocaleTimeString('pt-BR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
          
          {isAssistant && (
            <div className={isUser ? 'order-1' : ''}>
              <ChatMessageActions
                messageId={message.id}
                content={message.content}
                onRegenerate={onRegenerate}
                onRate={(rating) => onRate?.(message.id, rating)}
                isAssistant={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

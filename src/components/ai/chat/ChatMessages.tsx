
import { ChatMessage } from './ChatMessage';
import { ChatEmptyState } from './ChatEmptyState';
import { AITypingIndicator } from '../AITypingIndicator';

// Usar a interface do useAIChat ao invés de duplicar

interface ChatMessagesProps {
  messages: any[]; // Usar any[] para aceitar diferentes formatos
  isLoading: boolean;
  onRegenerate?: () => void;
  onRate?: (messageId: string, rating: number) => void;
}

export const ChatMessages = ({ messages, isLoading, onRegenerate, onRate }: ChatMessagesProps) => {
  return (
    <div 
      className="flex-1 p-4 overflow-y-auto scrollbar-hide"
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}
    >
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="space-y-4">
        {messages.length === 0 && <ChatEmptyState />}

        {messages.map((message) => (
          <ChatMessage 
            key={message.id} 
            message={message} 
            onRegenerate={onRegenerate}
            onRate={onRate}
          />
        ))}

        {isLoading && <AITypingIndicator />}
      </div>
    </div>
  );
};

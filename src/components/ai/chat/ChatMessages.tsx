
import { ChatMessage } from './ChatMessage';
import { ChatEmptyState } from './ChatEmptyState';
import { AITypingIndicator } from '../AITypingIndicator';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatMessagesProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export const ChatMessages = ({ messages, isLoading }: ChatMessagesProps) => {
  const scrollbarHideStyle = {
    scrollbarWidth: 'none' as const,
    msOverflowStyle: 'none' as const,
    WebkitScrollbar: {
      display: 'none'
    }
  };

  return (
    <div 
      className="flex-1 p-4 overflow-y-auto" 
      style={scrollbarHideStyle}
      css={{
        '&::-webkit-scrollbar': {
          display: 'none'
        }
      }}
    >
      <div className="space-y-4">
        {messages.length === 0 && <ChatEmptyState />}

        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isLoading && <AITypingIndicator />}
      </div>
    </div>
  );
};


import { Bot, User } from 'lucide-react';
import { ChatMessage } from '@/types/chat';
import { ChatMessageActionButtons } from './ChatMessageActionButtons';

interface ChatMessageItemProps {
  message: ChatMessage;
  onGenerateBudget?: () => void;
  onGenerateSchedule?: () => void;
  onViewDocuments?: () => void;
}

export const ChatMessageItem = ({
  message,
  onGenerateBudget,
  onGenerateSchedule,
  onViewDocuments
}: ChatMessageItemProps) => {
  return (
    <div
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
            
            <ChatMessageActionButtons
              message={message}
              onGenerateBudget={onGenerateBudget}
              onGenerateSchedule={onGenerateSchedule}
              onViewDocuments={onViewDocuments}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

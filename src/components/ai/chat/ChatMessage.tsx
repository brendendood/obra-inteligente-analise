
import { Bot, User } from 'lucide-react';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatMessageProps {
  message: ChatMessage;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <div
      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex items-start space-x-3 max-w-[85%] sm:max-w-[70%]`}>
        {message.sender === 'assistant' && (
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <Bot className="h-4 w-4 text-white" />
          </div>
        )}
        
        <div
          className={`rounded-2xl px-4 py-3 ${
            message.sender === 'user'
              ? 'bg-blue-600 text-white ml-auto'
              : 'bg-gray-100 text-gray-900'
          }`}
        >
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {message.content}
          </p>
          <p className={`text-xs mt-2 ${
            message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
          }`}>
            {message.timestamp.toLocaleTimeString('pt-BR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>

        {message.sender === 'user' && (
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <User className="h-4 w-4 text-white" />
          </div>
        )}
      </div>
    </div>
  );
};


import { Bot } from 'lucide-react';

export const ChatTypingIndicator = () => {
  return (
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
  );
};

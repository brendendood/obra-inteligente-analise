
import { Bot } from 'lucide-react';

export const AITypingIndicator = () => {
  return (
    <div className="flex justify-start mb-6">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
          <Bot className="h-5 w-5 text-white" />
        </div>
        
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-4">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

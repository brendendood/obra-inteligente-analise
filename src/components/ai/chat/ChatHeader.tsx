
import { Bot } from 'lucide-react';

export const ChatHeader = () => {
  return (
    <div className="flex-shrink-0 p-4 border-b border-gray-100">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
          <Bot className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Assistente MadenAI</h2>
          <p className="text-sm text-gray-500">Especialista em arquitetura e engenharia civil</p>
        </div>
      </div>
    </div>
  );
};

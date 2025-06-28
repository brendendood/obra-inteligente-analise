
import { Bot } from 'lucide-react';

export const ChatEmptyState = () => {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Bot className="h-8 w-8 text-purple-600" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Olá! Sou sua assistente de arquitetura e engenharia.
      </h3>
      <p className="text-gray-600 max-w-md mx-auto">
        Pergunte o que quiser sobre projetos, cálculos estruturais, normas técnicas, 
        materiais de construção e muito mais.
      </p>
    </div>
  );
};

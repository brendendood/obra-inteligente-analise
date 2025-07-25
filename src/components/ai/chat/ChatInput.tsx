
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  sendMessage: () => void;
  isLoading: boolean;
  projectName?: string;
}

export const ChatInput = ({ 
  inputMessage, 
  setInputMessage, 
  sendMessage, 
  isLoading,
  projectName 
}: ChatInputProps) => {
  const isMobile = useIsMobile();

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getPlaceholder = () => {
    if (projectName) {
      return `Ex: "Como dimensionar fundações para ${projectName}?" ou "Orçamento por etapas"`;
    }
    return 'Ex: "Custo por m² construção padrão médio" ou "NBR para estruturas de concreto"';
  };

  return (
    <div className="border-t border-gray-100 p-4 bg-white">
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={getPlaceholder()}
            disabled={isLoading}
            className="min-h-[50px] max-h-32 resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            style={isMobile ? { fontSize: '16px' } : {}}
          />
        </div>
        
        <Button 
          onClick={sendMessage}
          disabled={!inputMessage.trim() || isLoading}
          className="bg-blue-600 hover:bg-blue-700 h-[50px] px-4"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      {isLoading && (
        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
          <span>Consultor especializado analisando...</span>
        </div>
      )}
    </div>
  );
};

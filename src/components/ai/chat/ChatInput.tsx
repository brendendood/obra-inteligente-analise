
import { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  sendMessage: () => void;
  isLoading: boolean;
}

export const ChatInput = ({ 
  inputMessage, 
  setInputMessage, 
  sendMessage, 
  isLoading 
}: ChatInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputMessage]);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 200);
      textareaRef.current.style.height = newHeight + 'px';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex-shrink-0 p-4 border-t border-gray-100">
      <div className="flex items-end space-x-3">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Pergunte algo sobre arquitetura ou engenharia civil..."
            className="resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-12 min-h-[44px] max-h-[200px]"
            disabled={isLoading}
          />
        </div>
        <Button
          onClick={sendMessage}
          disabled={!inputMessage.trim() || isLoading}
          className="bg-blue-600 hover:bg-blue-700 h-20 w-20 p-0 flex-shrink-0 rounded-2xl hidden sm:flex"
        >
          <Send className="h-7 w-7" />
        </Button>
        <Button
          onClick={sendMessage}
          disabled={!inputMessage.trim() || isLoading}
          className="bg-blue-600 hover:bg-blue-700 h-11 w-11 p-0 flex-shrink-0 rounded-xl sm:hidden"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

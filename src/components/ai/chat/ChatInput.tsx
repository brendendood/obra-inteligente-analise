
import { useRef, useEffect } from 'react';
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
      const newHeight = Math.min(textareaRef.current.scrollHeight, 100);
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
      <div className="flex items-end gap-3">
        <div className="flex-1 min-w-0">
          <Textarea
            ref={textareaRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Pergunte algo sobre arquitetura ou engenharia civil..."
            className="resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-h-[32px] max-h-[100px] w-full py-2"
            disabled={isLoading}
          />
        </div>
        <button
          onClick={sendMessage}
          disabled={!inputMessage.trim() || isLoading}
          className="p-2 disabled:opacity-50 disabled:cursor-not-disabled"
        >
          <Send className="h-5 w-5 text-blue-600" />
        </button>
      </div>
    </div>
  );
};

import { Button } from '@/components/ui/button';
import { RotateCcw, ThumbsUp, ThumbsDown, Copy } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ChatMessageActionsProps {
  messageId: string;
  content: string;
  onRegenerate?: () => void;
  onRate?: (rating: number) => void;
  isAssistant?: boolean;
}

export const ChatMessageActions = ({ 
  messageId, 
  content, 
  onRegenerate, 
  onRate,
  isAssistant = false 
}: ChatMessageActionsProps) => {
  const [rating, setRating] = useState<number | null>(null);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Texto copiado",
        description: "O conteúdo foi copiado para a área de transferência.",
      });
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const handleRate = (newRating: number) => {
    setRating(newRating);
    onRate?.(newRating);
    toast({
      title: newRating > 0 ? "Obrigado pelo feedback positivo!" : "Feedback registrado",
      description: "Sua avaliação nos ajuda a melhorar o assistente.",
    });
  };

  if (!isAssistant) return null;

  return (
    <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className="h-7 px-2 text-gray-500 hover:text-gray-700"
      >
        <Copy className="h-3 w-3" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onRegenerate}
        className="h-7 px-2 text-gray-500 hover:text-gray-700"
      >
        <RotateCcw className="h-3 w-3" />
      </Button>
      
      <div className="flex items-center gap-1 ml-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleRate(1)}
          className={`h-7 px-2 ${rating === 1 ? 'text-green-600' : 'text-gray-400 hover:text-green-600'}`}
        >
          <ThumbsUp className="h-3 w-3" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleRate(-1)}
          className={`h-7 px-2 ${rating === -1 ? 'text-red-600' : 'text-gray-400 hover:text-red-600'}`}
        >
          <ThumbsDown className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};
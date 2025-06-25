
import { Button } from '@/components/ui/button';
import { Calculator, Calendar, FileText } from 'lucide-react';
import { ChatMessage } from '@/types/chat';

interface ChatMessageActionButtonsProps {
  message: ChatMessage;
  onGenerateBudget?: () => void;
  onGenerateSchedule?: () => void;
  onViewDocuments?: () => void;
}

export const ChatMessageActionButtons = ({
  message,
  onGenerateBudget,
  onGenerateSchedule,
  onViewDocuments
}: ChatMessageActionButtonsProps) => {
  if (message.sender !== 'assistant' || !message.metadata) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {message.metadata.type === 'calculation' && onGenerateBudget && (
        <Button
          size="sm"
          variant="outline"
          onClick={onGenerateBudget}
          className="bg-white hover:bg-gray-50"
        >
          <Calculator className="h-3 w-3 mr-1" />
          Gerar Orçamento
        </Button>
      )}
      {message.metadata.type === 'timeline' && onGenerateSchedule && (
        <Button
          size="sm"
          variant="outline"
          onClick={onGenerateSchedule}
          className="bg-white hover:bg-gray-50"
        >
          <Calendar className="h-3 w-3 mr-1" />
          Gerar Cronograma
        </Button>
      )}
      {message.metadata.type === 'suggestion' && onViewDocuments && (
        <Button
          size="sm"
          variant="outline"
          onClick={onViewDocuments}
          className="bg-white hover:bg-gray-50"
        >
          <FileText className="h-3 w-3 mr-1" />
          Ver Documentos
        </Button>
      )}
    </div>
  );
};

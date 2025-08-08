
import { Bot } from 'lucide-react';
import { CompactUnifiedLoading } from '@/components/ui/unified-loading';
import { TypingDots } from '@/components/ui/TypingDots';

export const ChatTypingIndicator = () => {
  return (
    <div className="flex justify-start">
      <div className="bg-gray-100 rounded-lg p-4 max-w-[80%]">
        <div className="flex items-center space-x-2">
          <Bot className="h-4 w-4 text-purple-600" />
          <TypingDots />
        </div>
      </div>
    </div>
  );
};

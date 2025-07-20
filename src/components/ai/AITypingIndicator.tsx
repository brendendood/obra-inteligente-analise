
import { Bot } from 'lucide-react';
import { CompactUnifiedLoading } from '@/components/ui/unified-loading';

export const AITypingIndicator = () => {
  return (
    <div className="flex justify-start">
      <div className="flex items-start space-x-3 max-w-[85%] sm:max-w-[70%]">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <Bot className="h-4 w-4 text-white" />
        </div>
        
        <div className="bg-gray-100 rounded-2xl px-4 py-3">
          <CompactUnifiedLoading text="Respondendo..." />
        </div>
      </div>
    </div>
  );
};

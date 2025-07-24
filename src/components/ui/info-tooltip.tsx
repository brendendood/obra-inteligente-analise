
import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { sanitizeAIContent } from '@/utils/contentSanitizer';

interface InfoTooltipProps {
  content: string | React.ReactNode;
  className?: string;
}

export const InfoTooltip = ({ content, className = '' }: InfoTooltipProps) => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button 
            className={`text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded ${className}`}
            type="button"
            aria-label="Informações sobre esta métrica"
          >
            <HelpCircle className="h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          align="center"
          className="max-w-sm w-80 p-4 text-sm leading-relaxed bg-gray-50 text-gray-700 border border-gray-200 shadow-xl z-[9999]"
          sideOffset={12}
          avoidCollisions={true}
          collisionPadding={20}
        >
          <div className="max-h-96 overflow-y-auto space-y-2">
            {typeof content === 'string' ? (
              <div dangerouslySetInnerHTML={{ __html: sanitizeAIContent(content) }} />
            ) : (
              content
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

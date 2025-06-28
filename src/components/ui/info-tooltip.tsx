
import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface InfoTooltipProps {
  content: string;
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
          className="max-w-md p-4 text-sm leading-relaxed bg-gray-100 text-gray-800 border border-gray-300 shadow-xl z-[9999]"
          sideOffset={12}
          avoidCollisions={true}
          collisionPadding={20}
        >
          <div className="whitespace-pre-line max-h-96 overflow-y-auto">
            {content}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};


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
          className="max-w-sm p-4 text-sm leading-relaxed bg-gray-900 text-white border border-gray-700 shadow-lg"
          sideOffset={8}
        >
          <div className="whitespace-pre-line">
            {content}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

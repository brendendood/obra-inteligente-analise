import { Hammer, Drill, Wrench, Ruler } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConstructionLoadingProps {
  text?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ConstructionLoading = ({ 
  text = "Construindo resultados...", 
  className,
  size = 'md'
}: ConstructionLoadingProps) => {
  const iconSize = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
      <div className="flex items-center justify-center space-x-2">
        <div className="animate-hammer">
          <Hammer className={cn(iconSize[size], "text-orange-500")} />
        </div>
        <div className="animate-drill">
          <Drill className={cn(iconSize[size], "text-blue-500")} />
        </div>
        <div className="animate-wrench">
          <Wrench className={cn(iconSize[size], "text-green-500")} />
        </div>
        <div className="animate-ruler">
          <Ruler className={cn(iconSize[size], "text-purple-500")} />
        </div>
      </div>
      {text && (
        <p className="text-sm text-muted-foreground font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export const InlineConstructionLoading = ({ 
  text = "Construindo resultados...", 
  className 
}: { 
  text?: string;
  className?: string;
}) => (
  <div className={cn("flex items-center justify-center space-x-2 text-muted-foreground py-4", className)}>
    <div className="animate-hammer">
      <Hammer className="h-4 w-4 text-orange-500" />
    </div>
    <span className="text-sm">{text}</span>
  </div>
);

export const PageConstructionLoading = ({ 
  text = "Construindo página...", 
  className 
}: { 
  text?: string;
  className?: string;
}) => (
  <div className={cn("flex items-center justify-center min-h-[400px]", className)}>
    <div className="text-center space-y-6">
      <ConstructionLoading size="lg" />
      <p className="text-muted-foreground font-medium">{text}</p>
    </div>
  </div>
);

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LucideIcon, Lock, Hammer } from 'lucide-react';

interface ProjectActionCardProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  isMinimal?: boolean;
}

const ProjectActionCard: React.FC<ProjectActionCardProps> = ({
  icon: Icon,
  title,
  description,
  onClick,
  disabled = false,
  isLoading = false,
  className = "",
  isMinimal = false
}) => {
  
  // Versão Minimalista - Apple Style
  if (isMinimal) {
    return (
      <button
        onClick={!disabled ? onClick : undefined}
        disabled={disabled}
        className={`
          group relative bg-card border border-border rounded-2xl p-6
          transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
          min-h-[140px] flex flex-col items-center justify-center text-center
          ${disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:bg-accent hover:shadow-sm cursor-pointer'
          }
          ${className}
        `}
      >
        {/* Ícone */}
        <div className={`
          mb-3 transition-all duration-200
          ${disabled 
            ? 'text-muted-foreground' 
            : 'text-primary group-hover:scale-110'
          }
        `}>
          <Icon className="h-6 w-6" />
        </div>
        
        {/* Título */}
        <h3 className={`
          text-sm font-medium leading-tight
          ${disabled ? 'text-muted-foreground' : 'text-foreground'}
        `}>
          {title}
        </h3>
        
        {/* Lock indicator para disabled */}
        {disabled && (
          <div className="absolute top-2 right-2">
            <Lock className="h-3 w-3 text-muted-foreground" />
          </div>
        )}
      </button>
    );
  }

  // Versão Original (mantida para compatibilidade)
  return (
    <Card 
      className={`
        group relative overflow-hidden bg-white 
        transition-all duration-200 cursor-pointer
        w-full min-w-0 max-w-full
        ${disabled ? 'opacity-60' : ''}
        ${className}
      `}
      onClick={!disabled ? onClick : undefined}
    >
      <CardContent className="p-6 sm:p-8 lg:p-10 w-full min-h-[240px] sm:min-h-[280px] lg:min-h-[320px] flex flex-col justify-between">
        <div className="space-y-5 sm:space-y-7 w-full flex-1">
          {/* Header com ícone */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between w-full min-w-0 gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 flex-1 min-w-0">
              <div className={`
                p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl transition-colors duration-200 flex-shrink-0 self-start sm:self-auto
                ${disabled 
                  ? 'bg-muted' 
                  : 'bg-primary/10'
                }
              `}>
                <Icon className={`
                  h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 transition-colors duration-200
                  ${disabled ? 'text-muted-foreground' : 'text-primary'}
                `} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground mb-3 lg:mb-4 break-words leading-tight">
                  {title}
                </h3>
                {disabled && (
                  <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 rounded-lg px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm">
                    <Lock className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span>Aguardando processamento</span>
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          {/* Descrição */}
          {description && (
            <p className="text-muted-foreground leading-relaxed text-base sm:text-lg lg:text-xl break-words hyphens-auto">
              {description}
            </p>
          )}
          
          {/* Status visual */}
          {!disabled && (
            <div className="flex items-center justify-start sm:justify-end pt-3 lg:pt-4 mt-auto">
              <div className="text-primary text-sm sm:text-base lg:text-lg font-medium">
                Clique para acessar →
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectActionCard;

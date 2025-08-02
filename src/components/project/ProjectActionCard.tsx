
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LucideIcon, Lock, Hammer } from 'lucide-react';

interface ProjectActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
}

const ProjectActionCard: React.FC<ProjectActionCardProps> = ({
  icon: Icon,
  title,
  description,
  onClick,
  disabled = false,
  isLoading = false,
  className = ""
}) => {
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
      <CardContent className="p-4 sm:p-6 lg:p-8 w-full">
        <div className="space-y-4 sm:space-y-6 w-full">
          {/* Header com ícone - mobile stack, desktop horizontal */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between w-full min-w-0 gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 flex-1 min-w-0">
              <div className={`
                p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-colors duration-200 flex-shrink-0 self-start sm:self-auto
                ${disabled 
                  ? 'bg-apple-gray-100' 
                  : 'bg-apple-blue/10'
                }
              `}>
                <Icon className={`
                  h-6 w-6 sm:h-8 sm:w-8 transition-colors duration-200
                  ${disabled ? 'text-apple-gray-400' : 'text-apple-blue'}
                `} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold text-apple-gray-900 mb-2 break-words">
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
          <p className="text-apple-gray-600 leading-relaxed text-sm sm:text-base break-words hyphens-auto">
            {description}
          </p>
          
          {/* Status visual */}
          {!disabled && (
            <div className="flex items-center justify-start sm:justify-end pt-2">
              <div className="text-apple-blue text-xs sm:text-sm font-medium">
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

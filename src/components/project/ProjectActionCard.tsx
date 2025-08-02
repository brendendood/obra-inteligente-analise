
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
      <CardContent className="p-8 w-full">
        <div className="space-y-6 w-full">
          {/* Header com ícone */}
          <div className="flex items-start justify-between w-full min-w-0 gap-4">
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <div className={`
                p-4 rounded-2xl transition-colors duration-200 flex-shrink-0
                ${disabled 
                  ? 'bg-apple-gray-100' 
                  : 'bg-apple-blue/10'
                }
              `}>
                <Icon className={`
                  h-8 w-8 transition-colors duration-200
                  ${disabled ? 'text-apple-gray-400' : 'text-apple-blue'}
                `} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-semibold text-apple-gray-900 mb-2">
                  {title}
                </h3>
                {disabled && (
                  <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 rounded-lg px-3 py-1">
                    <Lock className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span>Aguardando processamento</span>
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          {/* Descrição */}
          <p className="text-apple-gray-600 leading-relaxed text-base break-words">
            {description}
          </p>
          
          {/* Status visual */}
          {!disabled && (
            <div className="flex items-center justify-end">
              <div className="text-apple-blue text-sm font-medium">
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

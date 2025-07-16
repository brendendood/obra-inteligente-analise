
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
        group relative overflow-hidden border border-gray-200 bg-white 
        transition-all duration-200 hover:shadow-md hover:border-gray-300
        w-full min-w-0 max-w-full
        ${disabled ? 'opacity-60' : 'hover:-translate-y-1'}
        ${className}
      `}
    >
      <CardContent className="p-4 sm:p-6 w-full">
        <div className="space-y-3 sm:space-y-4 w-full">
          {/* Header com ícone e status */}
          <div className="flex items-start justify-between w-full min-w-0 gap-2">
            <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
              <div className={`
                p-2 sm:p-3 rounded-xl transition-colors duration-200 flex-shrink-0
                ${disabled 
                  ? 'bg-gray-100' 
                  : 'bg-blue-50 group-hover:bg-blue-100'
                }
              `}>
                <Icon className={`
                  h-5 w-5 sm:h-6 sm:w-6 transition-colors duration-200
                  ${disabled ? 'text-gray-400' : 'text-blue-600'}
                `} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 truncate">
                  {title}
                </h3>
                {disabled && (
                  <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs">
                    <Lock className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span className="truncate">Aguardando processamento</span>
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          {/* Descrição */}
          <p className="text-gray-600 leading-relaxed text-sm break-words">
            {description}
          </p>
          
          {/* Botão de ação */}
          <div className="pt-2 w-full">
            <Button
              onClick={onClick}
              disabled={disabled || isLoading}
              className={`
                w-full h-10 font-medium transition-all duration-200 min-w-0
                ${disabled 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-sm'
                }
              `}
              style={{ fontSize: '16px' }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2 w-full min-w-0">
                  <div className="animate-hammer">
                    <Hammer className="h-4 w-4 text-orange-500 flex-shrink-0" />
                  </div>
                  <span className="truncate">Carregando...</span>
                </div>
              ) : disabled ? (
                'Indisponível'
              ) : (
                'Acessar'
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectActionCard;

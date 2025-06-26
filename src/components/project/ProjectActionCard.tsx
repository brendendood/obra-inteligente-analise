
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LucideIcon, Lock } from 'lucide-react';

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
        ${disabled ? 'opacity-60' : 'hover:-translate-y-1'}
        ${className}
      `}
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header com ícone e status */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className={`
                p-3 rounded-xl transition-colors duration-200
                ${disabled 
                  ? 'bg-gray-100' 
                  : 'bg-blue-50 group-hover:bg-blue-100'
                }
              `}>
                <Icon className={`
                  h-6 w-6 transition-colors duration-200
                  ${disabled ? 'text-gray-400' : 'text-blue-600'}
                `} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {title}
                </h3>
                {disabled && (
                  <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs">
                    <Lock className="h-3 w-3 mr-1" />
                    Aguardando processamento
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          {/* Descrição */}
          <p className="text-gray-600 leading-relaxed text-sm">
            {description}
          </p>
          
          {/* Botão de ação */}
          <div className="pt-2">
            <Button
              onClick={onClick}
              disabled={disabled || isLoading}
              className={`
                w-full h-10 font-medium transition-all duration-200
                ${disabled 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-sm'
                }
              `}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Carregando...</span>
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

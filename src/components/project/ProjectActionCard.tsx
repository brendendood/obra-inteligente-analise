
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

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
        border border-gray-200 bg-white hover:shadow-md hover:border-gray-300 transition-all duration-200
        ${disabled ? 'opacity-50' : ''}
        ${className}
      `}
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Icon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {title}
              </h3>
              {disabled && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  Aguardando processamento
                </span>
              )}
            </div>
          </div>
          
          <p className="text-gray-600 leading-relaxed">
            {description}
          </p>
          
          <Button
            onClick={onClick}
            disabled={disabled || isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              'Acessar'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectActionCard;

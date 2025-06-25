
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
        cursor-pointer transition-all duration-300 
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] hover:shadow-xl'}
        ${className}
      `}
      onClick={disabled ? undefined : onClick}
    >
      <CardContent className="p-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50">
              <Icon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
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
          
          {isLoading && (
            <div className="flex items-center justify-center pt-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectActionCard;

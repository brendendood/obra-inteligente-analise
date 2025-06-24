
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
        cursor-pointer transition-all duration-300 border-0 shadow-lg hover:shadow-xl
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
        ${className}
      `}
      onClick={disabled ? undefined : onClick}
    >
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-2xl">
            <Icon className="h-8 w-8 text-blue-600" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900">
              {title}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {description}
            </p>
          </div>
          
          {isLoading && (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectActionCard;

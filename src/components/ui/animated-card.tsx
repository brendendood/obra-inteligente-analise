
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: 'lift' | 'glow' | 'scale' | 'tilt';
  onClick?: () => void;
  gradient?: boolean;
}

export const AnimatedCard = ({ 
  children, 
  className, 
  hoverEffect = 'lift',
  onClick,
  gradient = false
}: AnimatedCardProps) => {
  const hoverEffects = {
    lift: 'hover:shadow-xl hover:-translate-y-1',
    glow: 'hover:shadow-2xl hover:shadow-blue-500/25',
    scale: 'hover:scale-105',
    tilt: 'hover:rotate-1'
  };

  return (
    <Card
      className={cn(
        "transition-all duration-300 cursor-pointer border-0 shadow-md",
        hoverEffects[hoverEffect],
        gradient && "bg-gradient-to-br from-white to-gray-50",
        className
      )}
      onClick={onClick}
    >
      {children}
    </Card>
  );
};

interface AnimatedProjectCardProps {
  project: {
    id: string;
    name: string;
    total_area?: number;
    created_at: string;
    analysis_data?: any;
  };
  onClick: () => void;
}

export const AnimatedProjectCard = ({ project, onClick }: AnimatedProjectCardProps) => {
  return (
    <AnimatedCard
      hoverEffect="lift"
      gradient
      onClick={onClick}
      className="group"
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
            {project.name}
          </h3>
          <div className={cn(
            "w-2 h-2 rounded-full transition-colors",
            project.analysis_data ? "bg-green-500" : "bg-yellow-500"
          )} />
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-2">
          {project.total_area && (
            <p className="text-sm text-gray-600">
              Área: {project.total_area.toFixed(0)}m²
            </p>
          )}
          <p className="text-xs text-gray-500">
            {new Date(project.created_at).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </CardContent>
    </AnimatedCard>
  );
};

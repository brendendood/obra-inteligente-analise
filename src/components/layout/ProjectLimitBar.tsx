import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Crown } from 'lucide-react';

interface ProjectLimitBarProps {
  currentProjects: number;
  plan: 'free' | 'basic' | 'pro' | 'enterprise';
}

export const ProjectLimitBar = ({ currentProjects, plan }: ProjectLimitBarProps) => {
  // Enterprise tem projetos ilimitados
  if (plan === 'enterprise') {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">
            Projetos: {currentProjects}
          </span>
          <Badge variant="default" className="text-xs bg-gradient-to-r from-purple-500 to-purple-600">
            <Crown className="h-3 w-3 mr-1" />
            Enterprise
          </Badge>
        </div>
        <div className="text-xs text-slate-500">
          ✨ Projetos ilimitados
        </div>
      </div>
    );
  }

  const maxProjects = plan === 'free' ? 3 : plan === 'basic' ? 10 : 50;
  const percentage = (currentProjects / maxProjects) * 100;
  const isAtLimit = currentProjects >= maxProjects;

  const getPlanName = () => {
    switch (plan) {
      case 'free': return 'Free';
      case 'basic': return 'Basic';
      case 'pro': return 'Pro';
      default: return 'Basic';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-600 dark:text-slate-400">
          Projetos: {currentProjects}/{maxProjects}
        </span>
        <Badge 
          variant={plan === 'pro' ? 'default' : 'secondary'} 
          className="text-xs"
        >
          {plan === 'pro' && <Crown className="h-3 w-3 mr-1" />}
          {getPlanName()}
        </Badge>
      </div>
      
      <Progress 
        value={percentage} 
        className={`h-2 ${isAtLimit ? 'bg-red-100' : 'bg-slate-100'}`}
      />
      
      {isAtLimit && (
        <p className="text-xs text-red-600 dark:text-red-400">
          Limite atingido. Exclua projetos existentes para criar novos.
        </p>
      )}
    </div>
  );
};
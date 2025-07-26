
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Crown, Gift } from 'lucide-react';
import { getPlanDisplayName, getPlanLimit, getPlanIcon, getPlanBadgeStyle } from '@/utils/planUtils';
import { useState } from 'react';
import { GamificationModal } from '@/components/gamification/GamificationModal';

interface ProjectLimitBarProps {
  currentProjects: number;
  plan: 'free' | 'basic' | 'pro' | 'enterprise';
}

export const ProjectLimitBar = ({ currentProjects, plan }: ProjectLimitBarProps) => {
  const [showGamificationModal, setShowGamificationModal] = useState(false);
  const maxProjects = getPlanLimit(plan);
  const planDisplayName = getPlanDisplayName(plan);
  const planIcon = getPlanIcon(plan);
  const badgeStyle = getPlanBadgeStyle(plan);

  // Enterprise tem projetos ilimitados
  if (plan === 'enterprise') {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">
            Projetos: {currentProjects}
          </span>
          <Badge variant="default" className={badgeStyle}>
            <Crown className="h-3 w-3 mr-1" />
            {planDisplayName}
          </Badge>
        </div>
        <div className="text-xs text-slate-500">
          ✨ Projetos ilimitados
        </div>
        <button
          onClick={() => setShowGamificationModal(true)}
          className="text-xs text-primary hover:text-primary/80 transition-colors mt-2 flex items-center gap-1"
        >
          <Gift className="h-3 w-3" />
          Indique e ganhe projetos grátis
        </button>
      </div>
    );
  }

  const percentage = (currentProjects / maxProjects) * 100;
  const isAtLimit = currentProjects >= maxProjects;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-600 dark:text-slate-400">
          Projetos: {currentProjects}/{maxProjects}
        </span>
        <Badge 
          variant={plan === 'pro' ? 'default' : 'secondary'} 
          className={`text-xs ${badgeStyle}`}
        >
          {plan === 'pro' && <Crown className="h-3 w-3 mr-1" />}
          <span className="mr-1">{planIcon}</span>
          {planDisplayName}
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
      
      <button
        onClick={() => setShowGamificationModal(true)}
        className="text-xs text-primary hover:text-primary/80 transition-colors mt-2 flex items-center gap-1 w-full"
      >
        <Gift className="h-3 w-3" />
        Indique e ganhe projetos grátis
      </button>
      
      <GamificationModal 
        isOpen={showGamificationModal} 
        onClose={() => setShowGamificationModal(false)} 
      />
    </div>
  );
};

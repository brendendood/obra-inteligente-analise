
import { Button } from '@/components/ui/button';
import { Crown } from 'lucide-react';
import { useUserData } from '@/hooks/useUserData';
import { PlanBadge } from '@/components/ui/PlanBadge';
import { renderProjectQuota, canShowUpgradeButton } from '@/utils/planQuota';

export const PlanTab = () => {
  const { userData } = useUserData();

  const getPlanDisplayName = (plan: string) => {
    switch (plan) {
      case 'basic': return 'Basic';
      case 'pro': return 'Pro';
      case 'enterprise': return 'Enterprise';
      default: return 'Basic';
    }
  };

  const getPlanDescription = (plan: string) => {
    switch (plan) {
      case 'basic': return 'Você está no plano Basic do MadeAI';
      case 'pro': return 'Você está no plano Pro do MadeAI';
      case 'enterprise': return 'Você está no plano Enterprise do MadeAI';
      default: return 'Você está no plano Basic do MadeAI';
    }
  };

  const getPlanLimit = (plan: string) => {
    switch (plan) {
      case 'basic': return 'Até 5 projetos';
      case 'pro': return 'Até 20 projetos';
      case 'enterprise': return 'Projetos ilimitados';
      default: return 'Até 5 projetos';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Crown className="h-12 w-12 text-yellow-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold flex items-center justify-center gap-2">
            Plano Atual: <PlanBadge planCode={userData.plan} />
          </h3>
          <p className="text-gray-600">
            {getPlanDescription(userData.plan)}
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          Projetos: {renderProjectQuota(userData.plan, userData.projectCount)}
        </div>
      </div>

      {canShowUpgradeButton(userData.plan) && (
        <div className="border rounded-lg p-6 space-y-4">
          <h4 className="font-semibold text-blue-600">Melhorar Plano</h4>
          <p className="text-sm text-gray-600">
            Desbloqueie recursos premium como projetos ilimitados, análises avançadas e suporte prioritário.
          </p>
          <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">
            <Crown className="h-4 w-4 mr-2" />
            Upgrade
          </Button>
        </div>
      )}
    </div>
  );
};

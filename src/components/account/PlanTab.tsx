
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown } from 'lucide-react';
import { useUserData } from '@/hooks/useUserData';

export const PlanTab = () => {
  const { userData } = useUserData();

  const getPlanDisplayName = (plan: string) => {
    switch (plan) {
      case 'free': return 'Free';
      case 'basic': return 'Basic';
      case 'pro': return 'Pro';
      case 'enterprise': return 'Enterprise';
      default: return 'Free';
    }
  };

  const getPlanDescription = (plan: string) => {
    switch (plan) {
      case 'free': return 'Você está no plano Free do MadenAI';
      case 'basic': return 'Você está no plano Basic do MadenAI';
      case 'pro': return 'Você está no plano Pro do MadenAI';
      case 'enterprise': return 'Você está no plano Enterprise do MadenAI';
      default: return 'Você está no plano Free do MadenAI';
    }
  };

  const getPlanLimit = (plan: string) => {
    switch (plan) {
      case 'free': return 'Até 2 projetos';
      case 'basic': return 'Até 5 projetos';
      case 'pro': return 'Até 25 projetos';
      case 'enterprise': return 'Projetos ilimitados';
      default: return 'Até 2 projetos';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Crown className="h-12 w-12 text-yellow-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">
            Plano Atual: {getPlanDisplayName(userData.plan)}
          </h3>
          <p className="text-gray-600">
            {getPlanDescription(userData.plan)}
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {getPlanLimit(userData.plan)}
        </Badge>
      </div>

      {userData.plan !== 'enterprise' && (
        <div className="border rounded-lg p-6 space-y-4">
          <h4 className="font-semibold text-blue-600">Melhorar Plano</h4>
          <p className="text-sm text-gray-600">
            Desbloqueie recursos premium como projetos ilimitados, análises avançadas e suporte prioritário.
          </p>
          <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">
            <Crown className="h-4 w-4 mr-2" />
            {userData.plan === 'free' ? 'Upgrade para Basic' : 
             userData.plan === 'basic' ? 'Upgrade para Pro' : 
             'Upgrade para Enterprise'}
          </Button>
        </div>
      )}
    </div>
  );
};


import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown } from 'lucide-react';

export const PlanTab = () => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Crown className="h-12 w-12 text-yellow-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Plano Atual: Gratuito</h3>
          <p className="text-gray-600">Você está no plano gratuito do MadenAI</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          Até 3 projetos por mês
        </Badge>
      </div>

      <div className="border rounded-lg p-6 space-y-4">
        <h4 className="font-semibold text-blue-600">Melhorar Plano</h4>
        <p className="text-sm text-gray-600">
          Desbloqueie recursos premium como projetos ilimitados, análises avançadas e suporte prioritário.
        </p>
        <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">
          <Crown className="h-4 w-4 mr-2" />
          Upgrade para Premium
        </Button>
      </div>
    </div>
  );
};

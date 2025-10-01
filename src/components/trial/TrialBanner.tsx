import { AlertCircle, Sparkles } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useAccount } from '@/hooks/useAccount';
import { useNavigate } from 'react-router-dom';

export const TrialBanner = () => {
  const { account, isTrialActive, getTrialDaysRemaining } = useAccount();
  const navigate = useNavigate();

  if (!account || !isTrialActive()) return null;

  const daysRemaining = getTrialDaysRemaining();

  return (
    <Alert className="border-warning bg-warning/10">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between w-full">
        <span className="flex-1">
          Você está no <strong>Teste Grátis ({daysRemaining} {daysRemaining === 1 ? 'dia' : 'dias'} restantes)</strong>. 
          Apenas ORÇAMENTO está liberado e você pode enviar 1 projeto. Faça upgrade para manter sua conta ativa.
        </span>
        <Button
          size="sm"
          onClick={() => navigate('/selecionar-plano')}
          className="ml-4"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Fazer Upgrade
        </Button>
      </AlertDescription>
    </Alert>
  );
};

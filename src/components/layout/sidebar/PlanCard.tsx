
import { Crown, ExternalLink, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '@/hooks/useUserData';

interface PlanCardProps {
  isCollapsed: boolean;
  onUpgrade: () => void;
}

export const PlanCard = ({ isCollapsed, onUpgrade }: PlanCardProps) => {
  const navigate = useNavigate();
  const { userData } = useUserData();

  if (isCollapsed) {
    return (
      <div className="px-2 pb-4">
        <Button
          variant="ghost"
          size="sm"
          className="w-full h-12 p-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 dark:border-blue-800 transition-all duration-200"
          onClick={() => navigate('/plano')}
        >
          <Crown className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </Button>
      </div>
    );
  }

  const getPlanDisplayName = () => {
    switch (userData.plan) {
      case 'basic': return 'Basic';
      case 'pro': return 'Pro';
      case 'enterprise': return 'Enterprise';
      default: return 'Basic';
    }
  };

  const getPlanColor = () => {
    switch (userData.plan) {
      case 'pro': return 'from-blue-500 to-blue-600';
      case 'enterprise': return 'from-purple-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getUpgradeTarget = () => {
    switch (userData.plan) {
      case 'basic': return 'Pro';
      case 'pro': return 'Enterprise';
      default: return 'Pro';
    }
  };

  return (
    <div className="px-4 pb-4">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800 transition-all duration-200 hover:shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-1 rounded-md bg-gradient-to-r ${getPlanColor()}`}>
              <Crown className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">
              Plano {getPlanDisplayName()}
            </span>
          </div>
          <div className="text-xs text-blue-700 dark:text-blue-300">
            {userData.projectCount}/
            {userData.plan === 'basic' ? '10' : userData.plan === 'pro' ? '50' : '∞'}
          </div>
        </div>
        
        {userData.plan !== 'enterprise' && (
          <>
            <p className="text-xs text-blue-700 dark:text-blue-300 mb-3">
              Upgrade para {getUpgradeTarget()} e desbloqueie recursos premium
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full h-8 text-xs bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700 transition-all duration-200 hover:shadow-sm"
              onClick={() => navigate('/plano')}
            >
              <Zap className="h-3 w-3 mr-1" />
              Upgrade para {getUpgradeTarget()}
            </Button>
          </>
        )}
        
        {userData.plan === 'enterprise' && (
          <div className="text-center">
            <p className="text-xs text-blue-700 dark:text-blue-300 mb-2">
              ✨ Você tem o plano completo!
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full h-8 text-xs bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700 transition-all duration-200"
              onClick={() => navigate('/plano')}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Gerenciar Plano
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

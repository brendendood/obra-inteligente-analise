
import { Crown, ExternalLink, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '@/hooks/useUserData';
import { useUserProfile } from '@/hooks/useUserProfile';
import { AvatarDisplay } from '@/components/account/AvatarDisplay';
import { getPlanDisplayName, getPlanLimit, getNextPlan, canUpgrade } from '@/utils/planUtils';

interface PlanCardProps {
  isCollapsed: boolean;
  onUpgrade: () => void;
}


export const PlanCard = ({ isCollapsed, onUpgrade }: PlanCardProps) => {
  const navigate = useNavigate();
  const { userData } = useUserData();
  const { profileData } = useUserProfile();

  if (isCollapsed) {
    return (
      <div className="px-2 pb-4">
        <div className="flex flex-col items-center space-y-2">
          <AvatarDisplay size="sm" />
          <Button
            variant="ghost"
            size="sm"
            className="w-full h-8 p-1 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 dark:border-blue-800 transition-all duration-200"
            onClick={() => navigate('/plano')}
          >
            <Crown className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </Button>
        </div>
      </div>
    );
  }

  const planDisplayName = getPlanDisplayName(userData.plan);
  const basePlanLimit = getPlanLimit(userData.plan, 0);
  const totalLimit = getPlanLimit(userData.plan, userData.credits);
  const nextPlan = getNextPlan(userData.plan);
  const userCanUpgrade = canUpgrade(userData.plan);

  return (
    <div className="px-4 pb-4">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800 transition-all duration-200 hover:shadow-md">
        {/* User Avatar and Info */}
        <div className="flex items-center gap-3 mb-3">
          <AvatarDisplay size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100 truncate">
              {profileData.full_name || 'Usuário'}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-gradient-to-r from-blue-400 to-blue-500">
              <Crown className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">
              Plano {planDisplayName}
            </span>
          </div>
          <div className="text-xs text-blue-700 dark:text-blue-300">
            {userData.projectCount}/{totalLimit === 999 ? '∞' : totalLimit}
            {userData.credits > 0 && (
              <div className="text-xs text-green-600 dark:text-green-400">
                +{userData.credits} extras
              </div>
            )}
          </div>
        </div>
        
        {userCanUpgrade && nextPlan && (
          <>
             <p className="text-xs text-blue-700 dark:text-blue-300 mb-3">
               Faça upgrade e desbloqueie recursos premium
             </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full h-8 text-xs bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700 transition-all duration-200 hover:shadow-sm"
              onClick={() => navigate('/plano')}
            >
              <Zap className="h-3 w-3 mr-1" />
              Upgrade
            </Button>
          </>
        )}
        
        {!userCanUpgrade && (
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

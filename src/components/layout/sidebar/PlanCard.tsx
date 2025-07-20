
import { Crown, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PlanCardProps {
  isCollapsed: boolean;
  onUpgrade: () => void;
}

export const PlanCard = ({ isCollapsed, onUpgrade }: PlanCardProps) => {
  if (isCollapsed) return null;

  return (
    <div className="px-4 pb-4">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
        <div className="flex items-center mb-2">
          <Crown className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
          <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
            Plano Basic
          </span>
        </div>
        <p className="text-xs text-blue-700 dark:text-blue-300 mb-3">
          Upgrade para desbloquear mais recursos
        </p>
        <Button
          variant="outline"
          size="sm"
          className="w-full h-8 text-xs bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700 transition-colors"
          onClick={onUpgrade}
        >
          <ExternalLink className="h-3 w-3 mr-1" />
          Upgrade to Pro
        </Button>
      </div>
    </div>
  );
};

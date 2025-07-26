import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Sparkles } from 'lucide-react';
import { Achievement } from '@/hooks/useGamification';

interface AchievementUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievement: Achievement | null;
  pointsAwarded?: number;
}

export const AchievementUnlockModal = ({ 
  isOpen, 
  onClose, 
  achievement, 
  pointsAwarded = 0 
}: AchievementUnlockModalProps) => {
  if (!achievement) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-4 relative">
            <Trophy className="h-8 w-8 text-white" />
            <Sparkles className="h-4 w-4 text-yellow-200 absolute -top-1 -right-1 animate-pulse" />
            <Sparkles className="h-3 w-3 text-yellow-200 absolute -bottom-1 -left-1 animate-pulse delay-300" />
          </div>
          
          <DialogTitle className="text-xl font-bold gradient-text">
            Conquista Desbloqueada!
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-4">
          <div className="text-4xl">{achievement.icon}</div>
          
          <div>
            <h3 className="text-lg font-semibold">{achievement.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {achievement.description}
            </p>
          </div>
          
          {pointsAwarded > 0 && (
            <Badge variant="secondary" className="text-sm">
              +{pointsAwarded} XP
            </Badge>
          )}
          
          <Button onClick={onClose} className="w-full">
            Continuar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
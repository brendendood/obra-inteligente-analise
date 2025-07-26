import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Gift, Trophy, Flame, Target, Users } from 'lucide-react';
import { useGamification } from '@/hooks/useGamification';
import { useReferralSystem } from '@/hooks/useReferralSystem';
import { Skeleton } from '@/components/ui/skeleton';

interface GamificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GamificationModal({ isOpen, onClose }: GamificationModalProps) {
  const { 
    gamificationData, 
    levelInfo, 
    achievements, 
    isLoading: gamificationLoading 
  } = useGamification();
  
  const { 
    referralLink, 
    referralCount, 
    copyReferralLink, 
    getCreditsCount, 
    isLoading: referralLoading 
  } = useReferralSystem();

  const isLoading = gamificationLoading || referralLoading;

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Sistema de Gamificação
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const levelProgress = levelInfo && gamificationData 
    ? ((gamificationData.total_points - levelInfo.min_points) / (levelInfo.max_points - levelInfo.min_points)) * 100
    : 0;
    
  const pointsToNext = levelInfo && gamificationData 
    ? levelInfo.max_points - gamificationData.total_points
    : 0;
    
  const nextAchievement = achievements?.find(a => 
    !gamificationData?.achievements?.includes(a.code)
  );
  
  const creditsCount = getCreditsCount();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Sistema de Gamificação
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Nível e Progresso */}
          <div className="text-center space-y-3">
            <div className="text-3xl">
              {levelInfo?.icon || '🎓'}
            </div>
            <div>
              <h3 className="font-semibold text-lg">
                {levelInfo?.name || 'Estagiário'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {gamificationData?.total_points || 0} XP total
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso</span>
                <span>{pointsToNext > 0 ? `+${pointsToNext} para próximo nível` : 'Nível máximo!'}</span>
              </div>
              <Progress value={levelProgress} className="h-2" />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="space-y-1">
              <div className="flex items-center justify-center">
                <Flame className="h-4 w-4 text-orange-500" />
              </div>
              <div className="text-sm font-medium">
                {gamificationData?.daily_streak || 0}
              </div>
              <div className="text-xs text-muted-foreground">
                Streak
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-center">
                <Gift className="h-4 w-4 text-primary" />
              </div>
              <div className="text-sm font-medium">
                {creditsCount}
              </div>
              <div className="text-xs text-muted-foreground">
                Créditos
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-center">
                <Users className="h-4 w-4 text-green-500" />
              </div>
              <div className="text-sm font-medium">
                {referralCount}
              </div>
              <div className="text-xs text-muted-foreground">
                Indicações
              </div>
            </div>
          </div>

          {/* Próxima Conquista */}
          {nextAchievement && (
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Próxima Conquista</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">{nextAchievement.icon}</span>
                <div>
                  <div className="text-sm font-medium">{nextAchievement.name}</div>
                  <div className="text-xs text-muted-foreground">{nextAchievement.description}</div>
                </div>
              </div>
            </div>
          )}

          {/* Sistema de Referral */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Gift className="h-4 w-4 text-primary" />
              <h4 className="font-medium">Indique e Ganhe!</h4>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Compartilhe este link e ganhe 5 créditos quando seu amigo criar o primeiro projeto:
              </p>
              
              <div className="flex gap-2">
                <div className="flex-1 p-2 bg-muted rounded border text-xs font-mono truncate">
                  {referralLink}
                </div>
                <Button
                  onClick={copyReferralLink}
                  size="sm"
                  variant="outline"
                  className="px-3"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex items-center gap-1">
                <span>•</span>
                <span>Você ganha 5 créditos quando alguém criar o primeiro projeto</span>
              </div>
              <div className="flex items-center gap-1">
                <span>•</span>
                <span>Novo usuário também ganha 5 créditos</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
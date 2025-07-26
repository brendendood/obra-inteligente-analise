import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Coins, Flame, Trophy, Target } from 'lucide-react';
import { useGamification } from '@/hooks/useGamification';
import { useReferralSystem } from '@/hooks/useReferralSystem';
import { Skeleton } from '@/components/ui/skeleton';

export const GamificationSidebarCard = () => {
  const { 
    gamificationData, 
    levelInfo, 
    isLoading: gamLoading, 
    getLevelProgress, 
    getPointsToNextLevel,
    getNextAchievement 
  } = useGamification();
  
  const { 
    referralLink, 
    referralCount, 
    isLoading: refLoading, 
    copyReferralLink, 
    getCreditsCount 
  } = useReferralSystem();

  const isLoading = gamLoading || refLoading;

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  const levelProgress = getLevelProgress();
  const pointsToNext = getPointsToNextLevel();
  const nextAchievement = getNextAchievement();
  const creditsCount = getCreditsCount();

  return (
    <Card className="border-0 shadow-sm bg-gradient-to-br from-primary/5 to-accent/5">
      <CardHeader className="pb-2 pt-3 px-3">
        <CardTitle className="flex items-center space-x-1.5 text-xs font-semibold">
          <Trophy className="h-3.5 w-3.5 text-primary" />
          <span>Gamificação</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-2.5 text-xs px-3 pb-3">
        {/* Level Section */}
        {levelInfo && gamificationData && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1">
                <span className="text-sm">{levelInfo.icon}</span>
                <span className="font-medium text-xs">{levelInfo.name}</span>
              </span>
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5 h-5">
                {gamificationData.total_points} XP
              </Badge>
            </div>
            
            <div className="space-y-1">
              <Progress value={levelProgress} className="h-1.5" />
              {pointsToNext > 0 && (
                <div className="text-xs text-muted-foreground text-center">
                  +{pointsToNext} para próximo nível
                </div>
              )}
            </div>
          </div>
        )}

        {/* Compact Info Row */}
        <div className="flex items-center justify-between text-xs">
          {gamificationData && gamificationData.daily_streak > 0 && (
            <div className="flex items-center space-x-1 bg-orange-50 dark:bg-orange-950/20 px-2 py-1 rounded">
              <Flame className="h-3 w-3 text-orange-500" />
              <span className="font-medium">{gamificationData.daily_streak}d</span>
            </div>
          )}
          
          <div className="flex items-center space-x-1 bg-yellow-50 dark:bg-yellow-950/20 px-2 py-1 rounded">
            <Coins className="h-3 w-3 text-yellow-500" />
            <span className="font-bold text-yellow-600">{creditsCount}</span>
          </div>
        </div>

        {/* Referral Section - Compact */}
        <div className="space-y-1.5 pt-1.5 border-t border-border/30">
          <div className="flex items-center justify-between">
            <span className="font-medium text-xs">📢 Indique e ganhe!</span>
            {referralCount > 0 && (
              <span className="text-xs text-muted-foreground">
                {referralCount} indicações
              </span>
            )}
          </div>
          
          <div className="flex space-x-1">
            <div className="flex-1 min-w-0 p-1 bg-muted rounded text-xs truncate">
              {referralLink}
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={copyReferralLink}
              className="h-6 w-6 p-0 flex-shrink-0"
            >
              <Copy className="h-2.5 w-2.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
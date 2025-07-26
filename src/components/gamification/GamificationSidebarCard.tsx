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
    <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-accent/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-sm font-semibold">
          <Trophy className="h-4 w-4 text-primary" />
          <span>Gamificação</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 text-xs">
        {/* Level Section */}
        {levelInfo && gamificationData && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1">
                <span className="text-lg">{levelInfo.icon}</span>
                <span className="font-medium">{levelInfo.name}</span>
              </span>
              <Badge variant="secondary" className="text-xs">
                {gamificationData.total_points} XP
              </Badge>
            </div>
            
            <div className="space-y-1">
              <Progress value={levelProgress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{gamificationData.total_points} XP</span>
                {pointsToNext > 0 && <span>+{pointsToNext} para próximo nível</span>}
              </div>
            </div>
          </div>
        )}

        {/* Streak Section */}
        {gamificationData && gamificationData.daily_streak > 0 && (
          <div className="flex items-center space-x-2 p-2 bg-primary/10 rounded-lg">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="font-medium">Streak: {gamificationData.daily_streak} dias</span>
          </div>
        )}

        {/* Next Achievement */}
        {nextAchievement && (
          <div className="flex items-center space-x-2 p-2 bg-accent/10 rounded-lg">
            <Target className="h-4 w-4 text-accent" />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{nextAchievement.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {nextAchievement.description}
              </p>
            </div>
          </div>
        )}

        {/* Referral Section */}
        <div className="space-y-3 pt-2 border-t border-border/50">
          <div className="flex items-center justify-between">
            <span className="font-medium text-xs">📢 Indique e ganhe!</span>
            <div className="flex items-center space-x-1">
              <Coins className="h-3 w-3 text-yellow-500" />
              <span className="font-bold text-yellow-600">{creditsCount}</span>
            </div>
          </div>
          
          <div className="flex space-x-1">
            <div className="flex-1 min-w-0 p-1 bg-muted rounded text-xs truncate">
              {referralLink}
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={copyReferralLink}
              className="h-7 w-7 p-0 flex-shrink-0"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
          
          {referralCount > 0 && (
            <p className="text-xs text-muted-foreground">
              🤝 {referralCount} indicações realizadas
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
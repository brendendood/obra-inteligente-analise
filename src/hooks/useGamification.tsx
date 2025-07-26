import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface GamificationData {
  id: string;
  user_id: string;
  total_points: number;
  current_level: number;
  daily_streak: number;
  last_action_date: string;
  last_login_date: string;
  achievements: any;
  created_at: string;
  updated_at: string;
}

export interface LevelInfo {
  name: string;
  min_points: number;
  max_points: number;
  icon: string;
}

export interface Achievement {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  points_required: number;
  action_count_required: number;
  action_type: string;
  is_active: boolean;
}

export function useGamification() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [gamificationData, setGamificationData] = useState<GamificationData | null>(null);
  const [levelInfo, setLevelInfo] = useState<LevelInfo | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGamificationData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Fetch user gamification data
      const { data: gamData, error: gamError } = await supabase
        .from('user_gamification')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (gamError && gamError.code !== 'PGRST116') {
        console.error('Error fetching gamification data:', gamError);
        return;
      }

      // If no gamification data exists, create initial record
      if (!gamData) {
        const { data: newGamData, error: createError } = await supabase
          .from('user_gamification')
          .insert({
            user_id: user.id,
            total_points: 0,
            current_level: 1,
            daily_streak: 0,
            achievements: []
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating gamification data:', createError);
          return;
        }
        
        setGamificationData(newGamData as GamificationData);
      } else {
        setGamificationData(gamData as GamificationData);
      }

      // Fetch level info for current level
      if (gamData?.current_level) {
        const { data: levelData, error: levelError } = await supabase
          .rpc('get_level_info', { level_num: gamData.current_level });

        if (!levelError && levelData) {
          setLevelInfo(levelData as unknown as LevelInfo);
        }
      }

      // Fetch all achievements
      const { data: achievementsData, error: achievementsError } = await supabase
        .from('achievements')
        .select('*')
        .eq('is_active', true)
        .order('points_required', { ascending: true });

      if (!achievementsError && achievementsData) {
        setAchievements(achievementsData);
      }

    } catch (error) {
      console.error('Error in fetchGamificationData:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const awardPoints = async (points: number, actionType: string, details: any = {}) => {
    if (!user) return;

    try {
      const { error } = await supabase.rpc('award_points', {
        target_user_id: user.id,
        points: points,
        action_type: actionType,
        details: details
      });

      if (error) {
        console.error('Error awarding points:', error);
        return;
      }

      // Refresh gamification data
      await fetchGamificationData();

      // Show toast notification
      toast({
        title: `+${points} XP`,
        description: `Você ganhou ${points} pontos por ${actionType}!`,
        duration: 3000,
      });

    } catch (error) {
      console.error('Error in awardPoints:', error);
    }
  };

  const getLevelProgress = () => {
    if (!gamificationData || !levelInfo) return 0;
    
    const currentPoints = gamificationData.total_points;
    const minPoints = levelInfo.min_points;
    const maxPoints = levelInfo.max_points;
    
    if (maxPoints === 999999) return 100; // Max level
    
    return Math.round(((currentPoints - minPoints) / (maxPoints - minPoints)) * 100);
  };

  const getPointsToNextLevel = () => {
    if (!gamificationData || !levelInfo) return 0;
    
    if (levelInfo.max_points === 999999) return 0; // Max level
    
    return levelInfo.max_points - gamificationData.total_points;
  };

  const getUserAchievements = () => {
    if (!gamificationData) return [];
    const userAchievements = Array.isArray(gamificationData.achievements) 
      ? gamificationData.achievements 
      : [];
    return achievements.filter(achievement => 
      userAchievements.includes(achievement.code)
    );
  };

  const getNextAchievement = () => {
    if (!gamificationData) return null;
    
    const unlockedAchievements = Array.isArray(gamificationData.achievements) 
      ? gamificationData.achievements 
      : [];
    const nextAchievement = achievements.find(achievement => 
      !unlockedAchievements.includes(achievement.code)
    );
    
    return nextAchievement || null;
  };

  useEffect(() => {
    if (user) {
      fetchGamificationData();
    }
  }, [user]);

  return {
    gamificationData,
    levelInfo,
    achievements,
    isLoading,
    awardPoints,
    getLevelProgress,
    getPointsToNextLevel,
    getUserAchievements,
    getNextAchievement,
    refetch: fetchGamificationData
  };
}
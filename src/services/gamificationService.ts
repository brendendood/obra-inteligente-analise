import { supabase } from '@/integrations/supabase/client';

export interface GamificationAction {
  type: 'project_created' | 'ai_used' | 'budget_generated' | 'schedule_created' | 'daily_login' | 'file_uploaded';
  points: number;
  details?: Record<string, any>;
}

export const GAMIFICATION_ACTIONS: Record<string, GamificationAction> = {
  PROJECT_CREATED: {
    type: 'project_created',
    points: 100,
    details: { description: 'Primeiro projeto criado' }
  },
  AI_USED: {
    type: 'ai_used',
    points: 10,
    details: { description: 'Interação com IA' }
  },
  BUDGET_GENERATED: {
    type: 'budget_generated',
    points: 25,
    details: { description: 'Orçamento gerado' }
  },
  SCHEDULE_CREATED: {
    type: 'schedule_created',
    points: 25,
    details: { description: 'Cronograma criado' }
  },
  DAILY_LOGIN: {
    type: 'daily_login',
    points: 5,
    details: { description: 'Login diário' }
  },
  FILE_UPLOADED: {
    type: 'file_uploaded',
    points: 50,
    details: { description: 'Arquivo enviado' }
  }
};

class GamificationService {
  async trackAction(userId: string, actionKey: keyof typeof GAMIFICATION_ACTIONS, additionalDetails?: Record<string, any>) {
    try {
      const action = GAMIFICATION_ACTIONS[actionKey];
      if (!action) {
        console.warn(`Unknown gamification action: ${actionKey}`);
        return;
      }

      const details = {
        ...action.details,
        ...additionalDetails,
        timestamp: new Date().toISOString()
      };

      // Award points using the database function
      const { error } = await supabase.rpc('award_points', {
        target_user_id: userId,
        points: action.points,
        action_type: action.type,
        details: details
      });

      if (error) {
        console.error('Error tracking gamification action:', error);
        return;
      }

      console.log(`🎮 GAMIFICATION: ${actionKey} tracked for user ${userId} (+${action.points} points)`);
      
      return { success: true, points: action.points };
    } catch (error) {
      console.error('Error in trackAction:', error);
      return { success: false, error };
    }
  }

  async updateDailyStreak(userId: string) {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Get current gamification data
      const { data: gamData, error: gamError } = await supabase
        .from('user_gamification')
        .select('daily_streak, last_login_date')
        .eq('user_id', userId)
        .single();

      if (gamError) {
        console.error('Error fetching gamification data for streak:', gamError);
        return;
      }

      const lastLogin = gamData?.last_login_date;
      const currentStreak = gamData?.daily_streak || 0;
      
      // Check if this is a new day
      if (lastLogin !== today) {
        let newStreak = 1;
        
        // If logged in yesterday, increment streak
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        if (lastLogin === yesterdayStr) {
          newStreak = currentStreak + 1;
        }
        
        // Update streak and last login date
        const { error: updateError } = await supabase
          .from('user_gamification')
          .update({
            daily_streak: newStreak,
            last_login_date: today
          })
          .eq('user_id', userId);

        if (updateError) {
          console.error('Error updating daily streak:', updateError);
          return;
        }

        // Award streak bonus points
        if (newStreak >= 7 && newStreak % 7 === 0) {
          await this.trackAction(userId, 'DAILY_LOGIN', { 
            streak_bonus: true, 
            streak_count: newStreak,
            bonus_points: 50
          });
        } else {
          await this.trackAction(userId, 'DAILY_LOGIN', { 
            streak_count: newStreak 
          });
        }

        console.log(`🔥 STREAK: User ${userId} now has ${newStreak} day streak`);
        return newStreak;
      }

      return currentStreak;
    } catch (error) {
      console.error('Error in updateDailyStreak:', error);
    }
  }

  async checkAchievements(userId: string) {
    try {
      // This would check for achievement unlocks based on user actions
      // For now, we'll implement basic achievement checking
      
      const { data: userStats, error: statsError } = await supabase
        .from('gamification_logs')
        .select('action_type')
        .eq('user_id', userId);

      if (statsError) {
        console.error('Error fetching user stats for achievements:', statsError);
        return;
      }

      // Count actions by type
      const actionCounts = userStats.reduce((acc, log) => {
        acc[log.action_type] = (acc[log.action_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Check for specific achievements
      const achievements = [];

      if (actionCounts['project_created'] >= 1) {
        achievements.push('first_project');
      }
      
      if (actionCounts['ai_used'] >= 50) {
        achievements.push('ai_expert');
      }
      
      if (actionCounts['budget_generated'] >= 10) {
        achievements.push('budget_master');
      }
      
      if (actionCounts['schedule_created'] >= 10) {
        achievements.push('scheduler');
      }

      // Update user achievements
      if (achievements.length > 0) {
        const { data: currentData, error: fetchError } = await supabase
          .from('user_gamification')
          .select('achievements')
          .eq('user_id', userId)
          .single();

        if (!fetchError && currentData) {
          const currentAchievements = Array.isArray(currentData.achievements) 
            ? currentData.achievements 
            : [];
          const newAchievements = achievements.filter(ach => !currentAchievements.includes(ach));
          
          if (newAchievements.length > 0) {
            const updatedAchievements = [...currentAchievements, ...newAchievements];
            
            const { error: updateError } = await supabase
              .from('user_gamification')
              .update({ achievements: updatedAchievements })
              .eq('user_id', userId);

            if (!updateError) {
              console.log(`🏆 ACHIEVEMENTS: ${newAchievements.join(', ')} unlocked for user ${userId}`);
              return newAchievements;
            }
          }
        }
      }

      return [];
    } catch (error) {
      console.error('Error in checkAchievements:', error);
      return [];
    }
  }
}

export const gamificationService = new GamificationService();

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useDefaultAvatar } from '@/hooks/useDefaultAvatar';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface UserProfileCardProps {
  isCollapsed: boolean;
  onClick?: () => void;
}

export const UserProfileCard = ({ isCollapsed, onClick }: UserProfileCardProps) => {
  const { user } = useAuth();
  const { getDefaultAvatarUrl, getAvatarFallback } = useDefaultAvatar();
  
  // Estado para dados do perfil
  const [profileData, setProfileData] = useState({
    full_name: '',
    avatar_url: '',
    gender: 'neutral'
  });

  // Carregar dados do perfil
  useEffect(() => {
    if (user?.id) {
      loadUserProfile();
    }
  }, [user?.id]);

  const loadUserProfile = async () => {
    if (!user?.id) return;

    try {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('full_name, avatar_url, gender')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        setProfileData({
          full_name: profile.full_name || 'Usuário',
          avatar_url: profile.avatar_url || getDefaultAvatarUrl(profile.gender),
          gender: profile.gender || 'neutral'
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
      <div 
        className={cn(
          "flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer",
          isCollapsed && "justify-center"
        )}
        onClick={onClick}
        title={isCollapsed ? profileData.full_name : undefined}
      >
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={profileData.avatar_url} />
          <AvatarFallback className="bg-blue-600 text-white text-xs">
            {getAvatarFallback(profileData.gender)}
          </AvatarFallback>
        </Avatar>
        {!isCollapsed && (
          <div className="ml-3 min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {profileData.full_name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};


import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface UserProfileCardProps {
  isCollapsed: boolean;
  onClick?: () => void;
}

export const UserProfileCard = ({ isCollapsed, onClick }: UserProfileCardProps) => {
  const { user } = useAuth();
  
  // Estado para dados do perfil
  const [profileData, setProfileData] = useState({
    full_name: '',
    initials: ''
  });

  // Função para gerar iniciais
  const getInitials = (fullName: string): string => {
    if (!fullName) return user?.email?.charAt(0)?.toUpperCase() || '?';
    
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    
    const firstName = names[0].charAt(0).toUpperCase();
    const lastName = names[names.length - 1].charAt(0).toUpperCase();
    return `${firstName}${lastName}`;
  };

  // Carregar dados do perfil
  useEffect(() => {
    if (user?.id) {
      loadUserProfile();
    }
  }, [user?.id]);

  // Escutar eventos de atualização de perfil
  useEffect(() => {
    const handleProfileUpdate = () => {
      loadUserProfile();
    };

    window.addEventListener('profile-updated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('profile-updated', handleProfileUpdate);
    };
  }, []);

  const loadUserProfile = async () => {
    if (!user?.id) return;

    try {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('full_name')
        .eq('user_id', user.id)
        .maybeSingle();

      const fullName = profile?.full_name || user?.user_metadata?.full_name || 'Usuário';
      setProfileData({
        full_name: fullName,
        initials: getInitials(fullName)
      });
    } catch (error) {
      console.error('Error loading user profile:', error);
      setProfileData({
        full_name: 'Usuário',
        initials: getInitials('')
      });
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
          <AvatarFallback className="bg-blue-600 text-white text-xs font-medium">
            {profileData.initials}
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

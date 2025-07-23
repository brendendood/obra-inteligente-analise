
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useDefaultAvatar } from '@/hooks/useDefaultAvatar';

export interface UserProfileData {
  full_name: string;
  company: string;
  cargo: string;
  empresa: string;
  phone: string;
  state: string;
  country: string;
  profilePicture: string;
  gender: string;
  avatar_type: string;
}

export const useUserProfile = () => {
  const { user, isAuthenticated } = useAuth();
  const { getDefaultAvatarUrl } = useDefaultAvatar();
  const [profileData, setProfileData] = useState<UserProfileData>({
    full_name: '',
    company: '',
    cargo: '',
    empresa: '',
    phone: '',
    state: '',
    country: 'Brasil',
    profilePicture: '',
    gender: 'neutral',
    avatar_type: 'emoji'
  });
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    if (!isAuthenticated || !user?.id) {
      setLoading(false);
      return;
    }

    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
        setLoading(false);
        return;
      }

      if (profile) {
        setProfileData({
          full_name: profile.full_name || '',
          company: profile.company || '',
          cargo: profile.cargo || '',
          empresa: profile.empresa || '',
          phone: profile.phone || '',
          state: profile.state || '',
          country: profile.country || 'Brasil',
          profilePicture: profile.avatar_url || getDefaultAvatarUrl(profile.gender),
          gender: profile.gender || 'neutral',
          avatar_type: profile.avatar_type || 'emoji'
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [user?.id, isAuthenticated]);

  // Listen for avatar updates
  useEffect(() => {
    const handleAvatarUpdate = () => {
      loadProfile();
    };

    window.addEventListener('avatar-updated', handleAvatarUpdate);
    return () => {
      window.removeEventListener('avatar-updated', handleAvatarUpdate);
    };
  }, []);

  return {
    profileData,
    loading,
    refetch: loadProfile
  };
};

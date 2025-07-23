
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
  const { getAvatarUrl } = useDefaultAvatar();
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
      console.log('⚠️ User not authenticated, resetting profile data');
      setProfileData({
        full_name: '',
        company: '',
        cargo: '',
        empresa: '',
        phone: '',
        state: '',
        country: 'Brasil',
        profilePicture: getAvatarUrl('', user?.email),
        gender: 'neutral',
        avatar_type: 'emoji'
      });
      setLoading(false);
      return;
    }

    try {
      console.log('🔍 Loading profile for user:', user.id);
      
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      console.log('📋 Profile query result:', { profile, error });

      if (error) {
        console.error('❌ Error loading profile:', error);
        setLoading(false);
        return;
      }

      if (profile) {
        // Always generate initials avatar regardless of stored avatar_url
        const fullName = profile.full_name || user?.user_metadata?.full_name || '';
        const profilePicture = getAvatarUrl(fullName, user?.email);
        console.log('🖼️ Setting profile picture with initials for:', fullName);
        
        setProfileData({
          full_name: profile.full_name || '',
          company: profile.company || '',
          cargo: profile.cargo || '',
          empresa: profile.empresa || '',
          phone: profile.phone || '',
          state: profile.state || '',
          country: profile.country || 'Brasil',
          profilePicture,
          gender: profile.gender || 'neutral',
          avatar_type: 'initials'
        });
      } else {
        console.log('🚫 No profile found, using defaults with user metadata');
        const fullName = user?.user_metadata?.full_name || '';
        const profilePicture = getAvatarUrl(fullName, user?.email);
        setProfileData({
          full_name: fullName,
          company: '',
          cargo: '',
          empresa: '',
          phone: '',
          state: '',
          country: 'Brasil',
          profilePicture,
          gender: 'neutral',
          avatar_type: 'initials'
        });
      }
    } catch (error) {
      console.error('💥 Critical error loading user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [user?.id, isAuthenticated]);

  // Listen for avatar updates with improved handling
  useEffect(() => {
    const handleAvatarUpdate = () => {
      console.log('🔄 Avatar update event received, reloading profile...');
      setTimeout(() => {
        loadProfile();
      }, 500); // Small delay to ensure DB is updated
    };

    window.addEventListener('avatar-updated', handleAvatarUpdate);
    return () => {
      window.removeEventListener('avatar-updated', handleAvatarUpdate);
    };
  }, [user?.id, isAuthenticated]);

  return {
    profileData,
    loading,
    refetch: loadProfile
  };
};

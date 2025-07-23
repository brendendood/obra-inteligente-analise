import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useDefaultAvatar } from '@/hooks/useDefaultAvatar';

interface AvatarDisplayProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AvatarDisplay = ({ 
  size = 'md', 
  className = ''
}: AvatarDisplayProps) => {
  const { user } = useAuth();
  const { getAvatarUrl, getInitials } = useDefaultAvatar();
  const [avatarUrl, setAvatarUrl] = useState('');
  const [initials, setInitials] = useState('');

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10', 
    lg: 'h-16 w-16'
  };

  // Carregar dados do usuário
  const loadUserAvatar = async () => {
    if (!user?.id) return;

    try {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('full_name')
        .eq('user_id', user.id)
        .maybeSingle();

      const fullName = profile?.full_name || user?.user_metadata?.full_name || '';
      const generatedAvatarUrl = getAvatarUrl(fullName, user?.email);
      const userInitials = getInitials(fullName || user?.email || '');
      
      setAvatarUrl(generatedAvatarUrl);
      setInitials(userInitials);
    } catch (error) {
      console.error('Error loading user profile:', error);
      const fallbackInitials = getInitials(user?.email || '');
      setInitials(fallbackInitials);
      setAvatarUrl(getAvatarUrl('', user?.email));
    }
  };

  useEffect(() => {
    loadUserAvatar();
  }, [user?.id]);

  // Escutar eventos de atualização de perfil
  useEffect(() => {
    const handleProfileUpdate = () => {
      console.log('🔄 Profile updated, refreshing avatar');
      loadUserAvatar();
    };

    window.addEventListener('profile-updated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('profile-updated', handleProfileUpdate);
    };
  }, []);

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      <AvatarImage src={avatarUrl} />
      <AvatarFallback className="bg-blue-600 text-white font-medium">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};
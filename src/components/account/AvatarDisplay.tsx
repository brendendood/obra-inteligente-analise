import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface AvatarDisplayProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AvatarDisplay = ({ 
  size = 'md', 
  className = ''
}: AvatarDisplayProps) => {
  const { user } = useAuth();
  const [initials, setInitials] = useState('');

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10', 
    lg: 'h-16 w-16'
  };

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

  // Carregar iniciais do usuário
  const loadUserInitials = async () => {
    if (!user?.id) return;

    try {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('full_name')
        .eq('user_id', user.id)
        .maybeSingle();

      const fullName = profile?.full_name || user?.user_metadata?.full_name || '';
      setInitials(getInitials(fullName));
    } catch (error) {
      console.error('Error loading user profile:', error);
      setInitials(getInitials(''));
    }
  };

  useEffect(() => {
    loadUserInitials();
  }, [user?.id]);

  // Escutar eventos de atualização de perfil
  useEffect(() => {
    const handleProfileUpdate = () => {
      console.log('🔄 Profile updated, refreshing initials');
      loadUserInitials();
    };

    window.addEventListener('profile-updated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('profile-updated', handleProfileUpdate);
    };
  }, []);

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      <AvatarFallback className="bg-blue-600 text-white font-medium">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};
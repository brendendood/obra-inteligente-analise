import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useDefaultAvatar } from '@/hooks/useDefaultAvatar';

interface AvatarDisplayProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showFallback?: boolean;
}

export const AvatarDisplay = ({ 
  size = 'md', 
  className = '',
  showFallback = true 
}: AvatarDisplayProps) => {
  const { user } = useAuth();
  const { getDefaultAvatarUrl } = useDefaultAvatar();
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [imageKey, setImageKey] = useState(0); // Força re-render da imagem

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10', 
    lg: 'h-16 w-16'
  };

  // Carregar avatar inicial
  useEffect(() => {
    if (user?.user_metadata?.avatar_url) {
      const url = user.user_metadata.avatar_url;
      // Adicionar timestamp para quebrar cache
      const finalUrl = url.includes('?') ? url : `${url}?t=${Date.now()}`;
      setAvatarUrl(finalUrl);
    } else {
      setAvatarUrl(getDefaultAvatarUrl(user?.user_metadata?.gender || 'neutral'));
    }
  }, [user, getDefaultAvatarUrl]);

  // Escutar eventos de atualização de avatar
  useEffect(() => {
    const handleAvatarUpdate = (event: CustomEvent) => {
      console.log('🎯 AvatarDisplay received avatar update:', event.detail);
      const newUrl = event.detail.avatarUrl;
      
      // Forçar cache-busting
      const urlWithTimestamp = newUrl.includes('?') ? newUrl : `${newUrl}?t=${Date.now()}`;
      setAvatarUrl(urlWithTimestamp);
      
      // Forçar re-render da imagem
      setImageKey(prev => prev + 1);
    };

    window.addEventListener('avatar-updated', handleAvatarUpdate as EventListener);
    
    return () => {
      window.removeEventListener('avatar-updated', handleAvatarUpdate as EventListener);
    };
  }, []);

  const handleImageError = () => {
    console.log('🚫 Avatar image failed to load, using fallback');
    setAvatarUrl(getDefaultAvatarUrl(user?.user_metadata?.gender || 'neutral'));
  };

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      <AvatarImage 
        key={imageKey} // Força re-render quando key muda
        src={avatarUrl} 
        alt="Avatar do usuário"
        onError={handleImageError}
        onLoad={() => console.log('✅ Avatar image loaded successfully:', avatarUrl)}
      />
      {showFallback && (
        <AvatarFallback className="text-sm font-medium">
          {user?.user_metadata?.full_name?.charAt(0)?.toUpperCase() || 
           user?.email?.charAt(0)?.toUpperCase() || 
           '?'}
        </AvatarFallback>
      )}
    </Avatar>
  );
};
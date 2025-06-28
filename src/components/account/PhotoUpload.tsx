
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useDefaultAvatar } from '@/hooks/useDefaultAvatar';

interface PhotoUploadProps {
  onPhotoUpdate: (newPhotoUrl: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const DEFAULT_AVATARS = {
  male: {
    emoji: '👨‍💼',
    label: 'Avatar Masculino'
  },
  female: {
    emoji: '👩‍💼',
    label: 'Avatar Feminino'
  },
  neutral: {
    emoji: '🤖',
    label: 'Avatar Neutro'
  }
};

export const PhotoUpload = ({ onPhotoUpdate, isLoading, setIsLoading }: PhotoUploadProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showAvatars, setShowAvatars] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const { getEmojiAsSvg } = useDefaultAvatar();

  const currentAvatar = user?.user_metadata?.avatar_url || '';
  const userGender = user?.user_metadata?.gender || 'neutral';

  const handleAvatarSelect = async (emoji: string) => {
    if (!user) return;

    setIsLoading(true);
    const avatarUrl = getEmojiAsSvg(emoji);
    setSelectedAvatar(emoji);
    
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { error } = await supabase.auth.updateUser({
        data: {
          ...user.user_metadata,
          avatar_url: avatarUrl
        }
      });

      if (error) throw error;

      onPhotoUpdate(avatarUrl);
      setShowAvatars(false);

      toast({
        title: "✅ Avatar atualizado",
        description: "Seu avatar foi alterado com sucesso.",
      });
    } catch (error) {
      console.error('Error updating avatar:', error);
      toast({
        title: "❌ Erro",
        description: "Não foi possível atualizar o avatar. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setSelectedAvatar(null);
    }
  };

  const getEmojiAsSvg = (emoji: string) => {
    const svg = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="70" font-size="70" text-anchor="middle" x="50">${emoji}</text></svg>`;
    return svg;
  };

  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setShowAvatars(!showAvatars)}
        disabled={isLoading}
      >
        {isLoading ? 'Salvando...' : 'Trocar Avatar'}
      </Button>

      {showAvatars && (
        <div className="border rounded-lg p-4 space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Escolha seu avatar fofo:</h4>
          <div className="flex gap-4 justify-center">
            {Object.entries(DEFAULT_AVATARS).map(([key, avatar]) => {
              const avatarUrl = getEmojiAsSvg(avatar.emoji);
              return (
                <button
                  key={key}
                  onClick={() => handleAvatarSelect(avatar.emoji)}
                  disabled={isLoading}
                  className="relative group flex flex-col items-center space-y-2"
                >
                  <div className="h-16 w-16 border-2 border-gray-200 group-hover:border-blue-400 transition-colors rounded-full flex items-center justify-center bg-white text-4xl">
                    {avatar.emoji}
                  </div>
                  
                  <span className="text-xs text-gray-600">{avatar.label}</span>
                  
                  {/* Indicador de seleção */}
                  {currentAvatar === avatarUrl && (
                    <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                  
                  {/* Loading para o avatar sendo selecionado */}
                  {selectedAvatar === avatar.emoji && isLoading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowAvatars(false)}
            className="w-full"
          >
            Cancelar
          </Button>
        </div>
      )}

      <p className="text-xs text-gray-500">
        Avatares fofos para seu perfil profissional.
      </p>
    </div>
  );
};

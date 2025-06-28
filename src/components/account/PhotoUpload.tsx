
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface PhotoUploadProps {
  onPhotoUpdate: (newPhotoUrl: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const DEFAULT_AVATARS = {
  male: {
    url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    label: 'Avatar Masculino'
  },
  female: {
    url: 'https://images.unsplash.com/photo-1494790108755-2616c047c7e1?w=150&h=150&fit=crop&crop=face',
    label: 'Avatar Feminino'
  },
  neutral: {
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    label: 'Avatar Neutro'
  }
};

export const PhotoUpload = ({ onPhotoUpdate, isLoading, setIsLoading }: PhotoUploadProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showAvatars, setShowAvatars] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  const currentAvatar = user?.user_metadata?.avatar_url || '';
  const userGender = user?.user_metadata?.gender || 'neutral';

  const handleAvatarSelect = async (avatarUrl: string) => {
    if (!user) return;

    setIsLoading(true);
    setSelectedAvatar(avatarUrl);
    
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
          <h4 className="text-sm font-medium text-gray-700">Escolha seu avatar:</h4>
          <div className="flex gap-4 justify-center">
            {Object.entries(DEFAULT_AVATARS).map(([key, avatar]) => (
              <button
                key={key}
                onClick={() => handleAvatarSelect(avatar.url)}
                disabled={isLoading}
                className="relative group flex flex-col items-center space-y-2"
              >
                <Avatar className="h-16 w-16 border-2 border-gray-200 group-hover:border-blue-400 transition-colors">
                  <AvatarImage src={avatar.url} />
                  <AvatarFallback className="bg-gray-100">
                    {key.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <span className="text-xs text-gray-600">{avatar.label}</span>
                
                {/* Indicador de seleção */}
                {currentAvatar === avatar.url && (
                  <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
                
                {/* Loading para o avatar sendo selecionado */}
                {selectedAvatar === avatar.url && isLoading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </button>
            ))}
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
        Escolha entre os avatares disponíveis baseados no seu perfil.
      </p>
    </div>
  );
};

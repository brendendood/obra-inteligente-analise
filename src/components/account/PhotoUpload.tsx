
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

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1501286353178-1ec881214838?w=150&h=150&fit=crop&crop=face',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=6'
];

export const PhotoUpload = ({ onPhotoUpdate, isLoading, setIsLoading }: PhotoUploadProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showAvatars, setShowAvatars] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  const currentAvatar = user?.user_metadata?.avatar_url || '';

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
        {isLoading ? 'Salvando...' : 'Escolher Avatar'}
      </Button>

      {showAvatars && (
        <div className="border rounded-lg p-4 space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Escolha seu avatar:</h4>
          <div className="grid grid-cols-5 gap-3">
            {PRESET_AVATARS.map((avatarUrl, index) => (
              <button
                key={index}
                onClick={() => handleAvatarSelect(avatarUrl)}
                disabled={isLoading}
                className="relative group"
              >
                <Avatar className="h-12 w-12 border-2 border-gray-200 group-hover:border-blue-400 transition-colors">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="bg-gray-100">
                    {index + 1}
                  </AvatarFallback>
                </Avatar>
                
                {/* Indicador de seleção */}
                {currentAvatar === avatarUrl && (
                  <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
                
                {/* Loading para o avatar sendo selecionado */}
                {selectedAvatar === avatarUrl && isLoading && (
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
        Escolha um dos avatares disponíveis para personalizar seu perfil.
      </p>
    </div>
  );
};

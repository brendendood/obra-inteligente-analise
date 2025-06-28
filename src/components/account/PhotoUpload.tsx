
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
  // Arquitetura moderna e profissional
  'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1496307653780-42ee777d4833?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1431576901776-e539bd916ba2?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1460574283810-2aab119d8511?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1439337153520-7082a56a81f4?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1497604401993-f2e922e5cb0a?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494891848038-7bd202a2afeb?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1551038247-3d9af20df552?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1524230572899-a752b3835840?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1433832597046-4f10e10ac764?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1493397212122-2b85dda8106b?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1466442929976-97f336a657be?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1492321936769-b49830bc1d1e?w=150&h=150&fit=crop&crop=face'
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
          <div className="grid grid-cols-4 gap-3 max-h-64 overflow-y-auto">
            {PRESET_AVATARS.map((avatarUrl, index) => (
              <button
                key={index}
                onClick={() => handleAvatarSelect(avatarUrl)}
                disabled={isLoading}
                className="relative group"
              >
                <Avatar className="h-16 w-16 border-2 border-gray-200 group-hover:border-blue-400 transition-colors">
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
        Escolha um dos avatares de arquitetura e construção para personalizar seu perfil.
      </p>
    </div>
  );
};

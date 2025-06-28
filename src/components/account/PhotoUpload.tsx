
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
  // Arquitetos e engenheiros homens
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150&h=150&fit=crop&crop=face',
  
  // Arquitetas e engenheiras mulheres
  'https://images.unsplash.com/photo-1494790108755-2616c047c7e1?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
  
  // Construtores e operários
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1613486881559-aaa4eb63b1d3?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=150&h=150&fit=crop&crop=face'
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

      // Forçar atualização do contexto
      onPhotoUpdate(avatarUrl);
      setShowAvatars(false);

      // Recarregar a página para garantir que o avatar seja atualizado em todos os componentes
      setTimeout(() => {
        window.location.reload();
      }, 500);

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
          <h4 className="text-sm font-medium text-gray-700">Escolha seu avatar profissional:</h4>
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
        Escolha um avatar profissional de arquitetos, engenheiros e construtores.
      </p>
    </div>
  );
};

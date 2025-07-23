import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, Upload, Image, FileText } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useDefaultAvatar } from '@/hooks/useDefaultAvatar';
import { supabase } from '@/integrations/supabase/client';

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
  const [uploadMode, setUploadMode] = useState<'emoji' | 'file'>('emoji');
  const { getEmojiAsSvg } = useDefaultAvatar();

  const currentAvatar = user?.user_metadata?.avatar_url || '';
  const userGender = user?.user_metadata?.gender || 'neutral';

  // Função para redimensionar imagem
  const resizeImage = useCallback((file: File, maxSizeKB: number = 300): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new window.Image();
      
      img.onload = () => {
        // Calcular dimensões mantendo aspect ratio
        let { width, height } = img;
        const maxDimension = 400; // pixels
        
        if (width > height) {
          if (width > maxDimension) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Desenhar imagem redimensionada
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Converter para blob com qualidade ajustada
        canvas.toBlob((blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          }
        }, file.type, 0.8); // Qualidade 80%
      };
      
      img.src = URL.createObjectURL(file);
    });
  }, []);

  // Upload de arquivo
  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "❌ Arquivo não suportado",
        description: "Apenas JPG, PNG, PDF e HEIC são permitidos.",
        variant: "destructive"
      });
      return;
    }

    // Validar tamanho (300KB)
    if (file.size > 307200) {
      // Tentar redimensionar se for imagem
      if (file.type.startsWith('image/')) {
        try {
          const resizedFile = await resizeImage(file);
          if (resizedFile.size > 307200) {
            toast({
              title: "❌ Arquivo muito grande",
              description: "O arquivo deve ter no máximo 300KB.",
              variant: "destructive"
            });
            return;
          }
          await uploadToStorage(resizedFile);
        } catch (error) {
          toast({
            title: "❌ Erro ao redimensionar",
            description: "Não foi possível redimensionar a imagem.",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "❌ Arquivo muito grande",
          description: "O arquivo deve ter no máximo 300KB.",
          variant: "destructive"
        });
      }
      return;
    }

    await uploadToStorage(file);
  }, [user, toast, resizeImage]);

  // Upload para o storage
  const uploadToStorage = async (file: File) => {
    if (!user) return;
    
    setIsLoading(true);
    console.log('📤 Starting file upload for user:', user.id);
    
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${fileExt}`;
      console.log('📁 Upload path:', filePath);
      
      // Upload do arquivo
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error('❌ Storage upload error:', uploadError);
        throw uploadError;
      }

      console.log('✅ File uploaded successfully');

      // Obter URL pública
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      console.log('🔗 Public URL generated:', data.publicUrl);

      // Atualizar perfil do usuário
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ 
          avatar_url: data.publicUrl,
          avatar_type: 'uploaded'
        })
        .eq('user_id', user.id);

      console.log('💾 Profile update result:', { updateError });

      if (updateError) {
        console.error('❌ Profile update error:', updateError);
        throw updateError;
      }

      console.log('✅ Profile updated successfully');

      onPhotoUpdate(data.publicUrl);
      setShowAvatars(false);

      toast({
        title: "✅ Foto atualizada",
        description: "Sua foto de perfil foi alterada com sucesso.",
      });

      // Forçar refresh dos componentes que usam o avatar
      window.dispatchEvent(new CustomEvent('avatar-updated'));
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "❌ Erro no upload",
        description: "Não foi possível fazer upload da foto.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarSelect = async (emoji: string) => {
    if (!user) return;

    setIsLoading(true);
    const avatarUrl = getEmojiAsSvg(emoji);
    setSelectedAvatar(emoji);
    
    try {
      // Atualizar no user_profiles (fonte primária)
      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          avatar_url: avatarUrl,
          avatar_type: 'emoji'
        })
        .eq('user_id', user.id);

      if (error) throw error;

      onPhotoUpdate(avatarUrl);
      setShowAvatars(false);

      toast({
        title: "✅ Avatar atualizado",
        description: "Seu avatar foi alterado com sucesso.",
      });

      // Forçar refresh dos componentes que usam o avatar
      window.dispatchEvent(new CustomEvent('avatar-updated'));
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
      <div className="flex gap-2">
        <Button 
          variant={uploadMode === 'emoji' ? 'default' : 'outline'}
          size="sm" 
          onClick={() => {
            setUploadMode('emoji');
            setShowAvatars(!showAvatars);
          }}
          disabled={isLoading}
        >
          <Image className="h-4 w-4 mr-2" />
          {isLoading && uploadMode === 'emoji' ? 'Salvando...' : 'Emoji'}
        </Button>
        
        <Button 
          variant={uploadMode === 'file' ? 'default' : 'outline'}
          size="sm" 
          onClick={() => setUploadMode('file')}
          disabled={isLoading}
          className="relative"
        >
          <Upload className="h-4 w-4 mr-2" />
          {isLoading && uploadMode === 'file' ? 'Enviando...' : 'Upload'}
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/heic,application/pdf"
            onChange={handleFileUpload}
            className="absolute inset-0 opacity-0 cursor-pointer"
            disabled={isLoading}
          />
        </Button>
      </div>

      {/* Modo Emoji */}
      {showAvatars && uploadMode === 'emoji' && (
        <div className="border rounded-lg p-4 space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Escolha seu avatar:</h4>
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

      {/* Instruções */}
      <div className="text-xs text-gray-500 space-y-1">
        <p className="flex items-center gap-1">
          <FileText className="h-3 w-3" />
          Formatos: JPG, PNG, PDF, HEIC
        </p>
        <p>Tamanho máximo: 300KB (redimensionamento automático)</p>
      </div>
    </div>
  );
};

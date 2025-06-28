
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { PhotoUpload } from './PhotoUpload';
import { useDefaultAvatar } from '@/hooks/useDefaultAvatar';

interface ProfileTabProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const ProfileTab = ({ isLoading, setIsLoading }: ProfileTabProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { getDefaultAvatarUrl, getAvatarFallback } = useDefaultAvatar();
  
  const userGender = user?.user_metadata?.gender;
  const defaultAvatar = getDefaultAvatarUrl(userGender);
  
  const [profileData, setProfileData] = useState({
    fullName: '',
    cargo: '',
    empresa: '',
    profilePicture: defaultAvatar
  });

  // Carregar dados do usuário quando o componente é montado
  useEffect(() => {
    if (user?.user_metadata) {
      setProfileData({
        fullName: user.user_metadata.full_name || '',
        cargo: user.user_metadata.cargo || '',
        empresa: user.user_metadata.empresa || '',
        profilePicture: user.user_metadata.avatar_url || defaultAvatar
      });
    }
  }, [user, defaultAvatar]);

  const handleProfileUpdate = async () => {
    setIsLoading(true);
    const { supabase } = await import('@/integrations/supabase/client');
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: profileData.fullName,
          cargo: profileData.cargo,
          empresa: profileData.empresa,
          avatar_url: profileData.profilePicture,
          gender: userGender // Manter o gênero atual
        }
      });

      if (error) throw error;

      toast({
        title: "✅ Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "❌ Erro",
        description: "Não foi possível atualizar o perfil.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpdate = (newPhotoUrl: string) => {
    setProfileData(prev => ({ ...prev, profilePicture: newPhotoUrl }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={profileData.profilePicture} />
          <AvatarFallback className="bg-blue-600 text-white text-xl">
            {getAvatarFallback(userGender)}
          </AvatarFallback>
        </Avatar>
        <PhotoUpload 
          onPhotoUpdate={handlePhotoUpdate}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="fullName">Nome Completo</Label>
          <Input
            id="fullName"
            value={profileData.fullName}
            onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="cargo">Cargo</Label>
          <Input
            id="cargo"
            placeholder="Ex: Engenheiro Civil"
            value={profileData.cargo}
            onChange={(e) => setProfileData(prev => ({ ...prev, cargo: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="empresa">Empresa</Label>
          <Input
            id="empresa"
            placeholder="Ex: Construtora ABC Ltda"
            value={profileData.empresa}
            onChange={(e) => setProfileData(prev => ({ ...prev, empresa: e.target.value }))}
          />
        </div>

        <Button onClick={handleProfileUpdate} disabled={isLoading} className="w-full">
          {isLoading ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>
    </div>
  );
};


import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useDefaultAvatar } from '@/hooks/useDefaultAvatar';
import { supabase } from '@/integrations/supabase/client';
import { PhotoUpload } from './PhotoUpload';
import { GenderSelect } from './GenderSelect';
import { AvatarTestButton } from './AvatarTestButton';

interface ProfileTabProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const ProfileTab = ({ isLoading, setIsLoading }: ProfileTabProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { getDefaultAvatarUrl } = useDefaultAvatar();

  const [profileData, setProfileData] = useState({
    full_name: '',
    company: '',
    cargo: '',
    empresa: '',
    phone: '',
    state: '',
    country: 'Brasil',
    profilePicture: '',
    gender: 'neutral',
    avatar_type: 'emoji'
  });

  // Carregar dados do perfil ao montar o componente
  useEffect(() => {
    if (user?.id) {
      loadUserProfile();
    }
  }, [user?.id]);

  const loadUserProfile = async () => {
    if (!user?.id) return;

    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
        return;
      }

      if (profile) {
        setProfileData({
          full_name: profile.full_name || '',
          company: profile.company || '',
          cargo: profile.cargo || '',
          empresa: profile.empresa || '',
          phone: profile.phone || '',
          state: profile.state || '',
          country: profile.country || 'Brasil',
          profilePicture: profile.avatar_url || getDefaultAvatarUrl(profile.gender),
          gender: profile.gender || 'neutral',
          avatar_type: profile.avatar_type || 'emoji'
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const handleProfileUpdate = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          full_name: profileData.full_name,
          company: profileData.company,
          cargo: profileData.cargo,
          empresa: profileData.empresa,
          phone: profileData.phone,
          state: profileData.state,
          country: profileData.country,
          gender: profileData.gender,
          avatar_url: profileData.profilePicture,
          avatar_type: profileData.avatar_type,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast({
        title: "✅ Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });

      await loadUserProfile();
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: "❌ Erro ao salvar",
        description: "Não foi possível atualizar seu perfil. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpdate = (newPhotoUrl: string) => {
    console.log('🖼️ Photo updated in ProfileTab:', newPhotoUrl);
    setProfileData(prev => ({
      ...prev,
      profilePicture: newPhotoUrl,
      avatar_type: newPhotoUrl.includes('data:') ? 'emoji' : 'uploaded'
    }));
  };

  return (
    <div className="space-y-6">
      {/* Avatar/Foto */}
      <div className="text-center">
        <AvatarTestButton />
        <PhotoUpload
          onPhotoUpdate={handlePhotoUpdate}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      </div>

      {/* Informações Básicas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="full_name">Nome Completo *</Label>
          <Input
            id="full_name"
            value={profileData.full_name}
            onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
            placeholder="Seu nome completo"
          />
        </div>

        <div>
          <GenderSelect
            value={profileData.gender}
            onValueChange={(value) => setProfileData({...profileData, gender: value})}
          />
        </div>

        <div>
          <Label htmlFor="cargo">Cargo/Profissão</Label>
          <Input
            id="cargo"
            value={profileData.cargo}
            onChange={(e) => setProfileData({...profileData, cargo: e.target.value})}
            placeholder="Ex: Arquiteto, Engenheiro Civil"
          />
        </div>

        <div>
          <Label htmlFor="empresa">Empresa</Label>
          <Input
            id="empresa"
            value={profileData.empresa}
            onChange={(e) => setProfileData({...profileData, empresa: e.target.value})}
            placeholder="Nome da empresa onde trabalha"
          />
        </div>

        <div>
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            type="tel"
            value={profileData.phone}
            onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
            placeholder="(11) 99999-9999"
          />
        </div>

        <div>
          <Label htmlFor="state">Estado</Label>
          <Select value={profileData.state} onValueChange={(value) => setProfileData({...profileData, state: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AC">Acre</SelectItem>
              <SelectItem value="AL">Alagoas</SelectItem>
              <SelectItem value="AP">Amapá</SelectItem>
              <SelectItem value="AM">Amazonas</SelectItem>
              <SelectItem value="BA">Bahia</SelectItem>
              <SelectItem value="CE">Ceará</SelectItem>
              <SelectItem value="DF">Distrito Federal</SelectItem>
              <SelectItem value="ES">Espírito Santo</SelectItem>
              <SelectItem value="GO">Goiás</SelectItem>
              <SelectItem value="MA">Maranhão</SelectItem>
              <SelectItem value="MT">Mato Grosso</SelectItem>
              <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
              <SelectItem value="MG">Minas Gerais</SelectItem>
              <SelectItem value="PA">Pará</SelectItem>
              <SelectItem value="PB">Paraíba</SelectItem>
              <SelectItem value="PR">Paraná</SelectItem>
              <SelectItem value="PE">Pernambuco</SelectItem>
              <SelectItem value="PI">Piauí</SelectItem>
              <SelectItem value="RJ">Rio de Janeiro</SelectItem>
              <SelectItem value="RN">Rio Grande do Norte</SelectItem>
              <SelectItem value="RS">Rio Grande do Sul</SelectItem>
              <SelectItem value="RO">Rondônia</SelectItem>
              <SelectItem value="RR">Roraima</SelectItem>
              <SelectItem value="SC">Santa Catarina</SelectItem>
              <SelectItem value="SP">São Paulo</SelectItem>
              <SelectItem value="SE">Sergipe</SelectItem>
              <SelectItem value="TO">Tocantins</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="country">País</Label>
          <Input
            id="country"
            value={profileData.country}
            onChange={(e) => setProfileData({...profileData, country: e.target.value})}
            placeholder="Brasil"
          />
        </div>
      </div>

      {/* Botão Salvar */}
      <Button 
        onClick={handleProfileUpdate}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Salvando...
          </>
        ) : (
          'Salvar Alterações'
        )}
      </Button>
    </div>
  );
};

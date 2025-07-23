import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const AvatarTestButton = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const forceAvatarUpdate = async () => {
    if (!user?.id) return;

    try {
      // Forçar uma atualização no banco com timestamp
      const timestamp = Date.now();
      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          updated_at: new Date().toISOString(),
          avatar_url: `https://mozqijzvtbuwuzgemzsm.supabase.co/storage/v1/object/public/avatars/${user.id}/avatar.png?t=${timestamp}`
        })
        .eq('user_id', user.id);

      if (error) throw error;

      // Disparar evento de atualização
      console.log('🔥 Forcing avatar update event');
      window.dispatchEvent(new CustomEvent('avatar-updated', { 
        detail: { 
          avatarUrl: `https://mozqijzvtbuwuzgemzsm.supabase.co/storage/v1/object/public/avatars/${user.id}/avatar.png?t=${timestamp}`,
          timestamp 
        }
      }));

      toast({
        title: "🔄 Avatar forçadamente atualizado",
        description: "Evento de atualização disparado!",
      });

    } catch (error) {
      console.error('Error forcing avatar update:', error);
      toast({
        title: "❌ Erro",
        description: "Não foi possível forçar a atualização.",
        variant: "destructive"
      });
    }
  };

  return (
    <Button 
      onClick={forceAvatarUpdate}
      variant="outline"
      size="sm"
      className="mb-4"
    >
      🔄 Forçar Atualização do Avatar
    </Button>
  );
};
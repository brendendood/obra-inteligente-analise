
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { MyAccountDialog } from '@/components/account/MyAccountDialog';
import { useDefaultAvatar } from '@/hooks/useDefaultAvatar';

export const HeaderAuthActions = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showAccountDialog, setShowAccountDialog] = useState(false);
  const { getDefaultAvatar, getAvatarFallback } = useDefaultAvatar();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: "👋 Logout realizado",
        description: "Você foi desconectado com sucesso."
      });
      navigate('/');
    } catch (error) {
      console.error('Erro no logout:', error);
      toast({
        title: "❌ Erro no logout",
        description: "Não foi possível fazer logout.",
        variant: "destructive"
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center space-x-3">
        <Button 
          variant="outline" 
          onClick={() => navigate('/login')} 
          className="transition-all duration-200 hover:bg-slate-50"
        >
          Entrar
        </Button>
        <Button 
          onClick={() => navigate('/cadastro')} 
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Cadastrar
        </Button>
      </div>
    );
  }

  const userGender = user?.user_metadata?.gender;
  const avatarUrl = user?.user_metadata?.avatar_url || getDefaultAvatar(userGender);

  return (
    <>
      <button
        onClick={() => setShowAccountDialog(true)}
        className="flex items-center space-x-2 text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
      >
        <Avatar className="h-6 w-6">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback className="bg-blue-600 text-white text-xs">
            {getAvatarFallback(userGender)}
          </AvatarFallback>
        </Avatar>
        <span className="max-w-32 truncate">
          {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
        </span>
      </button>
      
      <Button 
        variant="outline" 
        onClick={handleLogout} 
        className="flex items-center space-x-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200"
      >
        <LogOut className="h-4 w-4" />
        <span>Sair</span>
      </Button>

      <MyAccountDialog
        isOpen={showAccountDialog}
        onClose={() => setShowAccountDialog(false)}
      />
    </>
  );
};

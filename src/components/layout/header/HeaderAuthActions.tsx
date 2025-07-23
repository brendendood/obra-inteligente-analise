
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { MyAccountDialog } from '@/components/account/MyAccountDialog';

export const HeaderAuthActions = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showAccountDialog, setShowAccountDialog] = useState(false);
  const [userInitials, setUserInitials] = useState('');

  // Função para gerar iniciais
  const getInitials = (fullName: string): string => {
    if (!fullName) return user?.email?.charAt(0)?.toUpperCase() || '?';
    
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    
    const firstName = names[0].charAt(0).toUpperCase();
    const lastName = names[names.length - 1].charAt(0).toUpperCase();
    return `${firstName}${lastName}`;
  };

  // Carregar iniciais do usuário
  useEffect(() => {
    if (user?.id) {
      loadUserInitials();
    }
  }, [user?.id]);

  // Escutar eventos de atualização de perfil
  useEffect(() => {
    const handleProfileUpdate = () => {
      loadUserInitials();
    };

    window.addEventListener('profile-updated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('profile-updated', handleProfileUpdate);
    };
  }, []);

  const loadUserInitials = async () => {
    if (!user?.id) return;

    try {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('full_name')
        .eq('user_id', user.id)
        .maybeSingle();

      const fullName = profile?.full_name || user?.user_metadata?.full_name || '';
      setUserInitials(getInitials(fullName));
    } catch (error) {
      console.error('Error loading user profile:', error);
      setUserInitials(getInitials(''));
    }
  };

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

  return (
    <>
      <button
        onClick={() => setShowAccountDialog(true)}
        className="flex items-center space-x-2 text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
      >
        <Avatar className="h-6 w-6">
          <AvatarFallback className="bg-blue-600 text-white text-xs font-medium">
            {userInitials}
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

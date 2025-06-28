
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { MyAccountDialog } from '@/components/account/MyAccountDialog';

interface HeaderMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HeaderMobileMenu = ({ isOpen, onClose }: HeaderMobileMenuProps) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showAccountDialog, setShowAccountDialog] = useState(false);

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

  if (!isOpen) return null;

  return (
    <>
      <div className="md:hidden border-t border-slate-200 py-4 animate-fade-in">
        <div className="space-y-2">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => {
                  setShowAccountDialog(true);
                  onClose();
                }}
                className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-slate-600 border-t border-slate-200 mt-2 pt-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-blue-600 text-white text-xs">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <span>
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                </span>
              </button>
              <Button 
                variant="outline" 
                onClick={() => {
                  handleLogout();
                  onClose();
                }} 
                className="w-full justify-start hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </>
          ) : (
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <Button 
                variant="outline" 
                onClick={() => {
                  navigate('/login');
                  onClose();
                }} 
                className="w-full justify-start transition-all duration-200"
              >
                Entrar
              </Button>
              <Button 
                onClick={() => {
                  navigate('/cadastro');
                  onClose();
                }} 
                className="w-full justify-start bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
              >
                Cadastrar
              </Button>
            </div>
          )}
        </div>
      </div>

      <MyAccountDialog
        isOpen={showAccountDialog}
        onClose={() => setShowAccountDialog(false)}
      />
    </>
  );
};

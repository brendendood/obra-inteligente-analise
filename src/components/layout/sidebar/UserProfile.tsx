
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { MyAccountDialog } from '@/components/account/MyAccountDialog';
import { useDefaultAvatar } from '@/hooks/useDefaultAvatar';
import { useContextualNavigation } from '@/hooks/useContextualNavigation';
import { useSidebar } from '@/components/ui/sidebar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';

export const UserProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { clearHistory } = useContextualNavigation();
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false);
  const { getDefaultAvatarUrl, getAvatarFallback } = useDefaultAvatar();
  const { open } = useSidebar();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      clearHistory();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      navigate('/');
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const userGender = user?.user_metadata?.gender;
  const avatarUrl = user?.user_metadata?.avatar_url || getDefaultAvatarUrl(userGender);

  if (!open) {
    // Estado colapsado - mostrar apenas avatar com dropdown
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full h-12 p-0 hover:bg-gray-100">
              <Avatar className="h-8 w-8">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="bg-blue-600 text-white text-xs">
                  {getAvatarFallback(userGender)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.user_metadata?.full_name || 'Usuário'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email}
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setIsAccountDialogOpen(true)}>
              <User className="h-4 w-4 mr-2" />
              Minha Conta
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Dialog Minha Conta */}
        <MyAccountDialog 
          isOpen={isAccountDialogOpen}
          onClose={() => setIsAccountDialogOpen(false)}
        />
      </>
    );
  }

  // Estado expandido - mostrar interface completa
  return (
    <>
      <div className="space-y-3">
        {/* Minha Conta */}
        <Button
          variant="outline"
          className="w-full justify-start h-10 text-blue-600 border-blue-200 hover:bg-blue-50"
          onClick={() => setIsAccountDialogOpen(true)}
        >
          <User className="h-4 w-4 mr-3" />
          Minha Conta
        </Button>

        {/* User Info */}
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
          <Avatar className="h-10 w-10">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="bg-blue-600 text-white">
              {getAvatarFallback(userGender)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">
              {user?.user_metadata?.full_name || 'Usuário'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email}
            </p>
          </div>
        </div>
        
        <Button
          variant="outline"
          className="w-full justify-start h-10 text-red-600 border-red-200 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sair
        </Button>
      </div>

      {/* Dialog Minha Conta */}
      <MyAccountDialog 
        isOpen={isAccountDialogOpen}
        onClose={() => setIsAccountDialogOpen(false)}
      />
    </>
  );
};

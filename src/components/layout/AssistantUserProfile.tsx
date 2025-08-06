import { User, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export const AssistantUserProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logout realizado com sucesso!');
      navigate('/');
    } catch (error) {
      console.error('Erro no logout:', error);
      toast.error('Erro ao fazer logout');
    }
  };

  const handleAccountClick = () => {
    navigate('/account');
  };

  if (!user) return null;

  return (
    <div className="border-t border-sidebar-border p-4 space-y-3">
      {/* User Info */}
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center">
          <User className="h-4 w-4 text-sidebar-accent-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-sidebar-foreground truncate">
            {user?.user_metadata?.full_name || user?.email}
          </p>
          <p className="text-xs text-sidebar-muted-foreground">
            Plano Gratuito
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-1">
        <button
          onClick={handleAccountClick}
          className={cn(
            "w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded-md transition-colors",
            "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          )}
        >
          <User className="h-3 w-3" />
          Minha Conta
        </button>
        
        <button
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded-md transition-colors",
            "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          )}
        >
          <LogOut className="h-3 w-3" />
          Sair
        </button>
      </div>
    </div>
  );
};
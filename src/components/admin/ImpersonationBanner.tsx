import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

interface ImpersonationBannerProps {
  impersonatedUser: {
    id: string;
    name: string;
    email: string;
  };
  sessionId: string;
  adminId: string;
}

export const ImpersonationBanner = ({ impersonatedUser, sessionId, adminId }: ImpersonationBannerProps) => {
  const [isEnding, setIsEnding] = useState(false);

  const handleEndImpersonation = async () => {
    setIsEnding(true);
    
    try {
      // End the impersonation session
      const { error } = await supabase.functions.invoke('admin-end-impersonation', {
        body: { sessionId }
      });

      if (error) {
        console.error('Error ending impersonation:', error);
        toast.error('Erro ao encerrar sessão de impersonação');
        return;
      }

      // Clear impersonation data from localStorage
      localStorage.removeItem('impersonation_data');
      
      // Sign out current user
      await supabase.auth.signOut();
      
      // Redirect to admin panel
      window.location.href = '/admin-panel';
      
      toast.success('Sessão de impersonação encerrada');
    } catch (error) {
      console.error('Error ending impersonation:', error);
      toast.error('Erro ao encerrar sessão de impersonação');
    } finally {
      setIsEnding(false);
    }
  };

  return (
    <div className="bg-warning/10 border-warning/20 border-b px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-warning-foreground">
              👀 Modo Admin - Logado como
            </span>
            <Badge variant="secondary" className="bg-warning/20 text-warning-foreground">
              {impersonatedUser.name} ({impersonatedUser.email})
            </Badge>
          </div>
        </div>
        
        <Button 
          variant="outline"
          size="sm"
          onClick={handleEndImpersonation}
          disabled={isEnding}
          className="border-warning/20 hover:bg-warning/10"
        >
          <LogOut className="h-4 w-4 mr-2" />
          {isEnding ? 'Encerrando...' : 'Sair do Modo Impersonado'}
        </Button>
      </div>
    </div>
  );
};
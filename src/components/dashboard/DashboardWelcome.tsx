
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { User } from '@supabase/supabase-js';

interface DashboardWelcomeProps {
  user: User;
  isAdmin: boolean;
}

const DashboardWelcome = ({ user, isAdmin }: DashboardWelcomeProps) => {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground dark:text-[#f2f2f2] mb-2">
            Bem-vindo, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}!
          </h1>
          <p className="text-muted-foreground dark:text-[#bbbbbb]">
            Gerencie seus projetos com inteligência artificial
          </p>
        </div>
        
        {isAdmin && (
          <Button 
            onClick={() => navigate('/admin')}
            className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 flex items-center space-x-2 text-white"
          >
            <Settings className="h-4 w-4" />
            <span>Painel Admin</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default DashboardWelcome;

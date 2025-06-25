
import { User } from '@supabase/supabase-js';

interface DashboardWelcomeProps {
  user: User;
}

const DashboardWelcome = ({ user }: DashboardWelcomeProps) => {
  const getCurrentTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold text-foreground">
        {getCurrentTime()}, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}!
      </h1>
      <p className="text-muted-foreground text-lg">
        Gerencie seus projetos com inteligência artificial
      </p>
      <div className="mt-4 p-3 bg-accent rounded-lg border border-border">
        <p className="text-sm text-foreground">
          📧 Logado como: <span className="text-primary font-medium">{user?.email}</span>
        </p>
      </div>
    </div>
  );
};

export default DashboardWelcome;

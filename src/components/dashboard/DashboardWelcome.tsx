
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
      <h1 className="text-3xl font-bold text-white">
        {getCurrentTime()}, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}!
      </h1>
      <p className="text-gray-400 text-lg">
        Gerencie seus projetos com inteligência artificial
      </p>
      <div className="mt-4 p-3 bg-[#1a1a1a] rounded-lg border border-[#333]">
        <p className="text-sm text-gray-300">
          📧 Logado como: <span className="text-blue-400">{user?.email}</span>
        </p>
      </div>
    </div>
  );
};

export default DashboardWelcome;

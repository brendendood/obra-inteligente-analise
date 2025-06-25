
import { RefreshCw, Zap } from 'lucide-react';

interface DashboardWelcomeHeaderProps {
  userName: string;
  greeting: string;
  onRefresh: () => void;
  isLoading: boolean;
}

const DashboardWelcomeHeader = ({ 
  userName, 
  greeting, 
  onRefresh, 
  isLoading 
}: DashboardWelcomeHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {greeting}, {userName}! 👋
            </h1>
            <p className="text-gray-600 text-lg">
              Bem-vindo ao MadenAI. Gerencie seus projetos com inteligência artificial.
            </p>
          </div>
        </div>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="text-blue-600 hover:text-blue-700 p-3 rounded-lg hover:bg-blue-50 transition-all duration-200 group disabled:opacity-50"
          title="Atualizar dados"
        >
          <RefreshCw className={`h-5 w-5 transition-transform duration-500 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180'}`} />
        </button>
      </div>
    </div>
  );
};

export default DashboardWelcomeHeader;

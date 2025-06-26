
import { WelcomeSection } from '@/components/dashboard/WelcomeSection';

interface DashboardWelcomeHeaderProps {
  userName: string;
  greeting: string;
  onRefresh: () => void;
  isLoading: boolean;
}

const DashboardWelcomeHeader = ({ userName, greeting, onRefresh, isLoading }: DashboardWelcomeHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8 shadow-lg border border-blue-100">
      <div className="mb-6">
        <WelcomeSection 
          userName={userName}
          onRefresh={onRefresh}
          isLoading={isLoading}
        />
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
            <span className="text-2xl">🚀</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{greeting}, {userName}!</h2>
            <p className="text-gray-600">Bem-vindo ao MadenAI. Gerencie seus projetos com inteligência artificial.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center space-x-2">
              <span className="text-green-600">📊</span>
              <span className="font-medium text-green-800">Análises Precisas</span>
            </div>
            <p className="text-sm text-green-700 mt-1">IA treinada para arquitetura</p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center space-x-2">
              <span className="text-purple-600">⚡</span>
              <span className="font-medium text-purple-800">Processamento Rápido</span>
            </div>
            <p className="text-sm text-purple-700 mt-1">Resultados em segundos</p>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center space-x-2">
              <span className="text-orange-600">🎯</span>
              <span className="font-medium text-orange-800">Dados Reais</span>
            </div>
            <p className="text-sm text-orange-700 mt-1">Baseado em projetos reais</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardWelcomeHeader;

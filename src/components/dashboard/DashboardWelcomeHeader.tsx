
import { WelcomeSection } from '@/components/dashboard/WelcomeSection';
import { QuoteRotator } from '@/components/dashboard/QuoteRotator';

interface DashboardWelcomeHeaderProps {
  userName: string;
  greeting: string;
  onRefresh: () => void;
  isLoading: boolean;
}

const DashboardWelcomeHeader = ({ userName, greeting, onRefresh, isLoading }: DashboardWelcomeHeaderProps) => {
  return (
    <div className="space-y-4">
      {/* Welcome Section - Layout limpo e funcional */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 shadow-sm border border-blue-100">
        <WelcomeSection 
          userName={userName}
          onRefresh={onRefresh}
          isLoading={isLoading}
        />
        
        {/* Features inline - melhor aproveitamento horizontal */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-green-100 flex items-center space-x-2">
            <span className="text-green-600">📊</span>
            <div>
              <span className="font-medium text-green-800 text-sm">Análises Precisas</span>
              <p className="text-xs text-green-700">IA especializada</p>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-purple-100 flex items-center space-x-2">
            <span className="text-purple-600">⚡</span>
            <div>
              <span className="font-medium text-purple-800 text-sm">Processamento Rápido</span>
              <p className="text-xs text-purple-700">Resultados instantâneos</p>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-orange-100 flex items-center space-x-2">
            <span className="text-orange-600">🎯</span>
            <div>
              <span className="font-medium text-orange-800 text-sm">Dados Reais</span>
              <p className="text-xs text-orange-700">Baseado em projetos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quote Section - Mais compacta */}
      <QuoteRotator />
    </div>
  );
};

export default DashboardWelcomeHeader;

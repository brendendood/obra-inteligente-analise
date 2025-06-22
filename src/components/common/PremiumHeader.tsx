
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PremiumHeaderProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  showBackButton?: boolean;
  actions?: React.ReactNode;
}

const PremiumHeader = ({ title, subtitle, icon, showBackButton = true, actions }: PremiumHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="hover:bg-slate-100 transition-colors duration-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            )}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
              {icon}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                {title}
              </h1>
              <p className="text-sm text-slate-600 font-medium hidden sm:block">{subtitle}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {actions}
            <div className="hidden md:flex items-center space-x-2 text-sm text-slate-600">
              <Shield className="h-4 w-4 text-blue-600" />
              <span>Seguro</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PremiumHeader;

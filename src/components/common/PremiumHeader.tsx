
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useContextualNavigation } from '@/hooks/useContextualNavigation';

interface PremiumHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: React.ReactNode;
  onBack?: () => void;
}

export const PremiumHeader = ({ title, subtitle, description, icon, onBack }: PremiumHeaderProps) => {
  const { goBack } = useContextualNavigation();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      goBack();
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 hover:bg-purple-100 transition-all duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar</span>
        </Button>
        
        <div className="flex items-center space-x-2">
          {icon && (
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-2 rounded-lg">
              {icon}
            </div>
          )}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            Premium
          </div>
        </div>
      </div>
      
      <div>
        <h1 className="text-2xl font-bold text-purple-900 mb-2">{title}</h1>
        {subtitle && (
          <p className="text-purple-700 font-medium">{subtitle}</p>
        )}
        {description && (
          <p className="text-purple-700">{description}</p>
        )}
      </div>
    </div>
  );
};

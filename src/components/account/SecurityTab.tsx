
import { Button } from '@/components/ui/button';
import { Mail, MessageCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface SecurityTabProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const SecurityTab = ({ isLoading, setIsLoading }: SecurityTabProps) => {
  const { user } = useAuth();

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent(
      `Olá! Preciso alterar meu e-mail da conta MadenAI.\n\nE-mail atual: ${user?.email}\nNovo e-mail: \n\nObrigado!`
    );
    window.open(`https://wa.me/5511999999999?text=${message}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Alterar E-mail */}
      <div className="border rounded-lg p-6 space-y-4">
        <div className="flex items-center space-x-2">
          <Mail className="h-5 w-5 text-blue-600" />
          <h4 className="font-semibold text-lg">Alterar E-mail</h4>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-slate-600 mb-2">
            <strong>E-mail atual:</strong> {user?.email}
          </p>
          <p className="text-slate-700 mb-4">
            Precisa alterar seu e-mail? Sem problemas! 😊
          </p>
          <p className="text-slate-600 text-sm mb-4">
            Nossa equipe resolve isso super rapidinho - em menos de 10 minutinhas você já terá seu novo e-mail configurado!
          </p>
        </div>

        <Button 
          onClick={handleWhatsAppContact}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
          size="lg"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Falar com Suporte no WhatsApp
        </Button>
        
        <p className="text-xs text-center text-slate-500">
          Clique no botão acima e nossa equipe te ajudará com carinho! 💚
        </p>
      </div>
    </div>
  );
};


import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ChatSecurityBannerProps {
  isAuthenticated: boolean;
  sessionId?: string;
}

export const ChatSecurityBanner = ({ isAuthenticated, sessionId }: ChatSecurityBannerProps) => {
  if (!isAuthenticated) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Acesso Restrito:</strong> Você precisa estar logado para usar o chat com IA. 
          Todas as conversas são protegidas e auditadas para sua segurança.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="mb-4 border-green-200 bg-green-50">
      <Shield className="h-4 w-4 text-green-600" />
      <AlertDescription className="text-green-800">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-3 w-3" />
          <span className="text-sm">
            <strong>Chat Seguro Ativo:</strong> Suas conversas são privadas, criptografadas e auditadas.
          </span>
        </div>
        {sessionId && (
          <div className="text-xs mt-1 opacity-75">
            Sessão: {sessionId.substring(0, 8)}...
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};

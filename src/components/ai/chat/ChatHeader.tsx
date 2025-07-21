
import { Bot, Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ChatHeaderProps {
  connectionStatus?: 'connected' | 'fallback' | 'error';
  projectName?: string;
}

export const ChatHeader = ({ connectionStatus = 'connected', projectName }: ChatHeaderProps) => {
  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi className="h-3 w-3 text-green-600" />;
      case 'fallback':
        return <AlertTriangle className="h-3 w-3 text-amber-600" />;
      case 'error':
        return <WifiOff className="h-3 w-3 text-red-600" />;
      default:
        return <Wifi className="h-3 w-3 text-green-600" />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Conectado';
      case 'fallback':
        return 'Modo Backup';
      case 'error':
        return 'Desconectado';
      default:
        return 'Conectado';
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'fallback':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'error':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-green-50 text-green-700 border-green-200';
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center">
          <Bot className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">MadenAI</h3>
          <p className="text-xs text-gray-500">
            {projectName ? `Especialista em ${projectName}` : 'Assistente de Arquitetura e Engenharia'}
          </p>
        </div>
      </div>
      
      <Badge variant="outline" className={`text-xs ${getStatusColor()}`}>
        {getStatusIcon()}
        <span className="ml-1">{getStatusText()}</span>
      </Badge>
    </div>
  );
};

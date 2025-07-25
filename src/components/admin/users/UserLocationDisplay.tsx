import { MapPin, Globe, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface UserLocationDisplayProps {
  realLocation: string;
  lastLoginIp: string | null;
  lastSignInAt: string | null;
  compact?: boolean;
}

export const UserLocationDisplay = ({ 
  realLocation, 
  lastLoginIp, 
  lastSignInAt,
  compact = false 
}: UserLocationDisplayProps) => {
  const isLocationAvailable = realLocation && realLocation !== 'Localização não disponível';
  
  const formatLastSeen = (dateString: string | null) => {
    if (!dateString) return 'Nunca';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}min atrás`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h atrás`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d atrás`;
    }
  };

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className="flex items-center gap-2 text-sm">
              {isLocationAvailable ? (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-green-600" />
                  <span className="truncate max-w-[120px]">{realLocation}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Globe className="h-3 w-3" />
                  <span>Sem localização</span>
                </div>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-2">
              <div>
                <strong>Localização:</strong> {realLocation}
              </div>
              {lastLoginIp && (
                <div>
                  <strong>IP:</strong> {lastLoginIp}
                </div>
              )}
              <div>
                <strong>Último acesso:</strong> {formatLastSeen(lastSignInAt)}
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="space-y-2">
      {/* Localização */}
      <div className="flex items-center gap-2">
        {isLocationAvailable ? (
          <>
            <MapPin className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">{realLocation}</span>
            <Badge variant="outline" className="text-xs">
              Rastreado
            </Badge>
          </>
        ) : (
          <>
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Localização não disponível</span>
            <Badge variant="secondary" className="text-xs">
              Sem dados
            </Badge>
          </>
        )}
      </div>

      {/* IP do último acesso */}
      {lastLoginIp && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-mono bg-muted px-2 py-1 rounded">
            {lastLoginIp}
          </span>
          <span>·</span>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{formatLastSeen(lastSignInAt)}</span>
          </div>
        </div>
      )}

      {/* Status da localização */}
      <div className="text-xs">
        {isLocationAvailable ? (
          <span className="text-green-600">✓ Localização baseada no IP do último acesso</span>
        ) : (
          <span className="text-amber-600">⚠ Aguardando dados de geolocalização</span>
        )}
      </div>
    </div>
  );
};
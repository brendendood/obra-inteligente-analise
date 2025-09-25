import { MapPin, Globe, Clock, RefreshCw, AlertTriangle, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { LocationCorrectionDialog } from '@/components/admin/LocationCorrectionDialog';

interface UserLocationDisplayProps {
  realLocation: string;
  lastLoginIp: string | null;
  lastSignInAt: string | null;
  userId: string;
  compact?: boolean;
  onLocationUpdate?: () => void;
}

export const UserLocationDisplay = ({ 
  realLocation, 
  lastLoginIp, 
  lastSignInAt,
  userId,
  compact = false,
  onLocationUpdate
}: UserLocationDisplayProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const isLocationAvailable = realLocation && realLocation !== 'Localização não disponível';

  const handleUpdateLocation = async () => {
    setIsUpdating(true);
    try {
      console.log('🔄 Atualizando localização ENHANCED para usuário:', userId);
      
      // Tentar capturar IP real primeiro
      let realIP = null;
      try {
        const response = await fetch('https://ipapi.co/ip/');
        if (response.ok) {
          realIP = (await response.text()).trim();
          console.log(`✅ IP real capturado: ${realIP}`);
        }
      } catch (e) {
        console.warn('❌ Falha ao capturar IP real:', e);
      }

      // Usar nova edge function enhanced se temos IP real
      if (realIP && realIP !== '127.0.0.1') {
        const { data: preciseData, error: preciseError } = await supabase.functions.invoke('ip-geolocation-enhanced', {
          body: {
            ip_address: realIP,
            user_id: userId,
            force_update: true
          }
        });

        if (!preciseError && preciseData?.success) {
          console.log('✅ Geolocalização enhanced atualizada:', preciseData);
          toast({
            title: "✅ Localização Enhanced Atualizada",
            description: `${preciseData.location?.city || 'Localização'} capturada com múltiplas APIs`,
          });
          
          if (onLocationUpdate) {
            setTimeout(onLocationUpdate, 1000);
          }
          return;
        } else {
          console.warn('⚠️ Falha na geolocalização enhanced:', preciseError);
        }
      }

      // Fallback para método antigo
      const { data, error } = await supabase.rpc('force_update_user_location', {
        target_user_id: userId
      });

      if (error) {
        console.error('❌ Erro ao forçar atualização:', error);
        toast({
          title: "Erro na atualização",
          description: "Não foi possível atualizar a localização",
          variant: "destructive",
        });
        return;
      }

      const result = data as any;
      if (!result.success) {
        toast({
          title: "Falha na atualização",
          description: result.error || "Erro desconhecido",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Localização atualizada",
        description: `IP ${result.ip_address} sendo processado`,
      });

      if (onLocationUpdate) {
        setTimeout(onLocationUpdate, 2000);
      }

      console.log('✅ Atualização de localização iniciada:', result);
    } catch (error) {
      console.error('❌ Erro na atualização:', error);
      toast({
        title: "Erro no sistema",
        description: "Falha ao executar atualização",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
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

  // Detectar se é provável que seja data center
  const isLikelyDataCenter = realLocation?.toLowerCase().includes('frankfurt') || 
                            realLocation?.toLowerCase().includes('amazon') ||
                            realLocation?.toLowerCase().includes('aws') ||
                            realLocation?.toLowerCase().includes('google') ||
                            realLocation?.toLowerCase().includes('microsoft');

  return (
    <div className="space-y-2">
      {/* Localização */}
      <div className="flex items-center gap-2">
        {isLocationAvailable ? (
          <>
            <MapPin className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">{realLocation}</span>
            <Badge variant={isLikelyDataCenter ? "destructive" : "outline"} className="text-xs">
              {isLikelyDataCenter ? "Data Center" : "Rastreado"}
            </Badge>
            {isLikelyDataCenter && (
              <Tooltip>
                <TooltipTrigger>
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Possível IP de data center - localização imprecisa</p>
                </TooltipContent>
              </Tooltip>
            )}
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

      {/* Status da localização com botões de ação */}
      <div className="flex items-center justify-between text-xs">
        <div>
          {isLocationAvailable ? (
            <span className={isLikelyDataCenter ? "text-red-600" : "text-green-600"}>
              {isLikelyDataCenter ? "⚠ Localização imprecisa (Data Center)" : "✓ Localização baseada no IP"}
            </span>
          ) : (
            <span className="text-amber-600">⚠ Aguardando dados de geolocalização</span>
          )}
        </div>
        
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={handleUpdateLocation}
            disabled={isUpdating}
            className="h-6 px-2 text-xs"
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${isUpdating ? 'animate-spin' : ''}`} />
            {isUpdating ? 'Atualizando...' : 'Atualizar'}
          </Button>
          
          <LocationCorrectionDialog
            userId={userId}
            currentLocation={realLocation}
            isDataCenter={isLikelyDataCenter}
            trigger={
              <Button size="sm" variant="outline" className="h-6 px-2">
                <Edit className="h-3 w-3" />
              </Button>
            }
          />
        </div>
      </div>
    </div>
  );
};
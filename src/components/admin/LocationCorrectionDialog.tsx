import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MapPin, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface LocationCorrectionDialogProps {
  userId: string;
  currentLocation?: string;
  isDataCenter?: boolean;
  trigger: React.ReactNode;
}

export const LocationCorrectionDialog = ({ userId, currentLocation, isDataCenter, trigger }: LocationCorrectionDialogProps) => {
  const [open, setOpen] = useState(false);
  const [city, setCity] = useState('');
  const [region, setRegion] = useState('');
  const [country, setCountry] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleCorrectLocation = async () => {
    if (!city || !country) {
      toast({
        title: "Erro",
        description: "Cidade e país são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    setIsUpdating(true);
    
    try {
      // Atualizar perfil do usuário
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          city: city.trim(),
          state: region.trim() || null,
          country: country.trim()
        })
        .eq('user_id', userId);

      if (profileError) throw profileError;

      // Atualizar último login também
      const { error: loginError } = await supabase
        .from('user_login_history')
        .update({
          city: city.trim(),
          region: region.trim() || null,
          country: country.trim()
        })
        .eq('user_id', userId)
        .order('login_at', { ascending: false })
        .limit(1);

      if (loginError) {
        console.warn('Aviso: Não foi possível atualizar histórico de login:', loginError);
      }

      toast({
        title: "✅ Localização Corrigida",
        description: `Localização atualizada para: ${city}, ${country}`,
      });

      setOpen(false);
      setCity('');
      setRegion('');
      setCountry('');
      
      // Recarregar página para mostrar mudanças
      window.location.reload();
      
    } catch (error: any) {
      console.error('Erro ao corrigir localização:', error);
      toast({
        title: "Erro",
        description: error.message || "Falha ao corrigir localização",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Corrigir Localização
          </DialogTitle>
          <DialogDescription>
            Corrija manualmente a localização do usuário.
            {isDataCenter && (
              <div className="flex items-center gap-2 mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm text-yellow-700 dark:text-yellow-300">
                  IP detectado como data center - correção recomendada
                </span>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {currentLocation && (
            <div className="p-3 bg-muted rounded-lg">
              <Label className="text-sm font-medium">Localização Atual:</Label>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={isDataCenter ? "destructive" : "secondary"}>
                  {currentLocation}
                </Badge>
                {isDataCenter && (
                  <Badge variant="outline" className="text-xs">
                    Data Center
                  </Badge>
                )}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <Label htmlFor="city">Cidade *</Label>
              <Input
                id="city"
                placeholder="ex: Roma"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="region">Estado/Região</Label>
              <Input
                id="region"
                placeholder="ex: Lazio"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="country">País *</Label>
              <Input
                id="country"
                placeholder="ex: Itália"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleCorrectLocation}
            disabled={isUpdating || !city || !country}
          >
            {isUpdating ? 'Atualizando...' : 'Corrigir Localização'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
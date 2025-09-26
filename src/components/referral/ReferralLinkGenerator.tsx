import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Share2, Users, Gift } from 'lucide-react';
import { useReferralSystem } from '@/hooks/useReferralSystem';
import { useToast } from '@/hooks/use-toast';

export const ReferralLinkGenerator = () => {
  const { referralLink, referralCount, userProfile } = useReferralSystem();
  const { toast } = useToast();

  const handleCopyLink = async () => {
    if (referralLink) {
      try {
        await navigator.clipboard.writeText(referralLink);
        toast({
          title: "Link copiado!",
          description: "Seu link de indicação foi copiado para a área de transferência.",
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível copiar o link.",
          variant: "destructive",
        });
      }
    }
  };

  const handleShare = async () => {
    if (navigator.share && referralLink) {
      try {
        await navigator.share({
          title: 'MadeAI - Plataforma de Gestão de Obras',
          text: `Conheça a MadeAI! Use meu link de indicação e comece a usar IA para seus projetos:`,
          url: referralLink,
        });
      } catch (error) {
        // Fallback para copiar
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" />
          Sistema de Indicações
        </CardTitle>
        <CardDescription>
          Indique amigos e ganhe 1 projeto extra permanente para cada pessoa que se cadastrar!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Estatísticas */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Indicações</span>
            </div>
            <div className="text-2xl font-bold text-primary">{referralCount}</div>
          </div>
          
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Gift className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Projetos Extras</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {userProfile?.credits || 0}
            </div>
          </div>
        </div>

        {/* Link de Indicação */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Seu link de indicação:</label>
          <div className="flex gap-2">
            <Input
              value={referralLink || 'Carregando...'}
              readOnly
              className="flex-1"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopyLink}
              disabled={!referralLink}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="default"
              size="icon"
              onClick={handleShare}
              disabled={!referralLink}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Como funciona */}
        <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            Como funciona:
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Compartilhe seu link com amigos e colegas</li>
            <li>• Quando alguém se cadastrar usando seu link, você ganha 1 projeto extra</li>
            <li>• Os projetos extras são permanentes e não expiram</li>
            <li>• Não há limite para quantas pessoas você pode indicar</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
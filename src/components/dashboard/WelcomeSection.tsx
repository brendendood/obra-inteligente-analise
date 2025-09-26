import React from 'react';
import { Button } from '@/components/ui/button';
import { Share, Copy, Users } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { ArchitectQuote } from './ArchitectQuote';
import { useReferralSystem } from '@/hooks/useReferralSystem';
import { useToast } from '@/hooks/use-toast';

interface WelcomeSectionProps {
  userName: string;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const WelcomeSection = ({ userName, onRefresh, isLoading }: WelcomeSectionProps) => {
  const { referralLink, referralCount, userProfile } = useReferralSystem();
  const { toast } = useToast();

  const handleCopyReferralLink = async () => {
    if (referralLink) {
      try {
        await navigator.clipboard.writeText(referralLink);
        toast({
          title: "Link copiado!",
          description: "Link de indicação copiado para a área de transferência",
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível copiar o link",
          variant: "destructive",
        });
      }
    }
  };

  const handleShareReferralLink = async () => {
    if (navigator.share && referralLink) {
      try {
        await navigator.share({
          title: 'MadeAI - Plataforma de Gestão de Obras',
          text: 'Conheça a MadeAI! Use meu link de indicação e ganhe recursos extras:',
          url: referralLink,
        });
      } catch (error) {
        // Fallback para copiar se share não funcionar
        handleCopyReferralLink();
      }
    } else {
      handleCopyReferralLink();
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-background to-muted/20 rounded-xl border border-border/50 p-6 mb-8">
      {/* Header com Logo e Boas-vindas */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Logo width={48} height={18} />
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Bem-vindo, {userName}!
            </h1>
            <p className="text-muted-foreground">
              Gerencie seus projetos com inteligência artificial
            </p>
          </div>
        </div>

        {/* Sistema de Indicação */}
        {userProfile && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 bg-background/50 rounded-lg border border-border/30">
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Users className="h-4 w-4 text-primary" />
                <span>Indicações: {referralCount}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Créditos: {userProfile.credits} projeto{userProfile.credits !== 1 ? 's' : ''} extra{userProfile.credits !== 1 ? 's' : ''}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyReferralLink}
                className="flex items-center gap-2 h-8 px-3"
                disabled={!referralLink}
              >
                <Copy className="h-3 w-3" />
                <span className="hidden sm:inline">Copiar Link</span>
              </Button>
              
              <Button
                variant="default"
                size="sm"
                onClick={handleShareReferralLink}
                className="flex items-center gap-2 h-8 px-3"
                disabled={!referralLink}
              >
                <Share className="h-3 w-3" />
                <span className="hidden sm:inline">Indicar</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Frase de Arquiteto/Engenheiro */}
      <div className="bg-background/30 rounded-lg p-4 border border-border/20">
        <ArchitectQuote />
      </div>
    </div>
  );
};
import React from 'react';
import { Logo } from '@/components/ui/logo';
import { ArchitectQuote } from './ArchitectQuote';

interface WelcomeSectionProps {
  userName: string;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const WelcomeSection = ({ userName }: WelcomeSectionProps) => {
  return (
    <div className="w-full bg-gradient-to-br from-background to-muted/20 rounded-xl border border-border/50 p-6 mb-8">
      {/* Header com Logo e Boas-vindas */}
      <div className="flex items-center gap-4 mb-6">
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

      {/* Frase de Arquiteto/Engenheiro */}
      <div className="bg-background/30 rounded-lg p-4 border border-border/20">
        <ArchitectQuote />
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { HeaderMobileMenu } from '@/components/layout/header/HeaderMobileMenu';

interface DashboardTabletHeaderProps {
  userName: string;
}

export const DashboardTabletHeader: React.FC<DashboardTabletHeaderProps> = ({ userName }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div className="w-full bg-gradient-to-r from-background to-muted/20 rounded-xl border border-border/50 p-4 mb-4 hidden md:block lg:hidden">
        <div className="flex items-center justify-between">
          {/* Logo e Nome */}
          <div className="flex items-center gap-4">
            <Logo width={40} height={15} />
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Olá, {userName}!
              </h2>
              <p className="text-sm text-muted-foreground">
                Painel de Controle MadeAI
              </p>
            </div>
          </div>

          {/* Botão de menu para tablet */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 h-auto"
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Menu Tablet (mesmo do mobile) */}
      <HeaderMobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};
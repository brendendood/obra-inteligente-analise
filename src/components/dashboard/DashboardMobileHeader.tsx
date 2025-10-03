import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HeaderMobileMenu } from '@/components/layout/header/HeaderMobileMenu';
import { Logo } from '@/components/ui/logo';

interface DashboardMobileHeaderProps {
  isMenuOpen: boolean;
  onToggleMenu: () => void;
}

export const DashboardMobileHeader = ({ isMenuOpen, onToggleMenu }: DashboardMobileHeaderProps) => {
  return (
    <>
      {/* Header fixo no topo para mobile */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border h-14 flex items-center justify-between px-4 md:hidden">
        <div className="flex items-center gap-3">
          <Logo width={100} height={32} />
        </div>
        
        {/* Botão de menu */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleMenu}
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
      
      {/* Espaçamento para compensar o header fixo */}
      <div className="h-14 md:hidden" />
      
      {/* Menu Mobile */}
      <HeaderMobileMenu isOpen={isMenuOpen} onClose={onToggleMenu} />
    </>
  );
};
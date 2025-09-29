import React from 'react';
import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { Settings, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardTabletHeaderProps {
  userName: string;
}

export const DashboardTabletHeader: React.FC<DashboardTabletHeaderProps> = ({ userName }) => {
  const navigate = useNavigate();

  return (
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

        {/* Ações rápidas para tablet */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/conta')}
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            Conta
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/conta')}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Configurações
          </Button>
        </div>
      </div>
    </div>
  );
};
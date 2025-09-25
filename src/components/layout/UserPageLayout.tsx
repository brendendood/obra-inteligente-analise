import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { DashboardMobileHeader } from '@/components/dashboard/DashboardMobileHeader';
import { AppLayout } from '@/components/layout/AppLayout';

interface UserPageLayoutProps {
  children: React.ReactNode;
}

export const UserPageLayout = ({ children }: UserPageLayoutProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  // Rotas que NÃO devem ter o header móvel
  const routesWithoutMobileHeader = ['/ia', '/crm'];
  const shouldShowMobileHeader = !routesWithoutMobileHeader.some(route => 
    location.pathname.startsWith(route)
  );

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <AppLayout>
      {/* Header móvel condicional */}
      {shouldShowMobileHeader && (
        <DashboardMobileHeader 
          isMenuOpen={isMenuOpen} 
          onToggleMenu={handleToggleMenu} 
        />
      )}
      
      {/* Conteúdo da página com padding padrão */}
      <div className="px-7 py-7">
        {children}
      </div>
    </AppLayout>
  );
};
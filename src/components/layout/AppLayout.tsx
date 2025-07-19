
import { ReactNode } from 'react';
import Header from './Header';
import { MemberFooter } from './MemberFooter';
import { AppSidebar } from './AppSidebar';
import { useAuth } from '@/hooks/useAuth';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1">
          <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
            <SidebarTrigger className="-ml-1 h-8 w-8" />
            <div className="ml-auto">
              <Header />
            </div>
          </header>
          <main className="flex-1 overflow-auto bg-gray-50">
            <div className="h-full p-3 sm:p-4 md:p-6 lg:p-8">
              {children}
            </div>
            <MemberFooter />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

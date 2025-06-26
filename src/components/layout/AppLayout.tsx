
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50/30">
        <AppSidebar />
        <SidebarInset className="flex-1 min-w-0">
          <main className="flex-1 p-2 sm:p-4 lg:p-6 xl:p-8 overflow-auto">
            <div className="max-w-full mx-auto w-full">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

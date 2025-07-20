import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModernSidebar } from './ModernSidebar';
import { cn } from '@/lib/utils';

export const MobileHeaderWithSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      {/* Mobile Header - Apenas no mobile */}
      <header className="lg:hidden bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          {/* Logo */}
          <div className="font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            MadenAI
          </div>
          
          {/* Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2"
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

      {/* Mobile Sidebar */}
      <div className={cn(
        "lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transition-transform duration-300",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <ModernSidebar 
          isMobileOpen={isSidebarOpen} 
          onMobileClose={() => setIsSidebarOpen(false)} 
        />
      </div>
    </>
  );
};
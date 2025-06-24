
import React from 'react';
import Sidebar from './Sidebar';
import { useSessionControl } from '@/hooks/useSessionControl';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  useSessionControl();

  return (
    <div className="flex h-screen bg-[#0d0d0d] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="min-h-full bg-[#0d0d0d]">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;

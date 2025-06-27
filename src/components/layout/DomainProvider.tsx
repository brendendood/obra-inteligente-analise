
import React, { createContext, useContext, ReactNode } from 'react';
import { useDomainRedirect } from '@/hooks/useDomainRedirect';

interface DomainContextType {
  currentDomain: string;
  isCustomDomain: boolean;
}

const DomainContext = createContext<DomainContextType | undefined>(undefined);

export function DomainProvider({ children }: { children: ReactNode }) {
  const { currentDomain, isCustomDomain } = useDomainRedirect();
  
  return (
    <DomainContext.Provider value={{ currentDomain, isCustomDomain }}>
      {children}
    </DomainContext.Provider>
  );
}

export function useDomain() {
  const context = useContext(DomainContext);
  if (context === undefined) {
    throw new Error('useDomain must be used within a DomainProvider');
  }
  return context;
}

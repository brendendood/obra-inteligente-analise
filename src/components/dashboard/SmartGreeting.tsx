
import { useMemo } from 'react';

interface SmartGreetingProps {
  userName: string;
  className?: string;
}

export const SmartGreeting = ({ userName, className = '' }: SmartGreetingProps) => {
  const greeting = useMemo(() => {
    const now = new Date();
    const hour = now.getHours();
    
    // Bom dia: 05:00 às 11:59
    if (hour >= 5 && hour < 12) {
      return 'Bom dia';
    }
    // Boa tarde: 12:00 às 17:59  
    else if (hour >= 12 && hour < 18) {
      return 'Boa tarde';
    }
    // Boa noite: 18:00 às 04:59
    else {
      return 'Boa noite';
    }
  }, []);

  return (
    <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 ${className}`} style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
      {greeting}, {userName}
    </h1>
  );
};

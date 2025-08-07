import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ModernAIChatDesktop } from '@/components/ai/ModernAIChatDesktop';
import { ModernAIChatMobile } from '@/components/ai/ModernAIChatMobile';

export const ModernAIChat = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <ModernAIChatMobile />;
  }

  return <ModernAIChatDesktop />;
};
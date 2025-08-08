import React from 'react';
import { cn } from '@/lib/utils';

interface TypingDotsProps {
  className?: string;
  dotClassName?: string;
  size?: 'sm' | 'md' | 'lg';
  ariaLabel?: string;
}

const sizeMap: Record<NonNullable<TypingDotsProps['size']>, string> = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-2.5 h-2.5',
};

export const TypingDots: React.FC<TypingDotsProps> = ({
  className,
  dotClassName,
  size = 'md',
  ariaLabel = 'Digitando…',
}) => {
  const dotSize = sizeMap[size];
  const baseDot = cn(dotSize, 'rounded-full bg-foreground/50');

  return (
    <div
      className={cn('flex items-center gap-1.5 h-5', className)}
      role="status"
      aria-label={ariaLabel}
      aria-live="polite"
    >
      <span className={cn('animate-pulse', baseDot, dotClassName)} style={{ animationDelay: '0ms', animationDuration: '1s' }} />
      <span className={cn('animate-pulse', baseDot, dotClassName)} style={{ animationDelay: '150ms', animationDuration: '1s' }} />
      <span className={cn('animate-pulse', baseDot, dotClassName)} style={{ animationDelay: '300ms', animationDuration: '1s' }} />
    </div>
  );
};

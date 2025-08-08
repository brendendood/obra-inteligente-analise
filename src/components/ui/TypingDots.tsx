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
      className={cn('flex items-end gap-1.5 h-5', className)}
      role="status"
      aria-label={ariaLabel}
    >
      <span className={cn('animate-bounce', baseDot, dotClassName)} style={{ animationDelay: '0ms' }} />
      <span className={cn('animate-bounce', baseDot, dotClassName)} style={{ animationDelay: '150ms' }} />
      <span className={cn('animate-bounce', baseDot, dotClassName)} style={{ animationDelay: '300ms' }} />
    </div>
  );
};

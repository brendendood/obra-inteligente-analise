
import { TypingDots } from '@/components/ui/TypingDots';

export const AITypingIndicator = () => {
  return (
    <div className="flex justify-start">
      <div className="bg-muted rounded-full px-3 py-2">
        <TypingDots size="sm" ariaLabel="Digitando..." />
      </div>
    </div>
  );
};

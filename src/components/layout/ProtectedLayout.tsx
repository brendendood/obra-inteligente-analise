import { TrialBanner } from '@/components/trial/TrialBanner';
import { TrialGuard } from '@/components/guards/TrialGuard';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <TrialGuard>
      <div className="min-h-screen">
        <TrialBanner />
        <div className="pt-2">
          {children}
        </div>
      </div>
    </TrialGuard>
  );
};

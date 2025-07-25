
import { AppLayout } from '@/components/layout/AppLayout';
import { ModernAIChat } from '@/components/ai/ModernAIChat';
import { EnhancedBreadcrumb } from '@/components/navigation/EnhancedBreadcrumb';

const Assistant = () => {
  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        <ModernAIChat />
      </div>
    </AppLayout>
  );
};

export default Assistant;

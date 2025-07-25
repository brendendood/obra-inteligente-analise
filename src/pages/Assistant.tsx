
import { AppLayout } from '@/components/layout/AppLayout';
import { ModernAIChat } from '@/components/ai/ModernAIChat';
import { EnhancedBreadcrumb } from '@/components/navigation/EnhancedBreadcrumb';

const Assistant = () => {
  return (
    <AppLayout>
      <div className="flex flex-col h-full min-h-0">
        <div className="flex-shrink-0 mb-4">
          <EnhancedBreadcrumb />
        </div>
        
        <div className="flex-1 min-h-0">
          <ModernAIChat />
        </div>
      </div>
    </AppLayout>
  );
};

export default Assistant;

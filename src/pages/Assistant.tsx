
import { AppLayout } from '@/components/layout/AppLayout';
import { EnhancedBreadcrumb } from '@/components/navigation/EnhancedBreadcrumb';

const Assistant = () => {
  return (
    <AppLayout>
      <div className="flex flex-col h-full min-h-0">
        <div className="flex-shrink-0 mb-4">
          <EnhancedBreadcrumb />
        </div>
        
        <div className="flex-1 min-h-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Assistente IA</h2>
            <p className="text-muted-foreground">Base limpa - pronta para nova implementação</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Assistant;

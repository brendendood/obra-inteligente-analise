
import { AppLayout } from '@/components/layout/AppLayout';
import { EnhancedBreadcrumb } from '@/components/navigation/EnhancedBreadcrumb';
import { EnhancedSkeleton } from '@/components/ui/enhanced-skeleton';
import { SmartLoading } from '@/components/ui/smart-loading';

const DashboardLoadingState = () => {
  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex items-center justify-between">
          <EnhancedSkeleton variant="text" lines={2} className="h-20 w-1/2" />
          <SmartLoading 
            isLoading={true} 
            hasData={false}
            loadingText="Carregando dashboard..."
            showProgress={true}
            progress={50}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <EnhancedSkeleton key={i} variant="card" />
          ))}
        </div>
        <EnhancedSkeleton variant="card" className="h-40" />
      </div>
    </AppLayout>
  );
};

export default DashboardLoadingState;


import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState = ({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) => {
  return (
    <Card className="mx-auto max-w-md border-dashed border-2 border-border dark:border-[#333]">
      <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-4">
        <div className="bg-muted dark:bg-[#232323] p-4 rounded-full">
          <Icon className="h-8 w-8 text-muted-foreground dark:text-[#bbbbbb]" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground dark:text-[#f2f2f2]">{title}</h3>
          <p className="text-sm text-muted-foreground dark:text-[#bbbbbb] max-w-sm">{description}</p>
        </div>
        {actionLabel && onAction && (
          <Button 
            onClick={onAction}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:bg-gradient-to-r dark:from-green-600 dark:to-green-500 text-white hover:from-blue-700 hover:to-indigo-700 dark:hover:from-green-700 dark:hover:to-green-600"
          >
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EmptyState;

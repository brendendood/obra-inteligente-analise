
import { Button } from '@/components/ui/button';
import { RefreshCw, Database, CheckCircle } from 'lucide-react';
import { useProjectMigration } from '@/hooks/useProjectMigration';
import { cn } from '@/lib/utils';

export const MigrationButton = () => {
  const { migrateProjects, isMigrating } = useProjectMigration();

  const handleMigration = async () => {
    try {
      await migrateProjects();
    } catch (error) {
      console.error('Erro na migração:', error);
    }
  };

  return (
    <div className="flex items-center justify-end">
      <Button
        onClick={handleMigration}
        disabled={isMigrating}
        variant="outline"
        size="sm"
        className={cn(
          // Base styles
          "relative overflow-hidden transition-all duration-300",
          "border-2 font-medium rounded-lg shadow-sm",
          
          // Normal state
          "border-blue-200 bg-white text-blue-700",
          "hover:border-blue-300 hover:bg-blue-50 hover:shadow-md",
          "focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
          
          // Loading state
          isMigrating && "border-blue-300 bg-blue-50 text-blue-600",
          
          // Mobile responsive
          "text-sm px-3 py-2 h-9",
          "sm:text-sm sm:px-4 sm:py-2.5 sm:h-10",
          "lg:px-5 lg:py-3 lg:h-11",
          
          // Mobile adjustments
          "min-w-[120px] sm:min-w-[140px] lg:min-w-[160px]",
          "max-w-[200px] sm:max-w-none"
        )}
      >
        {/* Loading state */}
        {isMigrating && (
          <>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin text-blue-600" />
            <span className="hidden sm:inline">Migrando...</span>
            <span className="sm:hidden">Migrando</span>
          </>
        )}
        
        {/* Normal state */}
        {!isMigrating && (
          <>
            <Database className="h-4 w-4 mr-2 text-blue-600" />
            <span className="hidden sm:inline">Migrar Projetos</span>
            <span className="sm:hidden">Migrar</span>
          </>
        )}
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                        translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
      </Button>
    </div>
  );
};

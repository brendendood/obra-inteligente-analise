
import { Button } from '@/components/ui/button';
import { RefreshCw, Database } from 'lucide-react';
import { useProjectMigration } from '@/hooks/useProjectMigration';

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
    <Button
      onClick={handleMigration}
      disabled={isMigrating}
      variant="outline"
      size="sm"
      className="border-blue-200 text-blue-700 hover:bg-blue-50"
    >
      {isMigrating ? (
        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Database className="h-4 w-4 mr-2" />
      )}
      {isMigrating ? 'Migrando...' : 'Migrar Projetos'}
    </Button>
  );
};

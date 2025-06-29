
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useProjectStore } from '@/stores/projectStore';

export const useProjectMigration = () => {
  const [isMigrating, setIsMigrating] = useState(false);
  const { toast } = useToast();
  const { forceRefresh } = useProjectStore();

  const migrateProjects = async () => {
    setIsMigrating(true);
    
    try {
      console.log('🔄 Iniciando migração de projetos...');
      
      const { data, error } = await supabase.functions.invoke('migrate-projects', {
        body: {}
      });

      if (error) {
        throw error;
      }

      console.log('✅ Migração concluída:', data);
      
      toast({
        title: "🎉 Migração concluída!",
        description: `${data.summary.successfulMigrations} projeto(s) foram atualizados com dados de orçamento e cronograma.`,
      });

      // Forçar refresh dos projetos para mostrar os dados atualizados
      await forceRefresh();
      
      return data;
    } catch (error) {
      console.error('❌ Erro na migração:', error);
      
      toast({
        title: "❌ Erro na migração",
        description: error instanceof Error ? error.message : "Não foi possível migrar os projetos.",
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setIsMigrating(false);
    }
  };

  return {
    migrateProjects,
    isMigrating
  };
};


import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useOptimizedProjectStore } from '@/stores/optimizedProjectStore';

export const useProjectMigration = () => {
  const [isMigrating, setIsMigrating] = useState(false);
  const { toast } = useToast();
  const { fetchProjects } = useOptimizedProjectStore();

  const migrateProjects = async () => {
    setIsMigrating(true);
    
    try {
      console.log('🔄 Iniciando atualização de projetos...');
      
      const { data, error } = await supabase.functions.invoke('migrate-projects', {
        body: {}
      });

      if (error) {
        throw error;
      }

      console.log('✅ Atualização concluída:', data);
      
      toast({
        title: "🎉 Projetos atualizados!",
        description: `${data.summary.successfulMigrations} projeto(s) foram sincronizados com dados de orçamento e cronograma.`,
      });

      // Forçar refresh dos projetos para mostrar os dados atualizados
      await fetchProjects();
      
      return data;
    } catch (error) {
      console.error('❌ Erro na atualização:', error);
      
      toast({
        title: "❌ Erro na atualização",
        description: error instanceof Error ? error.message : "Não foi possível atualizar os projetos.",
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

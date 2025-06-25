
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProject } from '@/contexts/ProjectContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DashboardStats {
  totalProjects: number;
  totalArea: number;
  recentProjects: number;
  timeSaved: number;
}

export const useDashboardData = () => {
  const { user } = useAuth();
  const { loadUserProjects, clearAllProjects } = useProject();
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalArea: 0,
    recentProjects: 0,
    timeSaved: 0
  });
  const { toast } = useToast();

  const loadProjects = async () => {
    setIsLoadingProjects(true);
    try {
      console.log('Carregando projetos no Dashboard...');
      const userProjects = await loadUserProjects();
      console.log('Projetos carregados no Dashboard:', userProjects);
      setProjects(userProjects);
      
      // Calcular estatísticas com dados reais
      const totalArea = userProjects.reduce((sum: number, project: any) => {
        return sum + (project.total_area || 0);
      }, 0);

      const recentProjects = userProjects.filter((project: any) => {
        const createdAt = new Date(project.created_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return createdAt >= weekAgo;
      }).length;

      const newStats = {
        totalProjects: userProjects.length,
        totalArea,
        recentProjects,
        timeSaved: userProjects.length * 2 // 2 horas por projeto
      };

      setStats(newStats);
      console.log('Estatísticas calculadas:', newStats);
    } catch (error) {
      console.error('Erro ao carregar projetos no Dashboard:', error);
      clearAllProjects();
      setProjects([]);
      setStats({
        totalProjects: 0,
        totalArea: 0,
        recentProjects: 0,
        timeSaved: 0
      });
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const handleDeleteAllProjects = async () => {
    try {
      console.log('Excluindo todos os projetos...');
      
      const { data: userProjects, error: fetchError } = await supabase
        .from('projects')
        .select('id')
        .eq('user_id', user?.id);

      if (fetchError) throw fetchError;

      if (userProjects && userProjects.length > 0) {
        const { error: deleteError } = await supabase
          .from('projects')
          .delete()
          .eq('user_id', user?.id);

        if (deleteError) throw deleteError;

        console.log(`${userProjects.length} projetos excluídos com sucesso`);
        
        clearAllProjects();
        setProjects([]);
        setStats({
          totalProjects: 0,
          totalArea: 0,
          recentProjects: 0,
          timeSaved: 0
        });
        
        toast({
          title: "✅ Projetos excluídos!",
          description: `${userProjects.length} projeto(s) foram removidos com sucesso.`,
        });
      } else {
        toast({
          title: "ℹ️ Nenhum projeto encontrado",
          description: "Não há projetos para excluir.",
        });
      }
    } catch (error) {
      console.error('Erro ao excluir projetos:', error);
      toast({
        title: "❌ Erro ao excluir",
        description: "Não foi possível excluir os projetos.",
        variant: "destructive",
      });
    }
  };

  return {
    projects,
    stats,
    isLoadingProjects,
    loadProjects,
    handleDeleteAllProjects
  };
};

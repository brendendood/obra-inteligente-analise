
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProjectLoader } from '@/hooks/useProjectLoader';
import { useAutoRefresh } from '@/hooks/useAutoRefresh';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DashboardStats {
  totalProjects: number;
  totalArea: number;
  recentProjects: number;
  timeSaved: number;
}

export const useDashboardData = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const { loadUserProjects } = useProjectLoader();
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalArea: 0,
    recentProjects: 0,
    timeSaved: 0
  });
  const { toast } = useToast();
  const initializedRef = useRef(false);
  const isLoadingRef = useRef(false);
  const mountedRef = useRef(true);

  // Função estável de carregamento
  const loadProjects = useCallback(async () => {
    if (isLoadingRef.current || !mountedRef.current) {
      return;
    }

    if (loading || !isAuthenticated || !user) {
      if (!loading && !isAuthenticated) {
        setProjects([]);
        setIsLoadingProjects(false);
        initializedRef.current = true;
      }
      return;
    }

    isLoadingRef.current = true;
    setIsLoadingProjects(true);
    
    try {
      const userProjects = await loadUserProjects();
      
      if (!mountedRef.current) return;
      
      setProjects(userProjects);
      
      // Calcular estatísticas
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
        timeSaved: userProjects.length * 2
      };

      setStats(newStats);
      
    } catch (error) {
      console.error('Erro no Dashboard:', error);
      if (mountedRef.current) {
        setProjects([]);
        toast({
          title: "Erro ao carregar projetos",
          description: "Não foi possível carregar seus projetos. Tente novamente.",
          variant: "destructive"
        });
      }
    } finally {
      if (mountedRef.current) {
        setIsLoadingProjects(false);
        isLoadingRef.current = false;
        initializedRef.current = true;
      }
    }
  }, [loading, isAuthenticated, user?.id, loadUserProjects, toast]);

  // Auto refresh MUITO conservador
  const { forceRefresh } = useAutoRefresh({
    onRefresh: loadProjects,
    interval: 600000, // 10 minutos
    enabled: isAuthenticated && !loading && initializedRef.current
  });

  // Carregar apenas UMA vez quando tudo estiver pronto
  useEffect(() => {
    if (!loading && !initializedRef.current && isAuthenticated && user) {
      loadProjects();
    }
  }, [loading, isAuthenticated, user?.id]); // Dependências mínimas e estáveis

  // Cleanup na desmontagem
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleDeleteAllProjects = async () => {
    try {
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
        
        if (mountedRef.current) {
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
        }
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
    handleDeleteAllProjects,
    forceRefresh
  };
};

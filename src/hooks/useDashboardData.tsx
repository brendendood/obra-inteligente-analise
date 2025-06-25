
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

  const loadProjects = useCallback(async () => {
    // Prevenir múltiplas execuções simultâneas
    if (isLoadingRef.current) {
      console.log('⏳ Load projects já em andamento, ignorando...');
      return;
    }

    console.log('📊 Dashboard loadProjects:', { loading, isAuthenticated, userId: user?.id });
    
    if (loading) {
      console.log('⏳ Dashboard aguardando auth...');
      return;
    }

    if (!isAuthenticated || !user) {
      console.log('🚫 Dashboard: usuário não autenticado');
      setProjects([]);
      setIsLoadingProjects(false);
      initializedRef.current = true;
      return;
    }

    isLoadingRef.current = true;
    setIsLoadingProjects(true);
    
    try {
      console.log('🔄 Dashboard carregando projetos...');
      const userProjects = await loadUserProjects();
      console.log('📋 Dashboard projetos carregados:', userProjects.length);
      
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
      console.log('📈 Stats calculadas:', newStats);
      
    } catch (error) {
      console.error('💥 Erro no Dashboard:', error);
      setProjects([]);
      toast({
        title: "Erro ao carregar projetos",
        description: "Não foi possível carregar seus projetos. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingProjects(false);
      isLoadingRef.current = false;
      initializedRef.current = true;
    }
  }, [loading, isAuthenticated, user?.id, loadUserProjects, toast]);

  // Auto refresh com configurações mais conservadoras
  const { forceRefresh } = useAutoRefresh({
    onRefresh: loadProjects,
    interval: 120000, // 2 minutos em vez de 1
    enabled: isAuthenticated && !loading && initializedRef.current,
    refreshOnRouteChange: false // DESABILITADO para evitar loops
  });

  // Carregar apenas uma vez quando auth estiver pronto
  useEffect(() => {
    if (!loading && !initializedRef.current) {
      console.log('🎯 Dashboard inicializando...');
      loadProjects();
    }
  }, [loading, loadProjects]);

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
    handleDeleteAllProjects,
    forceRefresh
  };
};

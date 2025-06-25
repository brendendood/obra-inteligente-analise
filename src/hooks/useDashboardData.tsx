
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

  // Função estável de carregamento com logs melhorados
  const loadProjects = useCallback(async () => {
    console.log('🔄 loadProjects iniciado:', { 
      isLoading: isLoadingRef.current, 
      mounted: mountedRef.current,
      loading,
      isAuthenticated,
      userId: user?.id 
    });

    if (isLoadingRef.current || !mountedRef.current) {
      console.log('⏹️ loadProjects abortado - já carregando ou desmontado');
      return;
    }

    if (loading || !isAuthenticated || !user) {
      console.log('🚫 loadProjects abortado - auth não pronto:', { loading, isAuthenticated, hasUser: !!user });
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
      console.log('📊 Carregando projetos para usuário:', user.id);
      
      // Tentar carregar diretamente com consulta mais específica
      const { data: directProjects, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erro na consulta direta:', error);
        throw error;
      }

      console.log('✅ Consulta direta executada:', {
        encontrados: directProjects?.length || 0,
        userId: user.id,
        dados: directProjects
      });

      if (!mountedRef.current) return;
      
      const userProjects = directProjects || [];
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

      console.log('📈 Stats calculadas:', newStats);
      setStats(newStats);
      
    } catch (error) {
      console.error('💥 Erro no Dashboard:', error);
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
  }, [user?.id, loading, isAuthenticated, toast]);

  // Auto refresh conservador
  const { forceRefresh } = useAutoRefresh({
    onRefresh: loadProjects,
    interval: 600000, // 10 minutos
    enabled: isAuthenticated && !loading && initializedRef.current
  });

  // Carregar apenas UMA vez quando auth estiver pronto
  useEffect(() => {
    console.log('🔄 useEffect dashboard triggered:', { 
      loading, 
      initialized: initializedRef.current, 
      isAuthenticated, 
      hasUser: !!user 
    });

    if (!loading && !initializedRef.current && isAuthenticated && user) {
      console.log('✅ Condições atendidas, iniciando loadProjects');
      loadProjects();
    }
  }, [loading, isAuthenticated, user?.id, loadProjects]);

  // Cleanup na desmontagem
  useEffect(() => {
    return () => {
      console.log('🧹 Dashboard cleanup executado');
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

import { memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useImpersonation } from '@/contexts/ImpersonationContext';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/layout/AppLayout';
import { EnhancedBreadcrumb } from '@/components/navigation/EnhancedBreadcrumb';
import { ImpersonationBanner } from '@/components/admin/ImpersonationBanner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UnifiedLoading } from '@/components/ui/unified-loading';
import { Plus, FolderOpen, TrendingUp, Calendar } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  created_at: string;
  total_area?: number;
  project_type?: string;
  analysis_data?: any;
}

// Safe project fetching hook using TanStack Query
const useProjectsQuery = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['projects', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Project[];
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Memoized stats calculation
const useProjectStats = (projects: Project[]) => {
  return useMemo(() => {
    if (!projects || projects.length === 0) {
      return {
        totalProjects: 0,
        totalArea: 0,
        recentProjects: 0,
        processedProjects: 0,
      };
    }

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    let totalArea = 0;
    let processedCount = 0;
    let recentCount = 0;

    projects.forEach((project) => {
      totalArea += project.total_area || 0;
      
      if (project.analysis_data && Object.keys(project.analysis_data).length > 0) {
        processedCount++;
      }
      
      const createdAt = new Date(project.created_at);
      if (createdAt >= weekAgo) recentCount++;
    });

    return {
      totalProjects: projects.length,
      totalArea: Math.round(totalArea),
      recentProjects: recentCount,
      processedProjects: processedCount,
    };
  }, [projects]);
};

// Memoized components
const SafeGreeting = memo(({ userName }: { userName: string }) => (
  <div className="mb-4">
    <h1 className="text-2xl font-bold text-gray-900 mb-2">
      Olá, {userName}! 👋
    </h1>
    <p className="text-gray-600">
      Bem-vindo ao seu painel de projetos
    </p>
  </div>
));

const SafeStatsCards = memo(({ stats }: { stats: ReturnType<typeof useProjectStats> }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total de Projetos</CardTitle>
        <FolderOpen className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stats.totalProjects}</div>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Área Total</CardTitle>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stats.totalArea.toLocaleString()} m²</div>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Projetos Recentes</CardTitle>
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stats.recentProjects}</div>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Processados</CardTitle>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stats.processedProjects}</div>
      </CardContent>
    </Card>
  </div>
));

const SafeProjectsList = memo(({ projects }: { projects: Project[] }) => {
  const navigate = useNavigate();
  
  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum projeto ainda</h3>
          <p className="text-muted-foreground mb-4 text-center">
            Comece criando seu primeiro projeto
          </p>
          <Button onClick={() => navigate('/upload')}>
            <Plus className="mr-2 h-4 w-4" />
            Criar Primeiro Projeto
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Seus Projetos</h2>
        <Button onClick={() => navigate('/upload')} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Novo Projeto
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.slice(0, 6).map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/projetos/${project.id}`)}>
            <CardHeader>
              <CardTitle className="text-base">{project.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Área: {project.total_area || 0} m²</p>
                <p>Tipo: {project.project_type || 'Não definido'}</p>
                <p>Criado: {new Date(project.created_at).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {projects.length > 6 && (
        <div className="text-center">
          <Button variant="outline" onClick={() => navigate('/projetos')}>
            Ver Todos os Projetos ({projects.length})
          </Button>
        </div>
      )}
    </div>
  );
});

const SafeDashboard = memo(() => {
  console.log('🔒 SAFE DASHBOARD: Renderizado');
  
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const { isImpersonating, impersonationData } = useImpersonation();
  const navigate = useNavigate();
  
  // Use TanStack Query directly instead of problematic store
  const { data: projects = [], isLoading, error } = useProjectsQuery();
  const stats = useProjectStats(projects);

  // Handle authentication redirect
  if (!authLoading && !isAuthenticated) {
    navigate('/login');
    return null;
  }

  // Loading state
  if (authLoading || isLoading) {
    return <UnifiedLoading text="Carregando dashboard..." />;
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-600">Erro ao carregar projetos</p>
            <Button onClick={() => navigate('/upload')} className="mt-4">
              Criar Novo Projeto
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário';

  return (
    <div className="min-h-screen">
      {/* Impersonation Banner */}
      {isImpersonating && impersonationData && (
        <ImpersonationBanner
          impersonatedUser={{
            id: impersonationData.targetUser.id,
            name: impersonationData.targetUser.name,
            email: impersonationData.targetUser.email,
          }}
          sessionId={impersonationData.sessionId}
          adminId={impersonationData.adminId}
        />
      )}
      
      <AppLayout>
        <div className="flex flex-col space-y-6 w-full min-w-0 max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 w-full">
            <div className="flex items-center justify-between w-full mb-6">
              <EnhancedBreadcrumb />
            </div>
            
            <SafeGreeting userName={userName} />
          </div>

          {/* Content */}
          <div className="w-full space-y-6">
            <SafeStatsCards stats={stats} />
            <SafeProjectsList projects={projects} />
          </div>
        </div>
      </AppLayout>
      
      {/* Debug info */}
      <div style={{ 
        position: 'fixed', 
        top: 60, 
        right: 10, 
        background: 'green', 
        color: 'white', 
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px'
      }}>
        <div>🔒 SAFE DASHBOARD</div>
        <div>TanStack Query + Memo</div>
        <div>Projetos: {projects.length}</div>
      </div>
    </div>
  );
});

SafeDashboard.displayName = 'SafeDashboard';
SafeGreeting.displayName = 'SafeGreeting';
SafeStatsCards.displayName = 'SafeStatsCards';
SafeProjectsList.displayName = 'SafeProjectsList';

export default SafeDashboard;
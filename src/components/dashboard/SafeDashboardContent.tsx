import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  FolderOpen, 
  TrendingUp, 
  Calendar,
  DollarSign,
  Clock,
  BarChart3,
  Grip
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  created_at: string;
  total_area?: number;
  project_type?: string;
  analysis_data?: any;
}

interface SafeStats {
  totalProjects: number;
  totalArea: number;
  recentProjects: number;
  processedProjects: number;
}

interface SafeDashboardContentProps {
  projects: Project[];
  stats: SafeStats;
  isLoading: boolean;
}

// Memoized Stats Cards Component
const SafeStatsCards = memo(({ stats }: { stats: SafeStats }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total de Projetos</CardTitle>
        <FolderOpen className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stats.totalProjects}</div>
        <p className="text-xs text-muted-foreground">
          projetos criados
        </p>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Área Total</CardTitle>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stats.totalArea.toLocaleString()} m²</div>
        <p className="text-xs text-muted-foreground">
          área construída
        </p>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Projetos Recentes</CardTitle>
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stats.recentProjects}</div>
        <p className="text-xs text-muted-foreground">
          nos últimos 7 dias
        </p>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Processados</CardTitle>
        <BarChart3 className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stats.processedProjects}</div>
        <p className="text-xs text-muted-foreground">
          com análise completa
        </p>
      </CardContent>
    </Card>
  </div>
));

// Memoized Quick Actions Component
const SafeQuickActions = memo(() => {
  const navigate = useNavigate();
  
  const handleUpload = useCallback(() => {
    navigate('/upload');
  }, [navigate]);
  
  const handleViewProjects = useCallback(() => {
    navigate('/projetos');
  }, [navigate]);

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleUpload}>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <h3 className="font-semibold">Novo Projeto</h3>
              <p className="text-sm text-muted-foreground">
                Faça upload de plantas e documentos
              </p>
            </div>
            <Plus className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleViewProjects}>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <h3 className="font-semibold">Ver Todos os Projetos</h3>
              <p className="text-sm text-muted-foreground">
                Gerencie seus projetos existentes
              </p>
            </div>
            <FolderOpen className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

// Memoized Project Card Component
const SafeProjectCard = memo(({ project, onClick }: { 
  project: Project; 
  onClick: (project: Project) => void; 
}) => {
  const handleClick = useCallback(() => {
    onClick(project);
  }, [project, onClick]);

  const getStatusBadge = (project: Project) => {
    if (project.analysis_data && Object.keys(project.analysis_data).length > 0) {
      return <Badge variant="default">Processado</Badge>;
    }
    return <Badge variant="secondary">Pendente</Badge>;
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer group" onClick={handleClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base truncate">{project.name}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              {getStatusBadge(project)}
              <Grip className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-3 w-3" />
            <span>Área: {(project.total_area || 0).toLocaleString()} m²</span>
          </div>
          <div className="flex items-center gap-2">
            <FolderOpen className="h-3 w-3" />
            <span>Tipo: {project.project_type || 'Não definido'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            <span>Criado: {new Date(project.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

// Memoized Projects Section Component
const SafeProjectsSection = memo(({ projects }: { projects: Project[] }) => {
  const navigate = useNavigate();
  
  const handleProjectClick = useCallback((project: Project) => {
    navigate(`/projetos/${project.id}`);
  }, [navigate]);
  
  const handleViewAll = useCallback(() => {
    navigate('/projetos');
  }, [navigate]);

  if (projects.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Seus Projetos</h2>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum projeto ainda</h3>
            <p className="text-muted-foreground mb-6 text-center">
              Comece criando seu primeiro projeto.<br />
              Faça upload de plantas, documentos ou dados do seu projeto.
            </p>
            <Button onClick={() => navigate('/upload')}>
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeiro Projeto
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Projetos Recentes</h2>
        <Button variant="outline" size="sm" onClick={handleViewAll}>
          Ver Todos ({projects.length})
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.slice(0, 6).map((project) => (
          <SafeProjectCard 
            key={project.id} 
            project={project} 
            onClick={handleProjectClick}
          />
        ))}
      </div>
      
      {projects.length > 6 && (
        <div className="text-center mt-6">
          <Button variant="outline" onClick={handleViewAll}>
            Ver Todos os Projetos ({projects.length})
          </Button>
        </div>
      )}
    </div>
  );
});

// Main Safe Dashboard Content Component
const SafeDashboardContent = memo(({ 
  projects, 
  stats, 
  isLoading 
}: SafeDashboardContentProps) => {
  console.log('🔒 SAFE DASHBOARD CONTENT: Renderized with', projects.length, 'projects');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6 w-full min-w-0">
      {/* Quick Actions */}
      <SafeQuickActions />
      
      {/* Stats Cards */}
      <SafeStatsCards stats={stats} />
      
      {/* Projects Section */}
      <SafeProjectsSection projects={projects} />
    </div>
  );
});

// Display names for debugging
SafeDashboardContent.displayName = 'SafeDashboardContent';
SafeStatsCards.displayName = 'SafeStatsCards';
SafeQuickActions.displayName = 'SafeQuickActions';
SafeProjectCard.displayName = 'SafeProjectCard';
SafeProjectsSection.displayName = 'SafeProjectsSection';

export default SafeDashboardContent;
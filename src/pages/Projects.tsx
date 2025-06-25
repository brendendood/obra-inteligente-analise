
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Plus,
  Search,
  Trash2,
  Eye,
  MoreVertical,
  Calendar,
  CheckCircle,
  Clock,
  GripVertical,
  Filter,
  SortAsc
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProject } from '@/contexts/ProjectContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const Projects = () => {
  const { isAuthenticated, loading } = useAuth();
  const { loadUserProjects } = useProject();
  const [projects, setProjects] = useState<any[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteProject, setDeleteProject] = useState<any>(null);
  const [draggedProject, setDraggedProject] = useState<any>(null);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'area'>('date');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      loadProjects();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    let filtered = projects.filter(project =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.project_type && project.project_type.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Aplicar ordenação
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'area':
          return (b.total_area || 0) - (a.total_area || 0);
        case 'date':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    setFilteredProjects(filtered);
  }, [projects, searchTerm, sortBy]);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const userProjects = await loadUserProjects();
      setProjects(userProjects);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      setProjects(projects.filter(p => p.id !== projectId));
      setDeleteProject(null);

      toast({
        title: "✅ Projeto excluído!",
        description: "O projeto foi removido com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao excluir projeto:', error);
      toast({
        title: "❌ Erro ao excluir",
        description: "Não foi possível excluir o projeto.",
        variant: "destructive",
      });
    }
  };

  const handleDragStart = (e: React.DragEvent, project: any) => {
    setDraggedProject(project);
    e.dataTransfer.effectAllowed = 'move';
    // Adiciona estilo visual durante o drag
    const target = e.currentTarget as HTMLElement;
    target.style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement;
    target.style.opacity = '1';
    setDraggedProject(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetProject: any) => {
    e.preventDefault();
    
    if (!draggedProject || draggedProject.id === targetProject.id) return;

    const draggedIndex = projects.findIndex(p => p.id === draggedProject.id);
    const targetIndex = projects.findIndex(p => p.id === targetProject.id);

    const newProjects = [...projects];
    const [removed] = newProjects.splice(draggedIndex, 1);
    newProjects.splice(targetIndex, 0, removed);

    setProjects(newProjects);
    
    // Salvar ordem no localStorage para persistência
    const projectOrder = newProjects.map(p => p.id);
    localStorage.setItem('projectOrder', JSON.stringify(projectOrder));
    
    setDraggedProject(null);
    
    toast({
      title: "✅ Ordem atualizada",
      description: "A nova ordem dos projetos foi salva.",
    });
  };

  const getStatusBadge = (project: any) => {
    if (project.analysis_data) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Processado
        </Badge>
      );
    }
    return (
      <Badge className="bg-orange-100 text-orange-800 border-orange-200">
        <Clock className="h-3 w-3 mr-1" />
        Processando
      </Badge>
    );
  };

  if (loading || isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando suas obras...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AppLayout>
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Minhas Obras
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Gerencie todos os seus projetos arquitetônicos. Arraste os cards para reorganizar.
            </p>
          </div>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={() => navigate('/upload')}
                className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2 w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Nova Obra</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Enviar novo projeto PDF</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 gap-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nome ou tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 sm:h-11"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center space-x-2">
                  <SortAsc className="h-4 w-4" />
                  <span>Ordenar</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy('date')}>
                  Data (mais recente)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('name')}>
                  Nome (A-Z)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('area')}>
                  Área (maior)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center space-x-4 sm:space-x-6 text-xs sm:text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Total: {projects.length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Processados: {projects.filter(p => p.analysis_data).length}</span>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <Card className="border-0 shadow-lg text-center py-8 sm:py-12">
            <CardContent>
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-700 mb-2">
                  {projects.length === 0 ? 'Nenhuma obra encontrada' : 'Nenhum resultado na busca'}
                </h3>
                <p className="text-sm sm:text-base text-gray-500 mb-6">
                  {projects.length === 0 
                    ? 'Comece enviando seu primeiro projeto PDF'
                    : 'Tente ajustar os filtros de busca'
                  }
                </p>
                {projects.length === 0 && (
                  <Button 
                    onClick={() => navigate('/upload')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Enviar Primeiro Projeto
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredProjects.map((project) => (
              <Card 
                key={project.id}
                draggable
                onDragStart={(e) => handleDragStart(e, project)}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, project)}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-grab active:cursor-grabbing group"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-2 flex-1 min-w-0">
                      <GripVertical className="h-5 w-5 text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base sm:text-lg text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {project.name}
                        </CardTitle>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {getStatusBadge(project)}
                          {project.project_type && (
                            <Badge variant="outline" className="text-xs">
                              {project.project_type}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => navigate(`/obra/${project.id}`)}
                          className="flex items-center space-x-2"
                        >
                          <Eye className="h-4 w-4" />
                          <span>Abrir Projeto</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => setDeleteProject(project)}
                          className="flex items-center space-x-2 text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Excluir</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    {project.total_area && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Área: {project.total_area}m²</span>
                      </div>
                    )}
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(project.created_at).toLocaleDateString('pt-BR')}
                    </div>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          onClick={() => navigate(`/obra/${project.id}`)}
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          size="sm"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Projeto
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Acessar todas as ferramentas do projeto</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteProject} onOpenChange={() => setDeleteProject(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o projeto "{deleteProject?.name}"? 
                Esta ação não pode ser desfeita e todos os dados relacionados serão perdidos.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => deleteProject && handleDeleteProject(deleteProject.id)}
                className="bg-red-600 hover:bg-red-700"
              >
                Excluir Projeto
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
};

export default Projects;


import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  FolderOpen, 
  Calendar, 
  FileText, 
  Plus,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Edit
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProject } from '@/contexts/ProjectContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Projects = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const { loadUserProjects } = useProject();
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
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

  const handleEditProject = async (projectId: string, newName: string) => {
    if (!newName.trim()) {
      toast({
        title: "❌ Nome inválido",
        description: "O nome do projeto não pode estar vazio.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('projects')
        .update({ name: newName.trim() })
        .eq('id', projectId);

      if (error) throw error;

      // Atualizar a lista local
      setProjects(projects.map(p => 
        p.id === projectId ? { ...p, name: newName.trim() } : p
      ));

      setEditingProject(null);
      setEditName('');

      toast({
        title: "✅ Nome atualizado!",
        description: "O nome do projeto foi alterado com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      toast({
        title: "❌ Erro ao atualizar",
        description: "Não foi possível alterar o nome do projeto.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (project: any) => {
    if (project.analysis_data) {
      return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Concluído</Badge>;
    }
    return <Badge className="bg-orange-100 text-orange-800"><Clock className="h-3 w-3 mr-1" />Em análise</Badge>;
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.project_type && project.project_type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando obras...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center">
              <FolderOpen className="h-8 w-8 mr-3 text-blue-600" />
              Minhas Obras
            </h1>
            <p className="text-slate-600">
              Gerencie todos os seus projetos arquitetônicos
            </p>
          </div>
          
          <Button 
            onClick={() => navigate('/upload')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            size="lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nova Obra
          </Button>
        </div>

        {/* Search */}
        {projects.length > 0 && (
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Buscar projetos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-lg border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-600">Total de Obras</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{projects.length}</div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-600">Concluídas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {projects.filter(p => p.analysis_data).length}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-600">Em Análise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {projects.filter(p => !p.analysis_data).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <Card className="shadow-lg border-0 text-center py-12">
            <CardContent>
              <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-700 mb-2">
                {projects.length === 0 ? 'Nenhuma obra encontrada' : 'Nenhum resultado encontrado'}
              </h3>
              <p className="text-slate-500 mb-6">
                {projects.length === 0 
                  ? 'Comece enviando seu primeiro projeto'
                  : 'Tente ajustar os filtros de busca'
                }
              </p>
              {projects.length === 0 && (
                <Button 
                  onClick={() => navigate('/upload')}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Enviar Primeiro Projeto
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="shadow-lg border-0 hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {editingProject === project.id ? (
                        <div className="space-y-2">
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleEditProject(project.id, editName);
                              }
                              if (e.key === 'Escape') {
                                setEditingProject(null);
                                setEditName('');
                              }
                            }}
                            autoFocus
                            className="text-lg font-bold"
                          />
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleEditProject(project.id, editName)}
                            >
                              Salvar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingProject(null);
                                setEditName('');
                              }}
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="group">
                          <CardTitle className="text-lg mb-2 line-clamp-2 cursor-pointer flex items-center">
                            {project.name}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                              onClick={() => {
                                setEditingProject(project.id);
                                setEditName(project.name);
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </CardTitle>
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        {getStatusBadge(project)}
                        {project.project_type && (
                          <Badge variant="outline" className="text-xs">
                            {project.project_type}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    {project.total_area && (
                      <div className="flex items-center text-sm text-slate-600">
                        <span className="font-medium">Área: {project.total_area}m²</span>
                      </div>
                    )}
                    
                    <div className="flex items-center text-sm text-slate-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(project.created_at).toLocaleDateString('pt-BR')}
                    </div>
                    
                    <Button 
                      onClick={() => navigate(`/obra/${project.id}`)}
                      className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Obra
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Projects;

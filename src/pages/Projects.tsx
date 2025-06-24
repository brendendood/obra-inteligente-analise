
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProject } from '@/contexts/ProjectContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProjectsHeader from '@/components/projects/ProjectsHeader';
import ProjectsStats from '@/components/projects/ProjectsStats';
import ProjectsGrid from '@/components/projects/ProjectsGrid';

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

  const handleStartEdit = (projectId: string, currentName: string) => {
    setEditingProject(projectId);
    setEditName(currentName);
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
    setEditName('');
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.project_type && project.project_type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const completedProjects = projects.filter(p => p.analysis_data).length;
  const analysisProjects = projects.filter(p => !p.analysis_data).length;

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
        <ProjectsHeader
          projectsCount={projects.length}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <ProjectsStats
          totalProjects={projects.length}
          completedProjects={completedProjects}
          analysisProjects={analysisProjects}
        />

        <ProjectsGrid
          projects={projects}
          filteredProjects={filteredProjects}
          editingProject={editingProject}
          editName={editName}
          onStartEdit={handleStartEdit}
          onSaveEdit={handleEditProject}
          onCancelEdit={handleCancelEdit}
          onEditNameChange={setEditName}
        />
      </div>

      <Footer />
    </div>
  );
};

export default Projects;


import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProject } from '@/contexts/ProjectContext';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProjectsGrid from '@/components/dashboard/ProjectsGrid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Upload } from 'lucide-react';

const Projects = () => {
  const { isAuthenticated, loading } = useAuth();
  const { projects, loadUserProjects } = useProject();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      loadUserProjects();
    }
  }, [isAuthenticated, loadUserProjects]);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || project.project_type === filterType;
    return matchesSearch && matchesFilter;
  });

  const projectTypes = [...new Set(projects.map(p => p.project_type).filter(Boolean))];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Carregando projetos...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Todos os Projetos</h1>
            <p className="text-gray-400">
              Gerencie e organize todos os seus projetos arquitetônicos
            </p>
          </div>
          
          <Button
            onClick={() => navigate('/upload')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Upload className="h-4 w-4 mr-2" />
            Novo Projeto
          </Button>
        </div>

        {/* Filtros e Busca */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar projetos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#1a1a1a] border-[#333] text-white placeholder-gray-400"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-md text-white"
          >
            <option value="all">Todos os tipos</option>
            {projectTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Grid de Projetos */}
        <ProjectsGrid projects={filteredProjects} />

        {/* Estatísticas */}
        <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Estatísticas dos Projetos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-400">{projects.length}</div>
              <div className="text-sm text-gray-400">Total de Projetos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">
                {projects.reduce((sum, p) => sum + (p.total_area || 0), 0).toLocaleString()}m²
              </div>
              <div className="text-sm text-gray-400">Área Total</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">{projectTypes.length}</div>
              <div className="text-sm text-gray-400">Tipos Diferentes</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Projects;

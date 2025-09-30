import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useUnifiedProjectStore } from '@/stores/unifiedProjectStore';
import { FolderOpen, Plus, Search, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Project } from '@/types/project';
import { SimpleProjectCard } from './SimpleProjectCard';
interface EnhancedProjectsSectionProps {
  projects: Project[];
  isLoading: boolean;
  onDeleteProject?: (project: Project) => void;
}
const PROJECTS_PER_PAGE = 6;
export const EnhancedProjectsSection = ({
  projects,
  isLoading,
  onDeleteProject
}: EnhancedProjectsSectionProps) => {
  const navigate = useNavigate();
  const {
    updateProject
  } = useUnifiedProjectStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'area'>('date');
  const [currentPage, setCurrentPage] = useState(1);

  // Filtrar e ordenar projetos
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects.filter(project => project.name.toLowerCase().includes(searchTerm.toLowerCase()));
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
    return filtered;
  }, [projects, searchTerm, sortBy]);

  // Paginação
  const totalPages = Math.ceil(filteredAndSortedProjects.length / PROJECTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
  const paginatedProjects = filteredAndSortedProjects.slice(startIndex, startIndex + PROJECTS_PER_PAGE);

  // Reset página quando filtros mudam
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy]);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  if (isLoading && projects.length === 0) {
    return <Card className="border border-gray-200 bg-white w-full">
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <div key={i} className="animate-pulse">
                <div className="h-24 bg-gray-200 rounded-lg"></div>
              </div>)}
          </div>
        </CardContent>
      </Card>;
  }
  if (projects.length === 0) {
    return <div className="p-12 text-center px-[2px] py-[10px]">
        <div className="bg-gray-50 rounded-2xl p-8 border-2 border-dashed border-gray-200 px-[21px]">
          <FolderOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Nenhum projeto ainda
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Comece criando seu primeiro projeto. Faça upload de plantas, documentos ou dados do seu projeto.
          </p>
          <Button onClick={() => navigate('/upload')} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
            <Plus className="h-4 w-4 mr-2" />
            Criar Primeiro Projeto
          </Button>
        </div>
      </div>;
  }
  return <Card className="border border-border bg-card w-full rounded-apple">
      <CardHeader className="pb-4 px-4 sm:px-6">
        <div className="flex flex-col space-y-4">
          {/* Header com título e botão */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-2 min-w-0">
              <FolderOpen className="h-5 w-5 text-primary flex-shrink-0" strokeWidth={1.5} />
              <CardTitle className="text-lg sm:text-xl font-semibold text-foreground truncate">
                Meus Projetos
              </CardTitle>
              <span className="text-sm text-muted-foreground flex-shrink-0">
                ({filteredAndSortedProjects.length})
              </span>
            </div>
            
            <Button onClick={() => navigate('/upload')} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md transition-all duration-200 h-10 px-4 sm:px-6 font-medium rounded-apple">
              <Plus className="h-4 w-4 mr-2 flex-shrink-0" strokeWidth={1.5} />
              <span className="truncate">Novo Projeto</span>
            </Button>
          </div>

          {/* Barra de ferramentas de busca e filtros */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Buscar projetos..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-300 transition-all duration-200 h-10" />
            </div>
            
            <Select value={sortBy} onValueChange={(value: 'date' | 'name' | 'area') => setSortBy(value)}>
              <SelectTrigger className="w-full sm:w-48 bg-gray-50 border-gray-200 hover:bg-white transition-all duration-200 h-10">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                <SelectItem value="date">Mais Recentes</SelectItem>
                <SelectItem value="name">Nome A-Z</SelectItem>
                <SelectItem value="area">Maior Área</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="w-full px-4 sm:px-4 lg:px-6">
        {/* Grid de projetos com visual cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {paginatedProjects.map(project => (
            <div key={project.id} className="relative group">
              <div className="rounded-2xl bg-white/90 dark:bg-zinc-900/80 shadow-sm ring-1 ring-black/5 dark:ring-white/5 p-3 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02]"
                   onClick={() => navigate(`/project/${project.id}`)}>
                
                {/* Área do preview */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
                  <div className="absolute inset-0 p-2">
                    <div className="h-full w-full rounded-xl overflow-hidden shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 dark:from-zinc-700 dark:to-zinc-800 flex items-center justify-center">
                      <div className="text-center p-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <FolderOpen className="h-6 w-6 text-white" />
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                          {project.file_path?.split('.').pop()?.toUpperCase() || 'PROJETO'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rodapé: ícone + título + menu */}
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 text-white">
                    <FolderOpen className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
                      {project.name}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {project.city && project.state ? `${project.city}, ${project.state}` : 'Localização não definida'}
                    </p>
                  </div>
                  
                  {/* Menu de ações - só ícone */}
                  <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" 
                       onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Implementar menu de contexto aqui
                      }}
                    >
                      <Filter className="h-4 w-4 text-zinc-500" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Paginação */}
        {totalPages > 1 && <div className="mt-8 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious onClick={() => handlePageChange(Math.max(1, currentPage - 1))} className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
                </PaginationItem>
                
                {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              return <PaginationItem key={page}>
                      <PaginationLink onClick={() => handlePageChange(page)} isActive={currentPage === page} className="cursor-pointer">
                        {page}
                      </PaginationLink>
                    </PaginationItem>;
            })}
                
                <PaginationItem>
                  <PaginationNext onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>}
        
        {filteredAndSortedProjects.length > PROJECTS_PER_PAGE && <div className="mt-4 text-center text-sm text-gray-500">
            Mostrando {startIndex + 1}-{Math.min(startIndex + PROJECTS_PER_PAGE, filteredAndSortedProjects.length)} de {filteredAndSortedProjects.length} projetos
          </div>}
      </CardContent>
    </Card>;
};
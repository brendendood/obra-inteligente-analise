import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProjectsGrid } from '@/components/projects/ProjectsGrid';
import { ProjectsFiltersBar } from '@/components/projects/ProjectsFiltersBar';
import { ProjectsStats } from '@/components/projects/ProjectsStats';
import { ProjectsEmptyState } from '@/components/projects/ProjectsEmptyState';
import { useDashboardData } from '@/hooks/useDashboardData';
import { EnhancedSkeleton } from '@/components/ui/enhanced-skeleton';
import { Button } from '@/components/ui/button';
import { Plus, Upload } from 'lucide-react';

export default function Projects() {
  const navigate = useNavigate();
  const { projects, isLoading } = useDashboardData();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'area' | 'date'>('date');
  const [showAnalyzedOnly, setShowAnalyzedOnly] = useState(false);

  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects.filter(project =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (showAnalyzedOnly) {
      filtered = filtered.filter(project => project.analysis_data);
    }

    return filtered.sort((a, b) => {
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
  }, [projects, searchTerm, sortBy, showAnalyzedOnly]);

  const handleSortChange = (value: string) => {
    setSortBy(value as 'name' | 'area' | 'date');
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <EnhancedSkeleton variant="text" className="h-8 w-64" />
            <EnhancedSkeleton variant="button" className="h-10 w-32" />
          </div>
          <EnhancedSkeleton variant="card" className="h-32" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <EnhancedSkeleton key={i} variant="card" className="h-48" />
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Meus Projetos</h1>
            <p className="text-gray-600 mt-1">Gerencie e analise seus projetos de construção</p>
          </div>
          
          <Button
            onClick={() => navigate('/upload')}
            className="bg-blue-600 hover:bg-blue-700 text-white h-10"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Projeto
          </Button>
        </div>

        {/* Stats */}
        <ProjectsStats projects={projects} />

        {projects.length === 0 ? (
          <ProjectsEmptyState />
        ) : (
          <>
            {/* Filters */}
            <ProjectsFiltersBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              sortBy={sortBy}
              onSortChange={handleSortChange}
              showAnalyzedOnly={showAnalyzedOnly}
              onShowAnalyzedOnlyChange={setShowAnalyzedOnly}
              totalProjects={projects.length}
              filteredCount={filteredAndSortedProjects.length}
            />

            {/* Projects Grid */}
            <ProjectsGrid projects={filteredAndSortedProjects} />
          </>
        )}
      </div>
    </AppLayout>
  );
}

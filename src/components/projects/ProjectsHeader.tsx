
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FolderOpen, Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProjectsHeaderProps {
  projectsCount: number;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const ProjectsHeader = ({ projectsCount, searchTerm, onSearchChange }: ProjectsHeaderProps) => {
  const navigate = useNavigate();

  return (
    <>
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
      {projectsCount > 0 && (
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Buscar projetos..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectsHeader;

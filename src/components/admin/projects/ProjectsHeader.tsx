
import { Button } from '@/components/ui/button';
import { FolderOpen, Plus, Download } from 'lucide-react';

interface ProjectsHeaderProps {
  totalProjects: number;
}

export const ProjectsHeader = ({ totalProjects }: ProjectsHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-50 rounded-lg">
          <FolderOpen className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Projetos</h1>
          <p className="text-gray-600 mt-1">{totalProjects} projetos registrados</p>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" disabled>
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
        <Button disabled>
          <Plus className="h-4 w-4 mr-2" />
          Novo Projeto
        </Button>
      </div>
    </div>
  );
};

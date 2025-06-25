
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, SortAsc } from 'lucide-react';

interface ProjectsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: 'name' | 'date' | 'area';
  onSortChange: (value: 'name' | 'date' | 'area') => void;
}

const ProjectsFilters = ({ searchTerm, onSearchChange, sortBy, onSortChange }: ProjectsFiltersProps) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 gap-4">
      <div className="flex flex-col sm:flex-row gap-4 flex-1">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar por nome ou tipo..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
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
            <DropdownMenuItem onClick={() => onSortChange('date')}>
              Data (mais recente)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange('name')}>
              Nome (A-Z)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange('area')}>
              Área (maior)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ProjectsFilters;

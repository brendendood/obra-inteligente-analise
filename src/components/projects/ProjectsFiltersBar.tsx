
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  Building2,
  BarChart3
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProjectsFiltersBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: 'name' | 'date' | 'area';
  onSortChange: (value: 'name' | 'date' | 'area') => void;
  totalProjects: number;
  analyzedProjects: number;
}

const ProjectsFiltersBar = ({ 
  searchTerm, 
  onSearchChange, 
  sortBy, 
  onSortChange,
  totalProjects,
  analyzedProjects
}: ProjectsFiltersBarProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 gap-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar projetos..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-300 transition-all duration-200"
            />
          </div>
          
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-full sm:w-48 bg-gray-50 border-gray-200 hover:bg-white transition-all duration-200">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg">
              <SelectItem value="date">Mais Recentes</SelectItem>
              <SelectItem value="name">Nome A-Z</SelectItem>
              <SelectItem value="area">Maior Área</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Building2 className="h-4 w-4" />
            <span>{totalProjects} projeto(s)</span>
          </div>
          <div className="flex items-center space-x-1">
            <BarChart3 className="h-4 w-4" />
            <span>{analyzedProjects} analisado(s)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsFiltersBar;

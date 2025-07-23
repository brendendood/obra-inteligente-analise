
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface ProjectsFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  filterType: string;
  setFilterType: (type: string) => void;
  onClearFilters: () => void;
}

export const ProjectsFilters = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filterType,
  setFilterType,
  onClearFilters
}: ProjectsFiltersProps) => {
  return (
    <div className="flex gap-4 items-center flex-wrap">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar projetos ou usuários..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Select value={filterStatus} onValueChange={setFilterStatus}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos status</SelectItem>
          <SelectItem value="draft">Rascunho</SelectItem>
          <SelectItem value="active">Ativo</SelectItem>
          <SelectItem value="completed">Concluído</SelectItem>
          <SelectItem value="archived">Arquivado</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filterType} onValueChange={setFilterType}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos tipos</SelectItem>
          <SelectItem value="residencial">Residencial</SelectItem>
          <SelectItem value="comercial">Comercial</SelectItem>
          <SelectItem value="industrial">Industrial</SelectItem>
        </SelectContent>
      </Select>

      {(searchTerm || filterStatus !== 'all' || filterType !== 'all') && (
        <Button variant="outline" onClick={onClearFilters}>
          <X className="h-4 w-4 mr-2" />
          Limpar Filtros
        </Button>
      )}
    </div>
  );
};


import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface UsersFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterPlan: string;
  setFilterPlan: (plan: string) => void;
  onClearFilters: () => void;
}

export const UsersFilters = ({
  searchTerm,
  setSearchTerm,
  filterPlan,
  setFilterPlan,
  onClearFilters
}: UsersFiltersProps) => {
  return (
    <div className="flex gap-4 items-center flex-wrap">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar por nome, empresa ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Select value={filterPlan} onValueChange={setFilterPlan}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Filtrar por plano" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os planos</SelectItem>
          <SelectItem value="free">Free</SelectItem>
          <SelectItem value="pro">Pro</SelectItem>
          <SelectItem value="enterprise">Enterprise</SelectItem>
        </SelectContent>
      </Select>

      {(searchTerm || filterPlan !== 'all') && (
        <Button variant="outline" onClick={onClearFilters}>
          <X className="h-4 w-4 mr-2" />
          Limpar Filtros
        </Button>
      )}
    </div>
  );
};

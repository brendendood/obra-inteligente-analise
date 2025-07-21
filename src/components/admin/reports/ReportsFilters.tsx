
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CalendarIcon, Filter, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ReportsFiltersProps {
  filters: {
    dateRange: {
      from: Date;
      to: Date;
    };
    userPlan: string;
    projectType: string;
    aiUsage: boolean;
  };
  onFiltersChange: (filters: any) => void;
}

export const ReportsFilters = ({ filters, onFiltersChange }: ReportsFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const handleDateRangeChange = (field: 'from' | 'to', date: Date | undefined) => {
    if (!date) return;
    
    onFiltersChange({
      dateRange: {
        ...filters.dateRange,
        [field]: date,
      },
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      dateRange: {
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        to: new Date(),
      },
      userPlan: '',
      projectType: '',
      aiUsage: false,
    });
  };

  const hasActiveFilters = filters.userPlan || filters.projectType || filters.aiUsage;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros de Relatório
          </CardTitle>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={clearFilters}
                className="flex items-center gap-1"
              >
                <X className="h-3 w-3" />
                Limpar
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
            </Button>
          </div>
        </div>
      </CardHeader>

      {showFilters && (
        <CardContent className="space-y-4">
          {/* Período */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data Inicial</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(filters.dateRange.from, 'PPP', { locale: ptBR })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateRange.from}
                    onSelect={(date) => handleDateRangeChange('from', date)}
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Data Final</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(filters.dateRange.to, 'PPP', { locale: ptBR })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateRange.to}
                    onSelect={(date) => handleDateRangeChange('to', date)}
                    disabled={(date) => date > new Date() || date < filters.dateRange.from}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Filtros adicionais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Plano do Usuário</Label>
              <Select 
                value={filters.userPlan} 
                onValueChange={(value) => onFiltersChange({ userPlan: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os planos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os planos</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tipo de Projeto</Label>
              <Select 
                value={filters.projectType} 
                onValueChange={(value) => onFiltersChange({ projectType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os tipos</SelectItem>
                  <SelectItem value="residential">Residencial</SelectItem>
                  <SelectItem value="commercial">Comercial</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Filtros Especiais</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="ai-usage"
                  checked={filters.aiUsage}
                  onCheckedChange={(checked) => onFiltersChange({ aiUsage: checked })}
                />
                <Label htmlFor="ai-usage">Apenas com uso de IA</Label>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

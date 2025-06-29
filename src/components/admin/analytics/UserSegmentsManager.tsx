
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Download, 
  RefreshCw, 
  Users, 
  Target, 
  AlertTriangle,
  Calendar,
  Filter
} from 'lucide-react';
import { useUserSegments } from '@/hooks/useUserSegments';

export const UserSegmentsManager = () => {
  const {
    segments,
    segmentStats,
    loading,
    filterSegment,
    setFilterSegment,
    exportSegmentsCSV,
    refreshSegments,
  } = useUserSegments();

  const getSegmentInfo = (segmentName: string) => {
    switch (segmentName) {
      case 'active_weekly':
        return {
          label: 'Ativo Semanal',
          icon: Users,
          color: 'bg-green-100 text-green-800',
          description: 'Usuário ativo nos últimos 7 dias'
        };
      case 'high_potential':
        return {
          label: 'Alto Potencial',
          icon: Target,
          color: 'bg-blue-100 text-blue-800',
          description: 'Usuário que usou IA e fez upload'
        };
      case 'stagnant':
        return {
          label: 'Estagnado',
          icon: AlertTriangle,
          color: 'bg-red-100 text-red-800',
          description: 'Sem atividade há mais de 7 dias'
        };
      default:
        return {
          label: segmentName,
          icon: Users,
          color: 'bg-gray-100 text-gray-800',
          description: 'Segmento personalizado'
        };
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando segmentos...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header e Stats */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Segmentos de Usuários</h2>
          <p className="text-gray-600 mt-1">Segmentação automática baseada no comportamento</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshSegments}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button onClick={() => exportSegmentsCSV()}>
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{segmentStats.total}</p>
              </div>
              <Users className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ativos</p>
                <p className="text-2xl font-bold text-green-600">{segmentStats.active_weekly}</p>
              </div>
              <Users className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Alto Potencial</p>
                <p className="text-2xl font-bold text-blue-600">{segmentStats.high_potential}</p>
              </div>
              <Target className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Estagnados</p>
                <p className="text-2xl font-bold text-red-600">{segmentStats.stagnant}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={filterSegment} onValueChange={setFilterSegment}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Todos os segmentos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os segmentos</SelectItem>
                <SelectItem value="active_weekly">Ativos Semanais</SelectItem>
                <SelectItem value="high_potential">Alto Potencial</SelectItem>
                <SelectItem value="stagnant">Estagnados</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              onClick={() => exportSegmentsCSV(filterSegment || undefined)}
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar Filtrado
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Segmentos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Segmentos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Segmento</TableHead>
                <TableHead>Dados</TableHead>
                <TableHead>Atualizado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {segments.map((segment) => {
                const segmentInfo = getSegmentInfo(segment.segment_name);
                const Icon = segmentInfo.icon;
                
                return (
                  <TableRow key={segment.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-sm">{segment.user_email}</div>
                        {segment.user_name && (
                          <div className="text-xs text-gray-500">{segment.user_name}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${segmentInfo.color} flex items-center gap-1 w-fit`}>
                        <Icon className="h-3 w-3" />
                        {segmentInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-gray-600 max-w-48 truncate">
                        {JSON.stringify(segment.segment_data)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        {new Date(segment.updated_at).toLocaleDateString('pt-BR')}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

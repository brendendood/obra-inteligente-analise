
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectActions } from './ProjectActions';
import { Building2, Calendar, MapPin, User } from 'lucide-react';

interface ProjectData {
  id: string;
  name: string;
  user_id: string;
  project_type: string;
  project_status: string;
  total_area: number;
  estimated_budget: number;
  city: string;
  state: string;
  created_at: string;
  updated_at: string;
  user_name?: string;
}

interface ProjectsTableProps {
  projects: ProjectData[];
  onUpdateStatus: (projectId: string, newStatus: string) => void;
  onDelete: (projectId: string) => void;
}

export const ProjectsTable = ({ projects, onUpdateStatus, onDelete }: ProjectsTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'residencial': return 'bg-purple-100 text-purple-800';
      case 'comercial': return 'bg-orange-100 text-orange-800';
      case 'industrial': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum projeto encontrado</h3>
          <p className="text-gray-500">
            Não há projetos que correspondam aos filtros aplicados.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Projetos</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Projeto</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Área</TableHead>
              <TableHead>Orçamento</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="font-medium">{project.name}</div>
                      <div className="text-sm text-gray-500">ID: {project.id.slice(0, 8)}...</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">
                      {project.user_name || project.user_id.slice(0, 8) + '...'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getTypeColor(project.project_type)}>
                    {project.project_type || 'N/A'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(project.project_status)}>
                    {project.project_status || 'draft'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {project.total_area ? `${project.total_area}m²` : 'N/A'}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium">
                    {project.estimated_budget ? formatCurrency(project.estimated_budget) : 'N/A'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm">
                    <MapPin className="h-3 w-3 text-gray-400" />
                    <span>{[project.city, project.state].filter(Boolean).join(', ') || 'N/A'}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Calendar className="h-3 w-3" />
                    {new Date(project.created_at).toLocaleDateString('pt-BR')}
                  </div>
                </TableCell>
                <TableCell>
                  <ProjectActions
                    project={project}
                    onUpdateStatus={onUpdateStatus}
                    onDelete={onDelete}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

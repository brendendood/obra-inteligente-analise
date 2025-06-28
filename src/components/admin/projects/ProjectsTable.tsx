
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, User, Building } from 'lucide-react';
import { ProjectActions } from './ProjectActions';

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

export const ProjectsTable = ({
  projects,
  onUpdateStatus,
  onDelete
}: ProjectsTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Projeto</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Área (m²)</TableHead>
              <TableHead>Orçamento</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead>Criado</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    {project.user_name}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {project.project_type || 'N/A'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(project.project_status || 'draft')}>
                    {project.project_status || 'draft'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {project.total_area ? `${project.total_area.toLocaleString()} m²` : 'N/A'}
                </TableCell>
                <TableCell>
                  {project.estimated_budget 
                    ? `R$ ${project.estimated_budget.toLocaleString()}`
                    : 'N/A'
                  }
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Building className="h-4 w-4 text-gray-400" />
                    {[project.city, project.state].filter(Boolean).join(', ') || 'N/A'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
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

        {projects.length === 0 && (
          <div className="text-center py-12">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum projeto encontrado com os filtros aplicados.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

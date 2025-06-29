
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Trash2, MapPin, Calendar, DollarSign, Building } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  user_id: string;
  city: string;
  state: string;
  project_type: string;
  project_status: string;
  total_area: number;
  estimated_budget: number;
  created_at: string;
  updated_at: string;
}

interface ProjectsTableProps {
  projects: Project[];
  onUpdateStatus: (projectId: string, newStatus: string) => Promise<void>;
  onDelete: (projectId: string) => Promise<void>;
}

export const ProjectsTable = ({ projects, onUpdateStatus, onDelete }: ProjectsTableProps) => {
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [deletingProject, setDeletingProject] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'residencial': return 'bg-blue-100 text-blue-800';
      case 'comercial': return 'bg-purple-100 text-purple-800';
      case 'industrial': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = async (projectId: string, newStatus: string) => {
    setUpdatingStatus(projectId);
    try {
      await onUpdateStatus(projectId, newStatus);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDelete = async (projectId: string) => {
    setDeletingProject(projectId);
    try {
      await onDelete(projectId);
    } finally {
      setDeletingProject(null);
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
          <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
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
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead>Área</TableHead>
              <TableHead>Orçamento</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  <div>
                    <p className="font-medium text-gray-900">{project.name}</p>
                    <p className="text-sm text-gray-500">ID: {project.id.slice(0, 8)}...</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getTypeColor(project.project_type)}>
                    {project.project_type || 'Não definido'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Select
                    value={project.project_status}
                    onValueChange={(value) => handleStatusUpdate(project.id, value)}
                    disabled={updatingStatus === project.id}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue>
                        <Badge className={getStatusColor(project.project_status)}>
                          {project.project_status}
                        </Badge>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="completed">Concluído</SelectItem>
                      <SelectItem value="archived">Arquivado</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{[project.city, project.state].filter(Boolean).join(', ') || 'Não informado'}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {project.total_area ? `${project.total_area.toLocaleString()} m²` : 'N/A'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span>
                      {project.estimated_budget ? formatCurrency(project.estimated_budget) : 'N/A'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(project.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" disabled>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          disabled={deletingProject === project.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir o projeto "{project.name}"? 
                            Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(project.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

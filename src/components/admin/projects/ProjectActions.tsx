
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2 } from 'lucide-react';

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

interface ProjectActionsProps {
  project: ProjectData;
  onUpdateStatus: (projectId: string, newStatus: string) => void;
  onDelete: (projectId: string) => void;
}

export const ProjectActions = ({
  project,
  onUpdateStatus,
  onDelete
}: ProjectActionsProps) => {
  return (
    <div className="flex gap-2">
      <Select
        value={project.project_status || 'draft'}
        onValueChange={(status) => onUpdateStatus(project.id, status)}
      >
        <SelectTrigger className="w-28">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="draft">Rascunho</SelectItem>
          <SelectItem value="active">Ativo</SelectItem>
          <SelectItem value="completed">Concluído</SelectItem>
          <SelectItem value="archived">Arquivado</SelectItem>
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onDelete(project.id)}
        className="text-red-600 hover:text-red-700"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

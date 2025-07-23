
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderOpen } from 'lucide-react';

interface ProjectsHeaderProps {
  totalProjects: number;
}

export const ProjectsHeader = ({ totalProjects }: ProjectsHeaderProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <FolderOpen className="h-6 w-6" />
          Gerenciamento de Projetos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-gray-600">
          Total de {totalProjects} projetos na plataforma
        </div>
      </CardContent>
    </Card>
  );
};

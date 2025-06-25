
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface ProjectInfoAlertProps {
  activeTab: string;
  projectName: string;
}

export const ProjectInfoAlert = ({ activeTab, projectName }: ProjectInfoAlertProps) => {
  if (activeTab !== 'visao-geral') return null;

  return (
    <Alert className="mb-6 border-blue-200 bg-blue-50">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-700">
        <strong>Projeto:</strong> {projectName} - Use as abas acima para acessar diferentes funcionalidades deste projeto específico.
      </AlertDescription>
    </Alert>
  );
};


import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Trash2, AlertTriangle } from 'lucide-react';

interface ProjectDeleteDialogProps {
  project: any;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ProjectDeleteDialog = ({ project, isOpen, onClose, onConfirm }: ProjectDeleteDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <AlertDialogTitle className="text-lg">Confirmar exclusão</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-gray-600">
            Tem certeza que deseja excluir o projeto <strong>"{project?.name}"</strong>? 
            <br /><br />
            <span className="text-red-600 font-medium">Esta ação é irreversível</span> e todos os dados relacionados serão perdidos permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel className="border-gray-300 hover:bg-gray-50">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir Projeto
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ProjectDeleteDialog;

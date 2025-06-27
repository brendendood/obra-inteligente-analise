
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
import { Project } from '@/types/project';
import { Trash2 } from 'lucide-react';

interface ProjectDeleteConfirmDialogProps {
  project: Project | null;
  isOpen: boolean;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ProjectDeleteConfirmDialog = ({
  project,
  isOpen,
  isDeleting,
  onConfirm,
  onCancel,
}: ProjectDeleteConfirmDialogProps) => {
  if (!project) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onCancel}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <AlertDialogTitle className="text-lg font-semibold text-gray-900">
                Confirmar exclusão
              </AlertDialogTitle>
            </div>
          </div>
          <AlertDialogDescription className="text-gray-600 mt-3">
            Tem certeza que deseja excluir o projeto{' '}
            <span className="font-semibold text-gray-900">"{project.name}"</span>?
            <br />
            <br />
            <span className="text-red-600 font-medium">
              Esta ação não pode ser desfeita e todos os dados relacionados serão perdidos.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel 
            onClick={onCancel}
            disabled={isDeleting}
            className="border-gray-300 hover:bg-gray-50"
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? 'Excluindo...' : 'Excluir Projeto'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

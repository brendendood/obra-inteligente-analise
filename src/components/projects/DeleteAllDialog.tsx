
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

interface DeleteAllDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  projectCount: number;
}

const DeleteAllDialog = ({ isOpen, onClose, onConfirm, projectCount }: DeleteAllDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <AlertDialogTitle className="text-lg text-red-800">
              Excluir todos os projetos
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-gray-600">
            Deseja excluir <strong>todos os {projectCount} projetos</strong> da sua conta?
            <br /><br />
            <span className="text-red-600 font-medium">
              Esta ação removerá permanentemente todos os dados associados
            </span> e não pode ser desfeita.
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
            Excluir Todos os Projetos
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAllDialog;

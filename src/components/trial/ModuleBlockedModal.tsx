import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ModuleBlockedModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleName?: string;
}

export const ModuleBlockedModal = ({
  isOpen,
  onClose,
  moduleName = 'Este módulo',
}: ModuleBlockedModalProps) => {
  const navigate = useNavigate();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-warning" />
            <DialogTitle>Conteúdo Bloqueado</DialogTitle>
          </div>
          <DialogDescription>
            {moduleName} está disponível apenas em planos pagos.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose}>
            Voltar
          </Button>
          <Button onClick={() => navigate('/selecionar-plano')}>
            Ver Planos
          </Button>
          <Button variant="secondary" onClick={() => navigate('/account/billing')}>
            Gerenciar Assinatura
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

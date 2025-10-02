import { useEffect, useState } from 'react';
import { useFeatureAccess } from '@/hooks/use-feature-access';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface UploadGuardProps {
  onCanUpload: (canUpload: boolean) => void;
}

export const UploadGuard = ({ onCanUpload }: UploadGuardProps) => {
  const { canUploadProject } = useFeatureAccess();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkUploadPermission = async () => {
      const canUpload = await canUploadProject();
      
      if (!canUpload) {
        toast({
          title: 'Limite atingido',
          description: 'No Teste Grátis você só pode enviar 1 projeto. Assine um plano para continuar.',
          variant: 'destructive',
          duration: 8000,
        });
        
        setTimeout(() => {
          navigate('/selecionar-plano');
        }, 2000);
      }
      
      onCanUpload(canUpload);
      setChecking(false);
    };

    checkUploadPermission();
  }, [canUploadProject, onCanUpload, toast, navigate]);

  return null;
};

import React, { useState, useEffect } from 'react';
import { useFeatureAccess } from '@/hooks/use-feature-access';
import { ModuleBlockedModal } from '@/components/trial/ModuleBlockedModal';
import { PageConstructionLoading } from '@/components/ui/construction-loading';

type Module = 'orcamento' | 'cronograma' | 'assistente' | 'documentos' | 'ia' | 'crm';

interface ModuleGuardProps {
  module: Module;
  moduleName: string;
  children: React.ReactNode;
}

export const ModuleGuard: React.FC<ModuleGuardProps> = ({
  module,
  moduleName,
  children,
}) => {
  const { canAccessModule, loading } = useFeatureAccess();
  const [showModal, setShowModal] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (!loading) {
      const access = canAccessModule(module);
      setHasAccess(access);
      if (!access) {
        setShowModal(true);
      }
    }
  }, [loading, module, canAccessModule]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <PageConstructionLoading text="Verificando permissões..." />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <ModuleBlockedModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        moduleName={moduleName}
      />
    );
  }

  return <>{children}</>;
};

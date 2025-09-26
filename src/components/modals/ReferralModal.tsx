import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ReferralLinkGenerator } from '@/components/referral/ReferralLinkGenerator';

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReferralModal = ({ isOpen, onClose }: ReferralModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Sistema de Indicações</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <ReferralLinkGenerator />
        </div>
      </DialogContent>
    </Dialog>
  );
};
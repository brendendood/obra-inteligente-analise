"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PremiumBlockerProps {
  isOpen?: boolean;
  onClose?: () => void;
  featureName?: string;
  hasPermission?: boolean;
  onUpgrade?: () => void;
}

const PremiumBlocker: React.FC<PremiumBlockerProps> = ({
  isOpen = false,
  onClose = () => {},
  featureName = "este recurso",
  hasPermission = false,
  onUpgrade = () => {},
}) => {
  if (hasPermission) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-md"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
              className="relative w-full max-w-sm"
            >
              <div className="relative overflow-hidden rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl">
                <div className="px-6 py-8 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                    <Lock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Acesso Restrito
                  </h2>
                  <p className="mb-6 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {featureName} requer plano pago. Faça upgrade.
                  </p>
                  <div className="space-y-2">
                    <Button
                      onClick={onUpgrade}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium"
                    >
                      Atualizar Plano
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={onClose}
                      className="w-full text-gray-500 dark:text-gray-400"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PremiumBlocker;
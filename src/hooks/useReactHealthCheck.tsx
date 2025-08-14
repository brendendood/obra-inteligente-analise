import React, { useEffect, useRef, useState } from 'react';

/**
 * Hook de verificação de saúde do React
 * Detecta se React e hooks estão funcionando corretamente
 */
export const useReactHealthCheck = () => {
  const healthStatus = useRef({ isHealthy: true, error: null });

  useEffect(() => {
    try {
      // Teste básico se React está disponível
      if (!React || typeof React !== 'object') {
        throw new Error('React object not available');
      }

      // Teste se hooks essenciais existem
      if (!useEffect || !useState || !useRef) {
        throw new Error('React hooks not available');
      }

      healthStatus.current = { isHealthy: true, error: null };
    } catch (error) {
      console.error('🔴 REACT HEALTH CHECK FAILED:', error);
      healthStatus.current = { 
        isHealthy: false, 
        error: error instanceof Error ? error.message : 'Unknown React error' 
      };
    }
  }, []);

  return healthStatus.current;
};

/**
 * Verificação de saúde estática (sem hooks)
 * Para usar antes de qualquer hook
 */
export const checkReactHealthStatic = (): { isHealthy: boolean; error?: string } => {
  try {
    // Verificação básica se React existe
    if (typeof React === 'undefined' || !React) {
      return { isHealthy: false, error: 'React object not found' };
    }
    
    // Verificação se métodos essenciais existem
    if (!useState || !useEffect || !React.createContext) {
      return { isHealthy: false, error: 'React hooks/methods not available' };
    }
    
    return { isHealthy: true };
  } catch (error) {
    return { 
      isHealthy: false, 
      error: error instanceof Error ? error.message : 'Unknown React error' 
    };
  }
};
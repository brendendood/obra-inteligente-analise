import { useEffect, useState, useRef } from 'react';
import { useOptimizedProjectStore } from '@/stores/optimizedProjectStore';
import { useAuth } from '@/contexts/AuthProvider';

export const ProjectLoopTest = () => {
  const [renderCount, setRenderCount] = useState(0);
  const lastRenderTimeRef = useRef(Date.now());
  const { projects, isLoading } = useOptimizedProjectStore();
  const { user, loading: authLoading } = useAuth();

  // Contar renders para detectar loops
  useEffect(() => {
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTimeRef.current;
    
    setRenderCount(prev => prev + 1);
    lastRenderTimeRef.current = now;
    
    console.log('🔍 LOOP TEST: Render #', renderCount + 1, 'tempo desde último:', timeSinceLastRender + 'ms');
    console.log('🔍 LOOP TEST: Estado atual:', { 
      projects: projects.length, 
      isLoading, 
      authLoading,
      hasUser: !!user 
    });
    
    // Se renderizar mais de 20 vezes em 5 segundos, há loop
    if (renderCount > 20) {
      console.error('❌ LOOP DETECTADO: Mais de 20 renders');
      console.trace('Stack trace do loop');
    }
  });

  // Reset contador após 5 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('✅ LOOP TEST: Reset contador');
      setRenderCount(0);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      top: 10, 
      right: 10, 
      background: 'rgba(0,0,0,0.9)', 
      color: 'white', 
      padding: '10px',
      borderRadius: '5px',
      fontSize: '11px',
      zIndex: 9999,
      maxWidth: '200px'
    }}>
      <div>Renders: {renderCount}</div>
      <div>Projetos: {projects.length}</div>
      <div>Store Loading: {isLoading ? 'SIM' : 'NÃO'}</div>
      <div>Auth Loading: {authLoading ? 'SIM' : 'NÃO'}</div>
      <div>Usuário: {user ? 'SIM' : 'NÃO'}</div>
      <div style={{ 
        color: renderCount > 20 ? 'red' : renderCount > 10 ? 'orange' : 'green',
        fontWeight: 'bold'
      }}>
        {renderCount > 20 ? '❌ LOOP CRÍTICO!' : renderCount > 10 ? '⚠️ MUITOS RENDERS' : '✅ OK'}
      </div>
    </div>
  );
};
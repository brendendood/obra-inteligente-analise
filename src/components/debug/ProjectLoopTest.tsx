import { useEffect, useState } from 'react';
import { useOptimizedProjectStore } from '@/stores/optimizedProjectStore';

export const ProjectLoopTest = () => {
  const [renderCount, setRenderCount] = useState(0);
  const { projects } = useOptimizedProjectStore();

  // Contar renders para detectar loops
  useEffect(() => {
    setRenderCount(prev => prev + 1);
    console.log('🔍 LOOP TEST: Render #', renderCount + 1);
    
    // Se renderizar mais de 10 vezes em 5 segundos, há loop
    if (renderCount > 10) {
      console.error('❌ LOOP DETECTADO: Mais de 10 renders');
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
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999
    }}>
      <div>Renders: {renderCount}</div>
      <div>Projetos: {projects.length}</div>
      <div style={{ color: renderCount > 10 ? 'red' : 'green' }}>
        {renderCount > 10 ? '❌ LOOP!' : '✅ OK'}
      </div>
    </div>
  );
};
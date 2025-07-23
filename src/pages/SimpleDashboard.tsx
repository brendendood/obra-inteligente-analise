import React from 'react';
import { useAuth } from '@/hooks/useAuth';

// DASHBOARD ULTRA-SIMPLES PARA TESTAR LOOPS
const Dashboard = () => {
  console.log('📊 DASHBOARD: Renderizado (versão simples)');
  
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Carregando...</h1>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Não autenticado</h1>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>🏠 Dashboard Simples</h1>
      <p>Usuário: {user?.email}</p>
      <p>Status: Autenticado ✅</p>
      
      {/* DEBUG INFO */}
      <div style={{ 
        position: 'fixed', 
        top: 60, 
        right: 10, 
        background: 'orange', 
        color: 'white', 
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px'
      }}>
        <div>DASHBOARD SIMPLES</div>
        <div>Se não há loop = Dashboard OK</div>
      </div>
    </div>
  );
};

export default Dashboard;
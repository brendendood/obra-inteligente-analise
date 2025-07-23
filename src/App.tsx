import React from 'react';

// TESTE RADICAL - APP MÍNIMO PARA DETECTAR FONTE DO LOOP
const App = () => {
  console.log('🔥 APP: Renderizado');
  
  return (
    <div style={{ padding: '20px', background: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ color: 'red' }}>🚨 DEBUG MODE - Testing Loop</h1>
      <p>Se você vê esta mensagem SEM loop, o problema está nos contextos.</p>
      <p>Se AINDA houver loop, o problema está no React/Vite/outro lugar.</p>
      
      <div style={{ 
        position: 'fixed', 
        top: 10, 
        right: 10, 
        background: 'black', 
        color: 'white', 
        padding: '10px',
        borderRadius: '5px'
      }}>
        <div>Teste do Loop</div>
        <div>Veja o console!</div>
      </div>
    </div>
  );
};

export default App;
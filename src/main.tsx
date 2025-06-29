
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('🚀 MAIN: Iniciando aplicação...');

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error('❌ MAIN: Elemento root não encontrado!');
  throw new Error('Root element not found');
}

console.log('✅ MAIN: Elemento root encontrado, criando app...');

try {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  console.log('✅ MAIN: App renderizado com sucesso!');
} catch (error) {
  console.error('💥 MAIN: Erro crítico ao renderizar app:', error);
  throw error;
}

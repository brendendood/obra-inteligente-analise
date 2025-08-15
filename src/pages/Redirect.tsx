import { useEffect } from 'react';

const Redirect = () => {
  useEffect(() => {
    // Captura a URL completa incluindo query strings e fragmentos
    const currentUrl = window.location.href;
    const urlParams = currentUrl.split('/v')[1] || '';
    
    // Constrói a nova URL preservando todos os parâmetros
    const newUrl = `${window.location.origin}/auth/callback${urlParams}`;
    
    // Redireciona preservando fragmentos
    window.location.href = newUrl;
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecionando...</p>
      </div>
    </div>
  );
};

export default Redirect;
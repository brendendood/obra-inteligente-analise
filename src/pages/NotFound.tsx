
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-[#1a1a1a] border-[#333] text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto mb-4 text-6xl">🏗️</div>
          <CardTitle className="text-3xl font-bold text-white mb-2">
            Página não encontrada
          </CardTitle>
          <p className="text-gray-400">
            A página que você está procurando não existe ou foi movida.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-[#333] rounded-lg p-4 mb-6">
            <p className="text-lg font-bold text-red-400 mb-2">Erro 404</p>
            <p className="text-sm text-gray-300">
              URL não encontrada no sistema ArchiAI
            </p>
          </div>
          
          <div className="space-y-3">
            <Button
              onClick={() => navigate('/')}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Home className="h-4 w-4 mr-2" />
              Ir para Página Inicial
            </Button>
            
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="w-full border-[#333] text-gray-300 hover:bg-[#333]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar à Página Anterior
            </Button>
            
            <Button
              onClick={() => navigate('/obras')}
              variant="ghost"
              className="w-full text-gray-400 hover:text-white hover:bg-[#333]"
            >
              <Search className="h-4 w-4 mr-2" />
              Ver Todos os Projetos
            </Button>
          </div>
          
          <div className="mt-6 pt-4 border-t border-[#333]">
            <p className="text-xs text-gray-500">
              Se você acredita que isso é um erro, entre em contato conosco.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;

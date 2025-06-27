
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UploadSuccessProps {
  projectName: string;
}

const UploadSuccess = ({ projectName }: UploadSuccessProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('✅ UPLOAD SUCCESS: Iniciando contagem regressiva para redirecionamento');
    
    // Redirecionar para lista de projetos após 3 segundos
    const timer = setTimeout(() => {
      console.log('📍 UPLOAD SUCCESS: Redirecionando para /projetos');
      navigate('/projetos', { replace: true });
    }, 3000);

    return () => {
      console.log('🔄 UPLOAD SUCCESS: Limpando timer');
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className="text-center space-y-8 py-8">
      <div className="relative">
        <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
        <CheckCircle className="h-24 w-24 text-green-600 mx-auto relative" />
      </div>
      
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <h3 className="text-2xl font-bold text-green-800 mb-3">
            🎉 Projeto Processado com Sucesso!
          </h3>
          <p className="text-green-700 text-lg font-medium mb-2">
            "{projectName}"
          </p>
          <p className="text-green-600">
            Projeto salvo e pronto para uso. Redirecionando...
          </p>
        </div>
        
        <div className="flex items-center justify-center space-x-2 text-blue-600">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span className="font-medium">Carregando seus projetos</span>
          <ArrowRight className="h-4 w-4 animate-pulse" />
        </div>
        
        <div className="text-sm text-gray-500">
          Você será redirecionado automaticamente em 3 segundos...
        </div>
      </div>
    </div>
  );
};

export default UploadSuccess;

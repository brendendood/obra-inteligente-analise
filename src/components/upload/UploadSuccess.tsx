
import { CheckCircle, ArrowRight } from 'lucide-react';

interface UploadSuccessProps {
  projectName: string;
}

const UploadSuccess = ({ projectName }: UploadSuccessProps) => {
  return (
    <div className="text-center space-y-8 py-8">
      <div className="relative">
        <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
        <CheckCircle className="h-24 w-24 text-green-600 mx-auto relative" />
      </div>
      
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <h3 className="text-2xl font-bold text-green-800 mb-3">
            🎉 Projeto Analisado com Sucesso!
          </h3>
          <p className="text-green-700 text-lg font-medium mb-2">
            "{projectName}"
          </p>
          <p className="text-green-600">
            Análise concluída com IA. Redirecionando para o projeto...
          </p>
        </div>
        
        <div className="flex items-center justify-center space-x-2 text-blue-600">
          <div className="animate-hammer">
            <Hammer className="h-5 w-5 text-orange-500" />
          </div>
          <span className="font-medium">Carregando projeto</span>
          <ArrowRight className="h-4 w-4 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default UploadSuccess;

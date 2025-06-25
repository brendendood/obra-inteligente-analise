
import { CheckCircle } from 'lucide-react';

interface UploadSuccessProps {
  projectName: string;
}

const UploadSuccess = ({ projectName }: UploadSuccessProps) => {
  return (
    <div className="text-center space-y-6">
      <CheckCircle className="h-20 w-20 text-green-600 mx-auto" />
      <div>
        <h3 className="text-2xl font-bold text-green-800 mb-2">
          Projeto "{projectName}" Analisado com Sucesso!
        </h3>
        <p className="text-green-700 text-lg">
          Redirecionando para o painel...
        </p>
      </div>
    </div>
  );
};

export default UploadSuccess;

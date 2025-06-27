
import { CheckCircle, FolderOpen, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface UploadSuccessProps {
  projectName: string;
}

const UploadSuccess = ({ projectName }: UploadSuccessProps) => {
  const navigate = useNavigate();

  const handleViewProjects = () => {
    navigate('/projetos');
  };

  return (
    <div className="text-center py-8 animate-fade-in">
      <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        Upload Concluído!
      </h3>
      
      <p className="text-gray-600 mb-2">
        <strong>{projectName}</strong> foi analisado com sucesso.
      </p>
      
      <p className="text-sm text-gray-500 mb-8">
        Você será redirecionado para a lista de projetos em alguns segundos...
      </p>
      
      <div className="space-y-3">
        <Button 
          onClick={handleViewProjects}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          size="lg"
        >
          <FolderOpen className="h-5 w-5 mr-2" />
          Ver Meus Projetos
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default UploadSuccess;

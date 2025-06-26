
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Folder } from 'lucide-react';

export const EmptyProjectsState = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center py-12">
      <Folder className="h-12 w-12 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum projeto ainda</h3>
      <p className="text-gray-500 mb-6">Comece criando seu primeiro projeto.</p>
      <Button 
        onClick={() => navigate('/upload')}
        className="bg-blue-600 hover:bg-blue-700"
      >
        + Novo Projeto
      </Button>
    </div>
  );
};

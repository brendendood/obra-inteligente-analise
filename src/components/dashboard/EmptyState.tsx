
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';

export const EmptyState = () => {
  const navigate = useNavigate();

  return (
    <Card className="border-0 shadow-lg text-center py-12">
      <CardContent>
        <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-700 mb-2">
          Nenhum projeto encontrado
        </h3>
        <p className="text-gray-500 mb-6">
          Comece enviando seu primeiro projeto
        </p>
        <Button 
          onClick={() => navigate('/upload')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Enviar Primeiro Projeto
        </Button>
      </CardContent>
    </Card>
  );
};


import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Plus, FileImage } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProjectsEmptyState = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[400px] sm:min-h-[500px]">
      <Card className="max-w-md mx-auto bg-white border border-gray-200 shadow-sm">
        <CardContent className="p-8 sm:p-12 text-center">
          <div className="space-y-6">
            {/* Ícone */}
            <div className="flex justify-center">
              <div className="p-4 bg-blue-50 rounded-full">
                <FileImage className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            {/* Título e Descrição */}
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-900">
                Nenhum projeto encontrado
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Comece criando seu primeiro projeto. Faça upload das plantas e deixe nossa IA analisar para você.
              </p>
            </div>

            {/* Botões de Ação */}
            <div className="space-y-3 pt-4">
              <Button
                onClick={() => navigate('/upload')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Projeto
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate('/upload')}
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 h-10 font-medium rounded-lg transition-all duration-200"
              >
                <Upload className="h-4 w-4 mr-2" />
                Fazer Upload
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectsEmptyState;

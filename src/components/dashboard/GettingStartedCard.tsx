
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GettingStartedCard = () => {
  const navigate = useNavigate();

  return (
    <Card className="glass-card dark:bg-[#1a1a1a] dark:border-[#333] bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-900 dark:to-indigo-900 text-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center text-white">
          <Plus className="h-6 w-6 mr-3" />
          Começar Primeiro Projeto
        </CardTitle>
        <CardDescription className="text-blue-100 dark:text-blue-200">
          Envie seu primeiro projeto e veja a IA em ação
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-blue-50 dark:text-blue-100">
            Você ainda não tem projetos. Comece enviando um arquivo PDF para análise 
            automática com nossa IA especializada.
          </p>
          <Button 
            onClick={() => navigate('/upload')}
            className="bg-white text-blue-600 hover:bg-blue-50 font-semibold dark:bg-white dark:text-blue-600 dark:hover:bg-gray-100"
          >
            <Upload className="h-4 w-4 mr-2" />
            Enviar Primeiro Projeto
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GettingStartedCard;

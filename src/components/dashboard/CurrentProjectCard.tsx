
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Project } from '@/types/project';

interface CurrentProjectCardProps {
  currentProject: Project;
}

const CurrentProjectCard = ({ currentProject }: CurrentProjectCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="mb-8 glass-card card-hover dark:bg-[#1a1a1a] dark:border-[#333] bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-green-800 dark:text-green-400 flex items-center">
          <CheckCircle className="h-6 w-6 mr-3 text-green-600 dark:text-green-400" />
          Projeto Ativo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-lg font-bold text-green-900 dark:text-green-300">{currentProject.name}</p>
            <p className="text-green-700 dark:text-green-400">
              {currentProject.total_area ? `Área: ${currentProject.total_area}m² • ` : ''}
              Tipo: {currentProject.project_type}
            </p>
            <p className="text-sm text-green-600 dark:text-green-400">
              Analisado em {new Date(currentProject.created_at).toLocaleDateString('pt-BR')}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded-full text-xs">
              ✅ Processado
            </span>
            <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded-full text-xs">
              📊 Analisado
            </span>
            <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded-full text-xs">
              🤖 IA contextualizada
            </span>
          </div>
          <Button 
            onClick={() => navigate(`/obra/${currentProject.id}`)}
            className="bg-green-600 hover:bg-green-700 text-white dark:bg-green-600 dark:hover:bg-green-500"
          >
            Ver Detalhes da Obra
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentProjectCard;

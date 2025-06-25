
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Bot } from 'lucide-react';

interface ExistingProjectCardProps {
  project: any;
  onAnalyze: () => void;
}

const ExistingProjectCard = ({ project, onAnalyze }: ExistingProjectCardProps) => {
  if (!project) return null;

  return (
    <Card className="mb-8 shadow-xl border-0 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-green-800 flex items-center">
          <CheckCircle className="h-6 w-6 mr-3 text-green-600" />
          Projeto Ativo Encontrado
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-green-900 mb-1">{project.name}</p>
            <p className="text-green-700 mb-2">
              {project.total_area ? `${project.total_area}m² • ` : ''}
              {project.project_type}
            </p>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-100 text-green-800">✅ Processado</Badge>
              <Badge className="bg-green-100 text-green-800">🤖 IA Pronta</Badge>
            </div>
          </div>
          <Button 
            onClick={onAnalyze}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 text-lg"
          >
            <Bot className="h-5 w-5 mr-2" />
            Analisar com IA
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExistingProjectCard;

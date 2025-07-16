
import { Button } from '@/components/ui/button';
import { Calendar, Download, RefreshCw, TrendingUp, Hammer } from 'lucide-react';

interface ScheduleHeaderProps {
  projectName: string;
  projectArea: number;
  isGenerating: boolean;
  hasScheduleData: boolean;
  onGenerate: () => void;
  onSimulate: () => void;
  onExport: () => void;
}

export const ScheduleHeader = ({
  projectName,
  projectArea,
  isGenerating,
  hasScheduleData,
  onGenerate,
  onSimulate,
  onExport
}: ScheduleHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cronograma Físico-Financeiro</h1>
        <p className="text-gray-600">
          Timeline baseada na lógica temporal consensual para {projectName} ({projectArea}m²)
        </p>
      </div>
      
      <div className="flex space-x-3">
        <Button
          onClick={onGenerate}
          disabled={isGenerating}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isGenerating ? (
            <>
              <div className="animate-hammer mr-2">
                <Hammer className="h-4 w-4 text-orange-500" />
              </div>
              Gerando...
            </>
          ) : (
            <>
              <Calendar className="h-4 w-4 mr-2" />
              Gerar com IA
            </>
          )}
        </Button>
        
        {hasScheduleData && (
          <>
            <Button variant="outline" onClick={onSimulate}>
              <TrendingUp className="h-4 w-4 mr-2" />
              Simular Cenário
            </Button>
            
            <Button variant="outline" onClick={onExport}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

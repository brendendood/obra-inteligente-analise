
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
    <div className="space-y-4">
      {/* Header content for mobile/desktop */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
            Cronograma Físico-Financeiro
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Timeline para <span className="font-medium">{projectName}</span> ({projectArea}m²)
          </p>
        </div>
        
        {/* Action buttons - responsive layout */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button
            onClick={onGenerate}
            disabled={isGenerating}
            className="bg-blue-600 hover:bg-blue-700 h-10 sm:h-auto"
          >
            {isGenerating ? (
              <>
                <div className="animate-hammer mr-2">
                  <Hammer className="h-4 w-4 text-orange-500" />
                </div>
                <span className="text-sm">Gerando...</span>
              </>
            ) : (
              <>
                <Calendar className="h-4 w-4 mr-2" />
                <span className="text-sm">Gerar com IA</span>
              </>
            )}
          </Button>
          
          {hasScheduleData && (
            <div className="flex gap-2 sm:gap-3">
              <Button 
                variant="outline" 
                onClick={onSimulate}
                className="flex-1 sm:flex-none h-10 sm:h-auto"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                <span className="text-sm">Simular</span>
              </Button>
              
              <Button 
                variant="outline" 
                onClick={onExport}
                className="flex-1 sm:flex-none h-10 sm:h-auto"
              >
                <Download className="h-4 w-4 mr-2" />
                <span className="text-sm">Exportar</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

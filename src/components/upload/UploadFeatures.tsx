
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Clock, BarChart3 } from 'lucide-react';

const UploadFeatures = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-2xl w-fit">
            <Bot className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-lg">Análise Inteligente</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600">
            IA especializada extrai informações técnicas e identifica padrões arquitetônicos
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <div className="bg-gradient-to-br from-green-100 to-green-200 p-3 rounded-2xl w-fit">
            <Clock className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-lg">Processamento Rápido</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600">
            Análise completa em segundos, economizando horas de trabalho manual
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-3 rounded-2xl w-fit">
            <BarChart3 className="h-6 w-6 text-purple-600" />
          </div>
          <CardTitle className="text-lg">Relatórios Detalhados</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600">
            Orçamentos automáticos, cronogramas e análises técnicas precisas
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadFeatures;

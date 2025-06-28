
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database } from 'lucide-react';

export const AdminSystemStatus = () => {
  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="h-5 w-5 text-green-600" />
          <span>Status do Sistema</span>
        </CardTitle>
        <CardDescription>
          Monitoramento em tempo real
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-slate-600">API Status:</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-600 font-medium text-sm">Online</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-600">Banco de Dados:</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-600 font-medium text-sm">Conectado</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-600">IA Service:</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-600 font-medium text-sm">Ativo</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-600">Storage:</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-600 font-medium text-sm">Disponível</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

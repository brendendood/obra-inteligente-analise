
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

const AdminQuickStats = () => {
  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-indigo-600" />
          <span>Métricas Rápidas</span>
        </CardTitle>
        <CardDescription>
          Indicadores de performance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-slate-600">Taxa de Conversão:</span>
          <span className="text-green-600 font-bold">68%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-600">Tempo Médio Análise:</span>
          <span className="text-blue-600 font-bold">2.3s</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-600">Taxa de E-mails:</span>
          <span className="text-green-600 font-bold">98.5%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-600">Uptime Sistema:</span>
          <span className="text-green-600 font-bold">99.9%</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminQuickStats;

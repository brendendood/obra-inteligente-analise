
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, UserCheck, FileText, Mail } from 'lucide-react';

const AdminRecentActivity = () => {
  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-purple-600" />
          <span>Atividade Recente</span>
        </CardTitle>
        <CardDescription>
          Últimas ações na plataforma
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded-lg">
          <UserCheck className="h-4 w-4 text-blue-600" />
          <div className="text-sm">
            <p className="text-slate-700">Novo usuário registrado</p>
            <p className="text-slate-500 text-xs">há 2 minutos</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 p-2 bg-green-50 rounded-lg">
          <FileText className="h-4 w-4 text-green-600" />
          <div className="text-sm">
            <p className="text-slate-700">Projeto analisado com IA</p>
            <p className="text-slate-500 text-xs">há 5 minutos</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 p-2 bg-orange-50 rounded-lg">
          <Mail className="h-4 w-4 text-orange-600" />
          <div className="text-sm">
            <p className="text-slate-700">E-mail de boas-vindas enviado</p>
            <p className="text-slate-500 text-xs">há 10 minutos</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminRecentActivity;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield, RefreshCw, Download } from 'lucide-react';

interface AdminHeaderProps {
  userEmail?: string;
  onRefreshStats: () => void;
  onExportData: () => void;
}

const AdminHeader = ({ userEmail, onRefreshStats, onExportData }: AdminHeaderProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-r from-red-600 to-pink-600 p-3 rounded-xl shadow-lg">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Painel Administrativo
            </h1>
            <p className="text-slate-600">
              Bem-vindo, {userEmail?.split('@')[0]}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            onClick={onRefreshStats} 
            variant="outline" 
            size="sm"
            className="flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Atualizar</span>
          </Button>
          <Button 
            onClick={onExportData}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Exportar</span>
          </Button>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4">
        <div className="flex items-center space-x-3">
          <Shield className="h-5 w-5 text-red-600" />
          <div>
            <span className="text-red-800 font-medium">Área Administrativa</span>
            <p className="text-red-700 text-sm mt-1">
              Acesso restrito para gestão e monitoramento da plataforma ArqFlow.IA
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;

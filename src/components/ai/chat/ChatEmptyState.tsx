
import { Bot } from 'lucide-react';

export const ChatEmptyState = () => {
  return (
    <div className="text-center py-8 px-4">
      <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Bot className="h-8 w-8 text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        🏗️ Consultor Especializado em Engenharia Civil
      </h3>
      <p className="text-gray-600 max-w-lg mx-auto mb-6 text-sm leading-relaxed">
        Sou seu <strong>Engenheiro Civil e Arquiteto</strong> especializado. Posso orientar sobre:
      </p>
      
      <div className="grid grid-cols-2 gap-3 max-w-md mx-auto text-xs text-left">
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
          <div className="font-medium text-blue-800 mb-1">🏢 Estruturas & Fundações</div>
          <div className="text-blue-600">Dimensionamento, NBR 6118, cálculos</div>
        </div>
        
        <div className="bg-green-50 p-3 rounded-lg border border-green-100">
          <div className="font-medium text-green-800 mb-1">💰 Orçamentação</div>
          <div className="text-green-600">Custos, composições, cronogramas</div>
        </div>
        
        <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
          <div className="font-medium text-amber-800 mb-1">🧱 Materiais & Técnicas</div>
          <div className="text-amber-600">Especificações, qualidade, NBRs</div>
        </div>
        
        <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
          <div className="font-medium text-purple-800 mb-1">📋 Normas & Códigos</div>
          <div className="text-purple-600">ABNT, legislação, aprovações</div>
        </div>
      </div>
      
      <p className="text-xs text-gray-500 mt-4 italic">
        Registrado no CRA/CREA • Atualizado com normas brasileiras 2024
      </p>
    </div>
  );
};

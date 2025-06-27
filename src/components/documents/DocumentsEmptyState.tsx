
import React from 'react';
import { FileText } from 'lucide-react';

const DocumentsEmptyState = () => {
  return (
    <div className="text-center py-12">
      <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <FileText className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Nenhum documento ainda
      </h3>
      <p className="text-gray-600 max-w-sm mx-auto">
        Comece fazendo upload dos documentos técnicos do seu projeto nas categorias acima.
      </p>
    </div>
  );
};

export default DocumentsEmptyState;

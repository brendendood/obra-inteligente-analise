
import React from 'react';
import { FileText } from 'lucide-react';

interface DocumentsPageHeaderProps {
  projectName: string;
}

const DocumentsPageHeader = ({ projectName }: DocumentsPageHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-6">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-indigo-100 rounded-xl">
          <FileText className="h-8 w-8 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documentos do Projeto</h1>
          <p className="text-gray-600 mt-1">
            Gerencie todos os documentos técnicos do projeto <strong>{projectName}</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DocumentsPageHeader;

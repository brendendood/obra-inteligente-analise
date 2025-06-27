
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Download, X, FileText, Archive } from 'lucide-react';

interface DocumentSearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onExportAll: () => void;
  onExportReport: () => void;
  documentsCount: number;
}

const DocumentSearchBar = ({ 
  searchTerm, 
  onSearchChange, 
  onExportAll,
  onExportReport,
  documentsCount 
}: DocumentSearchBarProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar documentos por nome..."
            className="pl-10 pr-10"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-600">
            {documentsCount} documento{documentsCount !== 1 ? 's' : ''}
          </span>
          
          {documentsCount > 0 && (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onExportReport}
                className="flex items-center space-x-2"
              >
                <FileText className="h-4 w-4" />
                <span>Relatório PDF</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={onExportAll}
                className="flex items-center space-x-2"
              >
                <Archive className="h-4 w-4" />
                <span>Baixar Tudo (.zip)</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentSearchBar;

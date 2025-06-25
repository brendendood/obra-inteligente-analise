
import { UploadIcon } from 'lucide-react';

const UploadHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-2xl w-fit mx-auto mb-6 shadow-xl">
        <UploadIcon className="h-12 w-12 text-white" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-3">
        Análise de Projetos com IA
      </h1>
      <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
        Faça upload do seu projeto arquitetônico e deixe nossa IA analisar cada detalhe para gerar orçamentos, cronogramas e insights técnicos
      </p>
    </div>
  );
};

export default UploadHeader;

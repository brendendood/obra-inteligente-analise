
import { UploadIcon } from 'lucide-react';

const UploadHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-2xl w-fit mx-auto mb-6 shadow-lg">
        <UploadIcon className="h-10 w-10 text-white" />
      </div>
      <h1 className="text-4xl font-bold text-slate-900 mb-2">
        Análise de Projetos
      </h1>
      <p className="text-xl text-slate-600 max-w-2xl mx-auto">
        Faça upload do seu projeto arquitetônico e deixe nossa IA analisar cada detalhe
      </p>
    </div>
  );
};

export default UploadHeader;

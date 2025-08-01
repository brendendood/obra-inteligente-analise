
import { LogoImage } from '@/components/ui/LogoImage';

const UploadHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="w-fit mx-auto mb-6">
        <LogoImage size="xl" clickable={false} />
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


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink, FileText } from 'lucide-react';

interface ProjectPDFViewerProps {
  projectName: string;
  pdfUrl: string | null;
}

export const ProjectPDFViewer = ({ projectName, pdfUrl }: ProjectPDFViewerProps) => {
  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `${projectName}.pdf`;
      link.click();
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2 text-blue-600" />
          Documento do Projeto
        </CardTitle>
        <CardDescription>
          Visualização do arquivo PDF enviado
        </CardDescription>
      </CardHeader>
      <CardContent>
        {pdfUrl ? (
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <iframe
                src={`${pdfUrl}#view=FitH`}
                className="w-full h-64 sm:h-96"
                title="PDF do Projeto"
              />
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <Button
                onClick={() => window.open(pdfUrl, '_blank')}
                variant="outline"
                className="flex-1"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Abrir em Nova Aba
              </Button>
              <Button
                onClick={handleDownload}
                variant="outline"
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Arquivo PDF não disponível</p>
            <p className="text-sm mt-1">Verifique se o arquivo foi enviado corretamente</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GettingStartedCard = () => {
  const navigate = useNavigate();

  return (
    <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] border-[#333] text-center py-12">
      <CardHeader>
        <div className="mx-auto mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-full w-fit">
          <Rocket className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold text-white mb-2">
          Bem-vindo ao ArchiAI!
        </CardTitle>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Comece enviando seu primeiro projeto e descubra como a inteligência artificial pode revolucionar sua análise de obras.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="space-y-2">
            <div className="bg-blue-500/20 p-3 rounded-lg w-fit">
              <Upload className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="font-semibold text-white">1. Envie seu PDF</h3>
            <p className="text-sm text-gray-400">
              Faça upload do seu projeto arquitetônico em formato PDF
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="bg-green-500/20 p-3 rounded-lg w-fit">
              <FileText className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="font-semibold text-white">2. IA Analisa</h3>
            <p className="text-sm text-gray-400">
              Nossa IA extrai informações e analisa automaticamente
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="bg-purple-500/20 p-3 rounded-lg w-fit">
              <Rocket className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="font-semibold text-white">3. Trabalhe</h3>
            <p className="text-sm text-gray-400">
              Gere orçamentos, cronogramas e converse com a IA
            </p>
          </div>
        </div>
        
        <Button
          onClick={() => navigate('/upload')}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-3"
        >
          <Upload className="h-5 w-5 mr-2" />
          Enviar Primeiro Projeto
        </Button>
      </CardContent>
    </Card>
  );
};

export default GettingStartedCard;

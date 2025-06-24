
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProject } from '@/contexts/ProjectContext';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload as UploadIcon, FileText, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Upload = () => {
  const { isAuthenticated } = useAuth();
  const { uploadProject } = useProject();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [file, setFile] = useState<File | null>(null);
  const [projectName, setProjectName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
        if (!projectName) {
          setProjectName(droppedFile.name.replace('.pdf', ''));
        }
      } else {
        toast({
          title: "❌ Formato inválido",
          description: "Apenas arquivos PDF são aceitos.",
          variant: "destructive",
        });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        if (!projectName) {
          setProjectName(selectedFile.name.replace('.pdf', ''));
        }
      } else {
        toast({
          title: "❌ Formato inválido",
          description: "Apenas arquivos PDF são aceitos.",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpload = async () => {
    if (!file || !projectName.trim()) {
      toast({
        title: "❌ Dados incompletos",
        description: "Selecione um arquivo PDF e defina um nome para o projeto.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const success = await uploadProject(file, projectName.trim());
      if (success) {
        toast({
          title: "🎉 Upload realizado!",
          description: "Seu projeto foi enviado e está sendo processado.",
        });
        navigate('/obras');
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">Enviar Novo Projeto</h1>
          <p className="text-gray-400 text-lg">
            Faça upload do seu projeto arquitetônico para análise com IA
          </p>
        </div>

        <Card className="bg-[#1a1a1a] border-[#333]">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <UploadIcon className="h-5 w-5 mr-2" />
              Upload de Arquivo PDF
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Drop Zone */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                dragActive 
                  ? 'border-blue-500 bg-blue-500/10' 
                  : 'border-[#333] hover:border-[#555]'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="space-y-4">
                  <div className="bg-green-500/20 p-4 rounded-lg inline-block">
                    <FileText className="h-8 w-8 text-green-400 mx-auto" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{file.name}</p>
                    <p className="text-gray-400 text-sm">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setFile(null)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Remover arquivo
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-[#333] p-4 rounded-lg inline-block">
                    <UploadIcon className="h-8 w-8 text-gray-400 mx-auto" />
                  </div>
                  <div>
                    <p className="text-white font-medium mb-2">
                      Arraste e solte seu arquivo PDF aqui
                    </p>
                    <p className="text-gray-400 text-sm mb-4">
                      ou clique para selecionar
                    </p>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload">
                      <Button variant="outline" className="cursor-pointer">
                        Selecionar Arquivo
                      </Button>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Project Name */}
            <div className="space-y-2">
              <label className="text-white font-medium">Nome do Projeto</label>
              <Input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Ex: Casa Residencial - São Paulo"
                className="bg-[#0d0d0d] border-[#333] text-white"
              />
            </div>

            {/* Requirements */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <h4 className="text-blue-400 font-medium">Requisitos do arquivo:</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Formato: PDF apenas</li>
                    <li>• Tamanho máximo: 50MB</li>
                    <li>• Plantas arquitetônicas legíveis</li>
                    <li>• Texto e medidas visíveis</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Upload Button */}
            <Button
              onClick={handleUpload}
              disabled={!file || !projectName.trim() || isUploading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50"
              size="lg"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processando...
                </>
              ) : (
                <>
                  <UploadIcon className="h-4 w-4 mr-2" />
                  Enviar Projeto
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-[#1a1a1a] border-[#333] text-center p-4">
            <div className="text-2xl mb-2">🤖</div>
            <h3 className="text-white font-medium mb-1">Análise Automática</h3>
            <p className="text-gray-400 text-sm">IA extrai informações do projeto</p>
          </Card>
          
          <Card className="bg-[#1a1a1a] border-[#333] text-center p-4">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="text-white font-medium mb-1">Orçamento Inteligente</h3>
            <p className="text-gray-400 text-sm">Cálculos automáticos de custos</p>
          </Card>
          
          <Card className="bg-[#1a1a1a] border-[#333] text-center p-4">
            <div className="text-2xl mb-2">📅</div>
            <h3 className="text-white font-medium mb-1">Cronograma</h3>
            <p className="text-gray-400 text-sm">Planejamento de etapas da obra</p>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Upload;

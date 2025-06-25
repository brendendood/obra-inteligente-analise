
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileDropzoneProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  onProjectNameChange: (name: string) => void;
  projectName: string;
}

const FileDropzone = ({ file, onFileSelect, onProjectNameChange, projectName }: FileDropzoneProps) => {
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile) {
      if (uploadedFile.type !== 'application/pdf') {
        toast({
          title: "❌ Arquivo inválido",
          description: "Apenas arquivos PDF são aceitos.",
          variant: "destructive",
        });
        return;
      }
      if (uploadedFile.size > 50 * 1024 * 1024) {
        toast({
          title: "❌ Arquivo muito grande",
          description: "O arquivo deve ter no máximo 50MB.",
          variant: "destructive",
        });
        return;
      }
      onFileSelect(uploadedFile);
      // Auto-fill project name with file name (without extension) if empty
      if (!projectName) {
        const nameWithoutExtension = uploadedFile.name.replace(/\.[^/.]+$/, "");
        onProjectNameChange(nameWithoutExtension);
      }
    }
  }, [toast, projectName, onFileSelect, onProjectNameChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false,
    maxSize: 50 * 1024 * 1024
  });

  const resetFile = () => {
    onFileSelect(null);
  };

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 mb-6 ${
        isDragActive 
          ? 'border-blue-500 bg-blue-50' 
          : file 
            ? 'border-green-500 bg-green-50'
            : 'border-slate-300 hover:border-blue-400 hover:bg-blue-50'
      }`}
    >
      <input {...getInputProps()} />
      
      {file ? (
        <div className="space-y-4">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
          <div>
            <p className="text-xl font-bold text-green-800 mb-2">Arquivo selecionado!</p>
            <p className="text-green-700 text-lg">{file.name}</p>
            <p className="text-green-600 text-sm">
              {(file.size / (1024 * 1024)).toFixed(1)} MB
            </p>
          </div>
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              resetFile();
            }}
            variant="outline"
            className="mt-4"
          >
            <X className="h-4 w-4 mr-2" />
            Remover arquivo
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <FileText className="h-16 w-16 text-slate-400 mx-auto" />
          <div>
            <p className="text-xl font-bold text-slate-700 mb-2">
              {isDragActive 
                ? 'Solte o arquivo aqui...' 
                : 'Selecione seu projeto PDF'
              }
            </p>
            <p className="text-slate-500">
              Máximo 50MB • Apenas arquivos PDF
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileDropzone;

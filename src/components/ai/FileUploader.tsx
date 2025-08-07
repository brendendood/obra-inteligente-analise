import React, { useRef, useState } from 'react';
import { Paperclip, X, Image, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
  isMobile?: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ 
  onFileSelected, 
  disabled = false,
  isMobile = false 
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Arquivo não suportado",
        description: "Apenas imagens (JPEG, PNG, GIF, WebP), PDF e arquivos de texto são aceitos.",
        variant: "destructive",
      });
      return;
    }

    // Validar tamanho (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O arquivo deve ter no máximo 10MB.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    onFileSelected(file);

    // Gerar preview para imagens
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="w-4 h-4" />;
    }
    return <File className="w-4 h-4" />;
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf,.txt"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />
      
      {selectedFile ? (
        <div className={cn(
          "flex items-center space-x-2 bg-muted/50 rounded-lg px-3 py-2 max-w-48",
          isMobile ? "text-xs" : "text-sm"
        )}>
          {preview ? (
            <img 
              src={preview} 
              alt="Preview" 
              className="w-8 h-8 object-cover rounded" 
            />
          ) : (
            <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
              {getFileIcon(selectedFile)}
            </div>
          )}
          <span className="truncate text-foreground max-w-24">
            {selectedFile.name}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearFile}
            className="h-6 w-6 p-0 hover:bg-destructive/10"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          size={isMobile ? "sm" : "icon"}
          onClick={openFileDialog}
          disabled={disabled}
          className={cn(
            "transition-colors",
            isMobile ? "h-9 px-3" : "h-10 w-10"
          )}
          title="Anexar arquivo"
        >
          <Paperclip className={cn(isMobile ? "w-4 h-4" : "w-4 h-4")} />
          {isMobile && <span className="ml-1 text-xs">Anexar</span>}
        </Button>
      )}
    </div>
  );
};
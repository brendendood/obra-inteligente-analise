
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FileDropzone from '@/components/upload/FileDropzone';
import { useBrazilLocations } from '@/hooks/useBrazilLocations';
import { useEffect } from 'react';

interface UploadProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectName: string;
  setProjectName: (name: string) => void;
  file: File | null;
  setFile: (file: File | null) => void;
  stateUF: string;
  setStateUF: (uf: string) => void;
  cityName: string;
  setCityName: (city: string) => void;
  onSubmit: () => void;
  submitting?: boolean;
}

const UploadProjectDialog = ({
  open,
  onOpenChange,
  projectName,
  setProjectName,
  file,
  setFile,
  stateUF,
  setStateUF,
  cityName,
  setCityName,
  onSubmit,
  submitting = false,
}: UploadProjectDialogProps) => {
  const { stateOptions, cityOptions, loadCities, loadingCities, loadingStates } = useBrazilLocations();

  useEffect(() => {
    if (stateUF) loadCities(stateUF);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateUF]);

  const canSubmit = !!file && !!projectName.trim() && !!stateUF && !!cityName;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100svw-2rem)] max-w-[calc(100svw-2rem)] sm:max-w-xl max-h-[85dvh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>Novo Projeto</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div>
            <Label htmlFor="project-name">Nome do Projeto *</Label>
            <Input
              id="project-name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Ex: Residência Silva, Apartamento Copacabana..."
              className="mt-2"
            />
          </div>

          <div>
            <Label>Arquivo do Projeto (PDF) *</Label>
            <div className="mt-2">
              <FileDropzone
                file={file}
                onFileSelect={setFile}
                onProjectNameChange={setProjectName}
                projectName={projectName}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Estado (UF) *</Label>
              <Select value={stateUF} onValueChange={(v) => { setStateUF(v); setCityName(''); }}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder={loadingStates ? 'Carregando...' : 'Selecione o estado'} />
                </SelectTrigger>
                <SelectContent className="z-50 bg-background">
                  {stateOptions.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Cidade *</Label>
              <Select value={cityName} onValueChange={setCityName} disabled={!stateUF || loadingCities}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder={!stateUF ? 'Selecione um estado primeiro' : (loadingCities ? 'Carregando...' : 'Selecione a cidade')} />
                </SelectTrigger>
                <SelectContent className="z-50 bg-background">
                  {cityOptions.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">Todos os campos são obrigatórios.</p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>Cancelar</Button>
          <Button onClick={onSubmit} disabled={!canSubmit || submitting}>
            {submitting ? 'Enviando...' : 'Salvar e enviar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadProjectDialog;

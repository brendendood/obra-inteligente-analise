
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProjectNameFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const ProjectNameField = ({ value, onChange, disabled = false }: ProjectNameFieldProps) => {
  return (
    <div className="mb-6">
      <Label htmlFor="projectName" className="text-lg font-semibold text-slate-700 mb-2 block">
        Nome do Projeto *
      </Label>
      <Input
        id="projectName"
        type="text"
        placeholder="Ex: Residência Silva, Apartamento Copacabana..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-lg p-4 border-2 border-slate-300 focus:border-blue-500"
        disabled={disabled}
      />
      <p className="text-sm text-slate-500 mt-1">
        Defina um nome personalizado para identificar seu projeto
      </p>
    </div>
  );
};

export default ProjectNameField;

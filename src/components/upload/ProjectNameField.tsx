
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProjectNameFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const ProjectNameField = ({ value, onChange, disabled = false }: ProjectNameFieldProps) => {
  return (
    <div className="mb-4 sm:mb-6 w-full">
      <Label 
        htmlFor="projectName" 
        className="text-base sm:text-lg font-semibold text-slate-700 mb-2 block"
      >
        Nome do Projeto *
      </Label>
      <Input
        id="projectName"
        type="text"
        placeholder="Ex: Residência Silva, Apartamento Copacabana..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-base sm:text-lg p-3 sm:p-4 border-2 border-slate-300 focus:border-blue-500 w-full"
        style={{ fontSize: '16px' }} // Previne zoom no iOS
        disabled={disabled}
      />
      <p className="text-xs sm:text-sm text-slate-500 mt-1">
        Defina um nome personalizado para identificar seu projeto
      </p>
    </div>
  );
};

export default ProjectNameField;

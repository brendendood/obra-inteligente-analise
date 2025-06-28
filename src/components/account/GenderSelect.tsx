
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface GenderSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
}

export const GenderSelect = ({ value, onValueChange }: GenderSelectProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="gender">Gênero</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id="gender">
          <SelectValue placeholder="Selecione seu gênero" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="male">Masculino</SelectItem>
          <SelectItem value="female">Feminino</SelectItem>
          <SelectItem value="neutral">Prefiro não informar</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

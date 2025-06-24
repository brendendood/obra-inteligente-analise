
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  icon?: LucideIcon;
  disabled?: boolean;
  className?: string;
}

const FormField = ({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  icon: Icon,
  disabled = false,
  className
}: FormFieldProps) => {
  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={id} className="text-foreground dark:text-[#f2f2f2]">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-[#bbbbbb]" />
        )}
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={cn(
            Icon && 'pl-10',
            error && 'border-red-500 focus-visible:ring-red-500',
            disabled && 'opacity-50 cursor-not-allowed',
            'bg-background dark:bg-[#232323] border-border dark:border-[#333] text-foreground dark:text-[#f2f2f2] placeholder:text-muted-foreground dark:placeholder:text-[#bbbbbb] transition-all duration-200'
          )}
          required={required}
        />
      </div>
      {error && (
        <p className="text-sm text-red-500 animate-fade-in">{error}</p>
      )}
    </div>
  );
};

export default FormField;
